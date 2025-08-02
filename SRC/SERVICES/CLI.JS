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
    console.log(`Cidade:${cidade}, Estado:${estado}`);
  } catch (error) {
    console.error(`Erro: ${error.message}`);
  }
}
buscarCep(2271131);
