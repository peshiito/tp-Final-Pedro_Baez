import { pool } from "../config/database";
import { IHistorialClinico } from "../interfaces";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class HistorialModel {
  // Crear una nueva entrada en el historial
  static async create(historial: Partial<IHistorialClinico>): Promise<number> {
    const {
      mascota_id,
      veterinario_id,
      fecha,
      tipo,
      diagnostico,
      tratamiento,
      observaciones,
    } = historial;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO historiales_clinicos 
             (mascota_id, veterinario_id, fecha, tipo, diagnostico, tratamiento, observaciones) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        mascota_id,
        veterinario_id,
        fecha,
        tipo,
        diagnostico,
        tratamiento || null,
        observaciones || null,
      ],
    );

    return result.insertId;
  }

  // Obtener historial por mascota
  static async findByMascotaId(mascotaId: number): Promise<any[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT h.*, 
                    m.nombre as mascota_nombre,
                    u.nombre as veterinario_nombre,
                    u.apellido as veterinario_apellido
             FROM historiales_clinicos h
             JOIN mascotas m ON h.mascota_id = m.id
             JOIN veterinarios v ON h.veterinario_id = v.id
             JOIN usuarios u ON v.usuario_id = u.id
             WHERE h.mascota_id = ?
             ORDER BY h.fecha DESC, h.creado_en DESC`,
      [mascotaId],
    );

    return rows;
  }

  // Obtener una entrada específica
  static async findById(id: number): Promise<any | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT h.*, 
                    m.nombre as mascota_nombre,
                    u.nombre as veterinario_nombre,
                    u.apellido as veterinario_apellido
             FROM historiales_clinicos h
             JOIN mascotas m ON h.mascota_id = m.id
             JOIN veterinarios v ON h.veterinario_id = v.id
             JOIN usuarios u ON v.usuario_id = u.id
             WHERE h.id = ?`,
      [id],
    );

    return rows[0] || null;
  }

  // Actualizar una entrada
  static async update(
    id: number,
    data: Partial<IHistorialClinico>,
  ): Promise<boolean> {
    const fields = [];
    const values = [];

    if (data.fecha !== undefined) {
      fields.push("fecha = ?");
      values.push(data.fecha);
    }
    if (data.tipo !== undefined) {
      fields.push("tipo = ?");
      values.push(data.tipo);
    }
    if (data.diagnostico !== undefined) {
      fields.push("diagnostico = ?");
      values.push(data.diagnostico);
    }
    if (data.tratamiento !== undefined) {
      fields.push("tratamiento = ?");
      values.push(data.tratamiento);
    }
    if (data.observaciones !== undefined) {
      fields.push("observaciones = ?");
      values.push(data.observaciones);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE historiales_clinicos SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows > 0;
  }

  // Eliminar una entrada (solo admin)
  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM historiales_clinicos WHERE id = ?",
      [id],
    );

    return result.affectedRows > 0;
  }

  // Verificar si una entrada pertenece a un veterinario
  static async belongsToVeterinario(
    historialId: number,
    veterinarioId: number,
  ): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM historiales_clinicos WHERE id = ? AND veterinario_id = ?",
      [historialId, veterinarioId],
    );

    return rows.length > 0;
  }
}
