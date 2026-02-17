import { pool } from "../config/database";
import { IVeterinario } from "../interfaces";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class VeterinarioModel {
  static async create(data: {
    usuario_id: number;
    matricula: string;
    especialidad?: string;
  }): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO veterinarios (usuario_id, matricula, especialidad) VALUES (?, ?, ?)`,
      [data.usuario_id, data.matricula, data.especialidad || null],
    );

    return result.insertId;
  }

  static async findByUsuarioId(usuarioId: number): Promise<any | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT v.*, u.nombre, u.apellido, u.email, u.direccion 
             FROM veterinarios v
             JOIN usuarios u ON v.usuario_id = u.id
             WHERE v.usuario_id = ?`,
      [usuarioId],
    );

    return rows[0] || null;
  }

  static async findByMatricula(matricula: string): Promise<any | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM veterinarios WHERE matricula = ?",
      [matricula],
    );

    return rows[0] || null;
  }
}
