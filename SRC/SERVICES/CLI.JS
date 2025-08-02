async function buscarCep(cep) {
 const url= `https://brasilapi.com.br/api/cep/v2/${cep}`
 const resposta = await fetch(url);
 const data =await resposta.json ();
 console.log(data);
}
  buscarCep('22711-315')