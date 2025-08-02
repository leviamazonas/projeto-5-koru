async function buscarCep(cep) {
  const url = `https://brasilapi.com.br/api/cep/v2/${cep}`;

  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Erro ao buscar CEP: ${resposta.statusText}`);
  }

  const data = await resposta.json();
  if (!data.city || !data.state) {
    throw new Error('Dados de cidade ou estado não encontrados na resposta');
  }

  const { city: cidade, state: estado } = data;

  const cidadeUrl = `https://brasilapi.com.br/api/cptec/v1/cidade/${cidade}`;
  const respostaCidade = await fetch(cidadeUrl);
  if (!respostaCidade.ok) {
    throw new Error(`Erro ao buscar cidade: ${respostaCidade.statusText}`);
  }

  const dataCidade = await respostaCidade.json();
  if (!Array.isArray(dataCidade)) {
    throw new Error('Dados de cidade inválidos');
  }

  const cidadeEncontrada = dataCidade.find(item => item.estado === estado);

  if (!cidadeEncontrada) {
    throw new Error(`Cidade ${cidade} não encontrada no estado ${estado}`);
  }

  return {
    cidade,
    estado,
    codigoCidade: cidadeEncontrada.id
  };
}

async function main(cep) {
  try {
    const response = await buscarCep(cep);

    console.log(`
    Cidade: ${response.cidade}
    Estado: ${response.estado}
    Cidade_Id: ${response.codigoCidade}
  `);
  } catch (error) {
    console.error(`Erro: ${error.message}`);
  }
}

main(58701406);
