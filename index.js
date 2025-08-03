import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  buscarCep,
  buscarClimaOpenWeather,
  extrairPrevisaoDiaria,
} from "./src/services/cli.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir a pasta Public (front-end)
app.use(express.static(path.join(__dirname, "index.html")));

// Endpoint para buscar clima
app.get("/clima/:cep", async (req, res) => {
  try {
    const { cep } = req.params;

    // Busca informações do CEP
    const dadosCidade = await buscarCep(cep);

    // Busca informações de clima
    const climaDados = await buscarClimaOpenWeather(
      dadosCidade.cidade,
      dadosCidade.estado,
      process.env.OPENWEATHER_API_KEY
    );

    // Extrai previsão diária
    const previsaoDiaria = extrairPrevisaoDiaria(climaDados.previsao);

    // Retorna JSON para o front
    res.json({
      cidade: dadosCidade.cidade,
      estado: dadosCidade.estado,
      climaAtual: climaDados.climaAtual,
      previsao: previsaoDiaria,
    });
  } catch (error) {
    console.error("Erro no endpoint /clima:", error.message);
    res.status(500).json({ erro: error.message });
  }
});

// Rota padrão - carrega o front
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log("🌐 Acesse: http://localhost:" + PORT);
});
