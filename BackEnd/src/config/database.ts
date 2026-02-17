import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Configuración del pool de conexiones
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "curso_user",
  password: process.env.DB_PASSWORD || "curso123",
  database: process.env.DB_NAME || "curso_backend",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export const connectDB = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conectado a MySQL correctamente");
    console.log(`   📊 Base de datos: ${process.env.DB_NAME}`);
    console.log(`   👤 Usuario: ${process.env.DB_USER}`);
    console.log(`   🌐 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    connection.release();
  } catch (error) {
    console.error("❌ Error conectando a MySQL:");
    console.error(`   Host: ${process.env.DB_HOST}`);
    console.error(`   Usuario: ${process.env.DB_USER}`);
    console.error(`   Base de datos: ${process.env.DB_NAME}`);
    console.error("");
    console.error("   Posibles soluciones:");
    console.error("   1. ¿Está Docker corriendo? → docker ps");
    console.error("   2. ¿Está MySQL levantado? → docker compose up -d");
    console.error("   3. Verificar credenciales en .env");
    console.error(
      "   4. Probar conexión manual: docker exec -it curso_mysql mysql -u curso_user -pcurso123",
    );
    console.error("");
    console.error("   Error detallado:", error);
    process.exit(1);
  }
};
