import { pool } from "../config/database";
import { hashPassword } from "../utils/bcrypt.helper";

const createAdmin = async () => {
  try {
    // Obtener ID del rol ADMIN
    const [roles] = await pool.execute(
      'SELECT id FROM roles WHERE nombre = "ADMIN"',
    );
    const adminRolId = (roles as any[])[0]?.id;

    if (!adminRolId) {
      console.error("❌ No se encontró el rol ADMIN");
      process.exit(1);
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword("admin123");

    // Insertar admin
    await pool.execute(
      `INSERT INTO usuarios (nombre, apellido, email, password, rol_id) 
             VALUES (?, ?, ?, ?, ?)`,
      [
        "Admin",
        "Principal",
        "admin@veterinaria.com",
        hashedPassword,
        adminRolId,
      ],
    );

    console.log("✅ Admin creado exitosamente");
    console.log("📧 Email: admin@veterinaria.com");
    console.log("🔑 Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creando admin:", error);
    process.exit(1);
  }
};

createAdmin();
