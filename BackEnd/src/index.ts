import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "./routes/auth.routes";
import mascotaRoutes from "./routes/mascota.routes";
import duenoRoutes from "./routes/dueno.routes";
import usuarioRoutes from "./routes/usuarios.routes";
import veterinarioRoutes from "./routes/veterinario.routes"; // 👈 AGREGADO
import historialRoutes from "./routes/historial.routes"; // 👈 AGREGADO

dotenv.config();

const app: Application = express();
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
app.use("/api/mascotas", mascotaRoutes);
app.use("/api/duenos", duenoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/veterinarios", veterinarioRoutes); // 👈 AGREGADO
app.use("/api/historial", historialRoutes); // 👈 AGREGADO

// Ruta de prueba
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando",
    timestamp: new Date().toISOString(),
  });
});

// Manejo de errores 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// Middleware de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.stack);

  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(status).json({
    message,
    error: process.env.NODE_ENV === "development" ? err : {},
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
  console.log(`${colors.yellow}📌 ENDPOINTS DISPONIBLES:${colors.reset}`);
  console.log(
    `${colors.blue}   └─ API:${colors.reset} http://localhost:${PORT}`,
  );
  console.log(
    `${colors.blue}   └─ Health:${colors.reset} http://localhost:${PORT}/api/health`,
  );
  console.log(
    `${colors.blue}   └─ Auth:${colors.reset} http://localhost:${PORT}/api/auth/login`,
  );
  console.log(
    `${colors.blue}   └─ Mascotas:${colors.reset} http://localhost:${PORT}/api/mascotas`,
  );
  console.log(
    `${colors.blue}   └─ Dueños:${colors.reset} http://localhost:${PORT}/api/duenos`,
  );
  console.log(
    `${colors.blue}   └─ Usuarios:${colors.reset} http://localhost:${PORT}/api/usuarios`,
  );
  console.log(
    `${colors.blue}   └─ Veterinarios:${colors.reset} http://localhost:${PORT}/api/veterinarios`, // 👈 AGREGADO
  );
  console.log(
    `${colors.blue}   └─ Historial:${colors.reset} http://localhost:${PORT}/api/historial`, // 👈 AGREGADO
  );
  console.log("");
  console.log(`${colors.magenta}🐘 DOCKER:${colors.reset}`);
  console.log(
    `${colors.blue}   └─ MySQL:${colors.reset} localhost:3306 (veterinaria_db)`,
  );
  console.log(
    `${colors.blue}   └─ phpMyAdmin:${colors.reset} ${colors.bright}http://localhost:8080${colors.reset}`,
  );
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
