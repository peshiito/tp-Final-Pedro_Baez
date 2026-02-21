import { pool } from "../config/database";
import { IUsuario } from "../interfaces";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { hashPassword, comparePassword } from "../utils/bcrypt.helper";

export class UsuarioModel {
  static async create(usuario: Partial<IUsuario>): Promise<number> {
    const { nombre, apellido, email, password, direccion, rol_id } = usuario;
    const hashedPassword = await hashPassword(password!);

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO usuarios (nombre, apellido, email, password, direccion, rol_id) 
             VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, email, hashedPassword, direccion, rol_id],
    );

    return result.insertId;
  }

  static async findByEmail(
    email: string,
  ): Promise<(IUsuario & RowDataPacket) | null> {
    const [rows] = await pool.execute<(IUsuario & RowDataPacket)[]>(
      "SELECT * FROM usuarios WHERE email = ? AND activo = true",
      [email],
    );

    return rows[0] || null;
  }

  static async findById(
    id: number,
  ): Promise<(IUsuario & RowDataPacket) | null> {
    const [rows] = await pool.execute<(IUsuario & RowDataPacket)[]>(
      "SELECT * FROM usuarios WHERE id = ? AND activo = true",
      [id],
    );

    return rows[0] || null;
  }

  // NUEVO MÉTODO: Obtener todos los usuarios
  static async findAll(): Promise<(IUsuario & RowDataPacket)[]> {
    const [rows] = await pool.execute<(IUsuario & RowDataPacket)[]>(
      "SELECT id, nombre, apellido, email, direccion, rol_id, activo, creado_en FROM usuarios WHERE activo = true ORDER BY id DESC",
    );

    return rows;
  }

  static async getRolId(rolNombre: string): Promise<number | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM roles WHERE nombre = ?",
      [rolNombre],
    );
    return rows[0]?.id || null;
  }

  static async getRolName(rolId: number): Promise<string | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT nombre FROM roles WHERE id = ?",
      [rolId],
    );
    return rows[0]?.nombre || null;
  }

  static async verifyPassword(
    email: string,
    password: string,
  ): Promise<IUsuario | null> {
    const usuario = await this.findByEmail(email);

    if (!usuario) return null;

    const valid = await comparePassword(password, usuario.password);
    return valid ? usuario : null;
  }
}
