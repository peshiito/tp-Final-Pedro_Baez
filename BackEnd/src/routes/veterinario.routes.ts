import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { VeterinarioModel } from "../models/veterinario.model";
import { IRequestWithUser } from "../interfaces";
import { pool } from "../config/database";
import { RowDataPacket } from "mysql2";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener todos los veterinarios (admin y veterinarios pueden ver)
router.get(
  "/",
  authorize("ADMIN", "VETERINARIO"),
  async (req: IRequestWithUser, res) => {
    try {
      const veterinarios = await VeterinarioModel.findAll();
      res.json(veterinarios);
    } catch (error) {
      console.error("Error obteniendo veterinarios:", error);
      res.status(500).json({ message: "Error al obtener veterinarios" });
    }
  },
);

// Obtener veterinario por email
router.get(
  "/email/:email",
  authorize("ADMIN", "VETERINARIO"),
  async (req: IRequestWithUser, res) => {
    try {
      const email = req.params.email;

      const [usuarios] = await pool.execute<RowDataPacket[]>(
        "SELECT id FROM usuarios WHERE email = ?",
        [email],
      );

      if (usuarios.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const usuarioId = usuarios[0].id;
      const veterinario = await VeterinarioModel.findByUsuarioId(usuarioId);

      if (!veterinario) {
        return res.status(404).json({ message: "Veterinario no encontrado" });
      }

      res.json(veterinario);
    } catch (error) {
      console.error("Error obteniendo veterinario por email:", error);
      res.status(500).json({ message: "Error al obtener veterinario" });
    }
  },
);

// Obtener veterinario por ID
router.get(
  "/:id",
  authorize("ADMIN", "VETERINARIO"),
  async (req: IRequestWithUser, res) => {
    try {
      const idParam = req.params.id;
      if (Array.isArray(idParam)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const id = parseInt(idParam);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const veterinario = await VeterinarioModel.findById(id);
      if (!veterinario) {
        return res.status(404).json({ message: "Veterinario no encontrado" });
      }
      res.json(veterinario);
    } catch (error) {
      console.error("Error obteniendo veterinario:", error);
      res.status(500).json({ message: "Error al obtener veterinario" });
    }
  },
);

// Obtener veterinario por usuario ID
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

      const veterinario = await VeterinarioModel.findByUsuarioId(usuarioId);
      if (!veterinario) {
        return res
          .status(404)
          .json({ message: "Veterinario no encontrado para este usuario" });
      }
      res.json(veterinario);
    } catch (error) {
      console.error("Error obteniendo veterinario por usuario:", error);
      res.status(500).json({ message: "Error al obtener veterinario" });
    }
  },
);

export default router;
