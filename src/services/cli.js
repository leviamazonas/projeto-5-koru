import "dotenv/config";
console.log("🔑 API Key carregada:", process.env.OPENWEATHER_API_KEY);

// ---------- Funções exportadas (usadas pelo index.js) ----------
export async function buscarCep(cep) {
  const url = `https://brasilapi.com.br/api/cep/v2/${cep}`;
  const resposta = await fetch(url);
  if (!resposta.ok)
    throw new Error(`Erro ao buscar CEP: ${resposta.statusText}`);

  const data = await resposta.json();
  if (!data.city || !data.state)
    throw new Error("Cidade ou estado não encontrados");

  const { city: cidade, state: estado } = data;

  return { cidade, estado };
}

export async function buscarClimaOpenWeather(cidade, estado, apiKey) {
  const urlAtual = `https://api.openweathermap.org/data/2.5/weather?q=${cidade},${estado},BR&appid=${apiKey}&units=metric&lang=pt`;
  const urlPrevisao = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade},${estado},BR&appid=${apiKey}&units=metric&lang=pt`;

  const respostaAtual = await fetch(urlAtual);
  if (!respostaAtual.ok)
    throw new Error(`Erro ao buscar clima: ${respostaAtual.statusText}`);
  const dadosAtual = await respostaAtual.json();

  const respostaPrevisao = await fetch(urlPrevisao);
  if (!respostaPrevisao.ok)
    throw new Error(`Erro ao buscar previsão: ${respostaPrevisao.statusText}`);
  const dadosPrevisao = await respostaPrevisao.json();

  return {
    climaAtual: {
      temperatura: dadosAtual.main.temp,
      umidade: dadosAtual.main.humidity,
      vento: dadosAtual.wind.speed,
      descricao: dadosAtual.weather[0].description,
    },
    previsao: dadosPrevisao,
  };
}

export function extrairPrevisaoDiaria(previsao) {
  const previsoesDiarias = {};
  previsao.list.forEach((item) => {
    const data = item.dt_txt.split(" ")[0];
    if (!previsoesDiarias[data]) {
      previsoesDiarias[data] = {
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        condicao: item.weather[0].description,
      };
    } else {
      if (item.main.temp_min < previsoesDiarias[data].tempMin) {
        previsoesDiarias[data].tempMin = item.main.temp_min;
      }
      if (item.main.temp_max > previsoesDiarias[data].tempMax) {
        previsoesDiarias[data].tempMax = item.main.temp_max;
      }
    }
  });
  return previsoesDiarias;
}

// ---------- Execução direta via terminal ----------
if (process.argv.length > 2) {
  const cep = process.argv[2];
  buscarCep(cep)
    .then(async (dados) => {
      console.log(`\nCidade: ${dados.cidade} - ${dados.estado}`);
      const clima = await buscarClimaOpenWeather(
        dados.cidade,
        dados.estado,
        process.env.OPENWEATHER_API_KEY
      );

      console.log(`\nClima atual:`);
      console.log(`🌡️ Temperatura: ${clima.climaAtual.temperatura}°C`);
      console.log(`💧 Umidade: ${clima.climaAtual.umidade}%`);
      console.log(`🌬️ Vento: ${clima.climaAtual.vento} m/s`);
      console.log(`☁️ Condição: ${clima.climaAtual.descricao}`);

      const previsaoDiaria = extrairPrevisaoDiaria(clima.previsao);
      console.log(`\n📅 Previsão:`);
      for (const [dataPrev, info] of Object.entries(previsaoDiaria)) {
        console.log(
          `${dataPrev} → Min: ${info.tempMin.toFixed(
            1
          )}°C | Max: ${info.tempMax.toFixed(1)}°C | ${info.condicao}`
        );
      }
    })
    .catch((err) => console.error("❌ Erro:", err.message));
}
