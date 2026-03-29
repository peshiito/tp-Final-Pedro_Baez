import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { DuenoModel } from "../models/dueno.model";
import { IRequestWithUser } from "../interfaces";
import { pool } from "../config/database";
import { RowDataPacket } from "mysql2";

const router = Router();

router.use(authenticate);

// MODIFICADO: Admin y veterinario pueden ver todos los dueños
router.get(
  "/",
  authorize("ADMIN", "VETERINARIO"),
  async (req: IRequestWithUser, res) => {
    try {
      const duenos = await DuenoModel.findAll();
      res.json(duenos);
    } catch (error) {
      console.error("Error obteniendo dueños:", error);
      res.status(500).json({ message: "Error al obtener dueños" });
    }
  },
);

// Buscar dueño por email (admin y veterinario)
router.get(
  "/buscar-por-email/:email",
  authorize("ADMIN", "VETERINARIO"),
  async (req: IRequestWithUser, res) => {
    try {
      const email = req.params.email;

      // Buscar usuario por email con rol DUENO
      const [usuarios] = await pool.execute<RowDataPacket[]>(
        `SELECT u.id as usuario_id, u.nombre, u.apellido, u.email, u.direccion,
              d.id as dueno_id, d.telefono, d.dni
       FROM usuarios u
       JOIN duenos d ON u.id = d.usuario_id
       WHERE u.email = ? AND u.rol_id = 3 AND u.activo = true`,
        [email],
      );

      if (usuarios.length === 0) {
        return res.status(404).json({ message: "Dueño no encontrado" });
      }

      // Devolver el primer resultado
      const usuario = usuarios[0];
      res.json({
        id: usuario.dueno_id,
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        direccion: usuario.direccion,
        telefono: usuario.telefono,
        dni: usuario.dni,
      });
    } catch (error) {
      console.error("Error buscando dueño por email:", error);
      res.status(500).json({ message: "Error al buscar dueño" });
    }
  },
);

// Buscar dueño por usuario_id
router.get(
  "/usuario/:usuarioId",
  authorize("ADMIN", "VETERINARIO"),
  async (req: IRequestWithUser, res) => {
    try {
      const usuarioIdParam = req.params.usuarioId;
      if (Array.isArray(usuarioIdParam)) {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }

      const usuarioId = parseInt(usuarioIdParam);
      if (isNaN(usuarioId)) {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }

      const dueno = await DuenoModel.findByUsuarioId(usuarioId);

      if (!dueno) {
        return res.status(404).json({ message: "Dueño no encontrado" });
      }

      res.json(dueno);
    } catch (error) {
      console.error("Error obteniendo dueño:", error);
      res.status(500).json({ message: "Error al obtener dueño" });
    }
  },
);

export default router;
