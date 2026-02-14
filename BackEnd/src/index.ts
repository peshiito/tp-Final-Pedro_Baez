import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json()); // para parsear JSON

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API de Patitas Felices" });
});

// Iniciar servidor después de verificar DB
async function startServer() {
  await testConnection();

  app.listen(PORT, () => {
    console.log("=================================");
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log("=================================");
  });
}

startServer();
