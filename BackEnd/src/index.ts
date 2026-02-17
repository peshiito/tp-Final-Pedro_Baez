import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Colores para consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
};

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", authRoutes);

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando",
    timestamp: new Date().toISOString(),
  });
});

// Mostrar banner
const showBanner = () => {
  console.log(`${colors.cyan}${colors.bright}`);
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║                                                          ║");
  console.log("║   🐾  VETERINARIA PATITAS FELICES - BACKEND  🐾          ║");
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log(`${colors.reset}`);
};

// Mostrar URLs
const showUrls = () => {
  console.log(
    `${colors.green}${colors.bright}✅ SERVIDOR INICIADO CORRECTAMENTE${colors.reset}`,
  );
  console.log("");
  console.log(`${colors.yellow}📌 ENDPOINTS:${colors.reset}`);
  console.log(
    `${colors.blue}   └─ API:${colors.reset} http://localhost:${PORT}`,
  );
  console.log(
    `${colors.blue}   └─ Health:${colors.reset} http://localhost:${PORT}/api/health`,
  );
  console.log("");
  console.log(`${colors.magenta}🐘 DOCKER:${colors.reset}`);
  console.log(
    `${colors.blue}   └─ MySQL:${colors.reset} localhost:3306 (curso_backend)`,
  );
  console.log(
    `${colors.blue}   └─ phpMyAdmin:${colors.reset} ${colors.bright}http://localhost:8080${colors.reset}`,
  );
  console.log(`      └─ Usuario: ${colors.green}root${colors.reset}`);
  console.log(`      └─ Password: ${colors.green}root123${colors.reset}`);
  console.log(
    `      └─ Base de datos: ${colors.green}curso_backend${colors.reset}`,
  );
  console.log("");
  console.log(`${colors.yellow}📝 CREDENCIALES BACKEND:${colors.reset}`);
  console.log(`   └─ DB User: ${colors.green}curso_user${colors.reset}`);
  console.log(`   └─ DB Password: ${colors.green}curso123${colors.reset}`);
  console.log("");
};

// Iniciar servidor
const startServer = async () => {
  try {
    showBanner();

    console.log(
      `${colors.yellow}⏳ Conectando a MySQL via Docker...${colors.reset}`,
    );
    await connectDB();

    app.listen(PORT, () => {
      showUrls();
      console.log(
        `${colors.cyan}🚀 Servidor listo para recibir peticiones${colors.reset}`,
      );
      console.log(
        `${colors.bright}Presiona Ctrl+C para detener${colors.reset}`,
      );
      console.log("");
    });
  } catch (error) {
    console.error(`${colors.red}❌ Error fatal:${colors.reset}`, error);
    process.exit(1);
  }
};

startServer();
