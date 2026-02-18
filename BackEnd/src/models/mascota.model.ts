import { pool } from "../config/database";
import { IMascota } from "../interfaces";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class MascotaModel {
  // Crear una nueva mascota
  static async create(mascota: Partial<IMascota>): Promise<number> {
    const { nombre, especie, raza, sexo, fecha_nacimiento, peso, dueno_id } =
      mascota;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO mascotas (nombre, especie, raza, sexo, fecha_nacimiento, peso, dueno_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre || "",
        especie || "",
        raza !== undefined ? raza : null,
        sexo || "MACHO",
        fecha_nacimiento || null,
        peso || null,
        dueno_id,
      ],
    );

    return result.insertId;
  }

  // Obtener mascotas por dueño
  static async findByDuenoId(duenoId: number): Promise<any[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT m.*, 
                    u.nombre as dueno_nombre, 
                    u.apellido as dueno_apellido,
                    u.email as dueno_email,
                    d.telefono as dueno_telefono,
                    d.dni as dueno_dni
             FROM mascotas m
             JOIN duenos d ON m.dueno_id = d.id
             JOIN usuarios u ON d.usuario_id = u.id
             WHERE m.dueno_id = ?
             ORDER BY m.creado_en DESC`,
      [duenoId],
    );

    return rows;
  }

  // Obtener una mascota por ID (con datos del dueño)
  static async findById(id: number): Promise<any | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT m.*, 
                    u.nombre as dueno_nombre, 
                    u.apellido as dueno_apellido,
                    u.email as dueno_email,
                    d.telefono as dueno_telefono,
                    d.dni as dueno_dni
             FROM mascotas m
             JOIN duenos d ON m.dueno_id = d.id
             JOIN usuarios u ON d.usuario_id = u.id
             WHERE m.id = ?`,
      [id],
    );

    return rows[0] || null;
  }

  // Actualizar mascota (sin verificar dueño - para admin/vet)
  static async updateAdmin(
    id: number,
    data: Partial<IMascota>,
  ): Promise<boolean> {
    const fields = [];
    const values = [];

    if (data.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(data.nombre);
    }
    if (data.especie !== undefined) {
      fields.push("especie = ?");
      values.push(data.especie);
    }
    if (data.raza !== undefined) {
      fields.push("raza = ?");
      values.push(data.raza);
    }
    if (data.sexo !== undefined) {
      fields.push("sexo = ?");
      values.push(data.sexo);
    }
    if (data.fecha_nacimiento !== undefined) {
      fields.push("fecha_nacimiento = ?");
      values.push(data.fecha_nacimiento);
    }
    if (data.peso !== undefined) {
      fields.push("peso = ?");
      values.push(data.peso);
    }
    if (data.dueno_id !== undefined) {
      fields.push("dueno_id = ?");
      values.push(data.dueno_id);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE mascotas SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows > 0;
  }

  // Eliminar mascota (sin verificar dueño - solo admin)
  static async deleteAdmin(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM mascotas WHERE id = ?",
      [id],
    );

    return result.affectedRows > 0;
  }

  // Obtener todas las mascotas (para admin y veterinarios)
  static async findAll(): Promise<any[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT m.*, 
                    u.nombre as dueno_nombre, 
                    u.apellido as dueno_apellido,
                    u.email as dueno_email,
                    d.telefono as dueno_telefono,
                    d.dni as dueno_dni
             FROM mascotas m
             JOIN duenos d ON m.dueno_id = d.id
             JOIN usuarios u ON d.usuario_id = u.id
             ORDER BY m.creado_en DESC`,
    );

    return rows;
  }

  // Verificar si una mascota existe
  static async exists(id: number): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM mascotas WHERE id = ?",
      [id],
    );

    return rows.length > 0;
  }
}
