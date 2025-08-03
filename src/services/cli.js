async function buscarCep(cep) {
  const url = `https://brasilapi.com.br/api/cep/v2/${cep}`;

  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Erro ao buscar CEP: ${resposta.statusText}`);
  }

  const data = await resposta.json();
  if (!data.city || !data.state) {
    throw new Error("Dados de cidade ou estado não encontrados na resposta");
  }

  const { city: cidade, state: estado } = data;

  const cidadeUrl = `https://brasilapi.com.br/api/cptec/v1/cidade/${cidade}`;
  const respostaCidade = await fetch(cidadeUrl);
  if (!respostaCidade.ok) {
    throw new Error(`Erro ao buscar cidade: ${respostaCidade.statusText}`);
  }

  const dataCidade = await respostaCidade.json();
  if (!Array.isArray(dataCidade)) {
    throw new Error("Dados de cidade inválidos");
  }

  const cidadeEncontrada = dataCidade.find((item) => item.estado === estado);

  if (!cidadeEncontrada) {
    throw new Error(`Cidade ${cidade} não encontrada no estado ${estado}`);
  }

  return {
    cidade,
    estado,
    codigoCidade: cidadeEncontrada.id,
  };
}
async function buscarClimaOpenWeather(cidade, estado, apiKey) {
  const urlAtual = `https://api.openweathermap.org/data/2.5/weather?q=${cidade},${estado},BR&appid=${apiKey}&units=metric&lang=pt`;
  const urlPrevisao = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade},${estado},BR&appid=${apiKey}&units=metric&lang=pt`;

  const respostaAtual = await fetch(urlAtual);
  if (!respostaAtual.ok) {
    throw new Error(`Erro ao buscar clima atual: ${respostaAtual.statusText}`);
  }
  const dadosAtual = await respostaAtual.json();

  const respostaPrevisao = await fetch(urlPrevisao);
  if (!respostaPrevisao.ok) {
    throw new Error(`Erro ao buscar previsão: ${respostaPrevisao.statusText}`);
  }
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

function extrairPrevisaoDiaria(previsao) {
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
async function main(cep) {
  try {
    const response = await buscarCep(cep);

    console.log(`
    Cidade: ${response.cidade}
    Estado: ${response.estado}
    Cidade_Id: ${response.codigoCidade}
  `);
    const apiKey = "45cb046c019960723f8ed962f02543ee";

    const climaDados = await buscarClimaOpenWeather(
      response.cidade,
      response.estado,
      apiKey
    );

    console.log(`\nClima atual:`);
    console.log(`Temperatura: ${climaDados.climaAtual.temperatura}°C`);
    console.log(`Umidade: ${climaDados.climaAtual.umidade}%`);
    console.log(`Velocidade do vento: ${climaDados.climaAtual.vento} m/s`);
    console.log(`Descrição: ${climaDados.climaAtual.descricao}`);

    const previsaoDiaria = extrairPrevisaoDiaria(climaDados.previsao);

    console.log(`\nPrevisão para os próximos dias:`);

    for (const [data, info] of Object.entries(previsaoDiaria)) {
      console.log(
        `- ${data}: Min ${info.tempMin.toFixed(
          1
        )}°C, Max ${info.tempMax.toFixed(1)}°C, Condição: ${info.condicao}`
      );
    }
  } catch (error) {
    console.error(`Erro: ${error.message}`);
  }
}

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("Digite o CEP da cidade: ", (cep) => {
  main(cep);
  readline.close();
});

