async function buscarCep(cep) {
  const url = `https://brasilapi.com.br/api/cep/v2/${cep}`;

  try {
    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new Error(`Erro ao buscar CEP: ${resposta.statusText}`);
    }
    const data = await resposta.json();
    const cidade = data.city;
    const estado = data.state;

    cidadeUrl = `https://brasilapi.com.br/api/cptec/v1/cidade/${cidade}`;
    const respostaCidade = await fetch(cidadeUrl);
    if (!respostaCidade.ok) {
      throw new Error(`Erro ao buscar cidade ${respostaCidade.statusText}`);
    }
    const dataCidade = await respostaCidade.json();
    const cidadeEncontrada = dataCidade.find(item => item.estado === estado);
    if (!cidadeEncontrada) {
      throw new Error(`Cidade ${cidade} não encontrada no estado ${estado}`);
    }
    return {
      cidade: cidade,
      estado: estado,
      códigoCidade: cidadeEncontrada.id

    }

  } catch (error) {
    console.error(`Erro: ${error.message}`);
  }
}
buscarCep(69027640)
  .then(resultado => {
    console.log(`Cidade: ${resultado.cidade}`);
    console.log(`Estado: ${resultado.estado}`);
    console.log(`ID da Cidade: ${resultado.códigoCidade}`); 
  })
  .catch(erro => {
    console.error(`Falha na operação: ${erro.message}`);
  });