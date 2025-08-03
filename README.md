# Previsão do Tempo 5 Dias

Este projeto foi desenvolvido como uma aplicação prática no **Programa Desenvolve (Grupo Boticário & Koru)**, focado em **Desenvolvimento de Software**. Ele tem como objetivo buscar e exibir o clima atual e a previsão para os próximos 5 dias de uma cidade brasileira, utilizando um CEP fornecido pelo usuário.

---

## Funcionalidades

- **Busca de CEP:** Obtém cidade e estado via BrasilAPI.
- **Clima e Previsão:** Consulta dados climáticos atuais e previsão de 5 dias na OpenWeatherMap.
- **Previsão Diária:** Extrai temperaturas mínimas/máximas e condições climáticas diárias.
- **Interface CLI:** Interação simples via terminal.

---

## Tecnologias

- **Node.js**
- **BrasilAPI**
- **OpenWeatherMap API**
- **Express** (para servir a versão Web)
- **`dotenv`** (para chaves de API)

---

## Como Rodar

### Pré-requisitos

- **Node.js** (baixe em [nodejs.org](https://nodejs.org/)).

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/leviamazonas/projeto-5-koru.git
    cd projeto-5-koru
    ```
2.  **Instale dependências:**
    ```bash
    npm install dotenv 
    npm install express
    ```
3.  **Configure o `.env`:**
    Crie um arquivo `.env` na raiz do projeto com sua chave da OpenWeatherMap:
    ```
    OPENWEATHER_API_KEY=SUA_CHAVE_AQUI
    ```
    (Obtenha sua chave em [openweathermap.org/api](https://openweathermap.openweathermap.org/api)).

    > ⚠️ Por se tratar de um projeto acadêmico, o arquivo `.env` contendo a chave **não foi ignorado** no repositório.
    
4.  **Execute o projeto:**
    ```bash
     node src/services/cli.js + cep
    ```
5.  **Rodar a Interface Web (localhost):**
    Inicie o servidor Express: npm start
    Acesse no navegador:http://localhost:SUA_PORTA
