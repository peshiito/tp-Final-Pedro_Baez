import { pool, connectDB } from "../config/database";
import { IDueno } from "../interfaces";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { UsuarioModel } from "./usuario.model";

export class DuenoModel {
  static async create(data: {
    usuario_id: number;
    telefono?: string;
    dni?: string;
  }): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO duenos (usuario_id, telefono, dni) VALUES (?, ?, ?)`,
      [data.usuario_id, data.telefono || null, data.dni || null],
    );

    return result.insertId;
  }

  static async findByUsuarioId(usuarioId: number): Promise<any | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT d.*, u.nombre, u.apellido, u.email, u.direccion 
             FROM duenos d
             JOIN usuarios u ON d.usuario_id = u.id
             WHERE d.usuario_id = ?`,
      [usuarioId],
    );

    return rows[0] || null;
  }
}
