import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { UsuarioModel } from "../models/usuario.model";
import { IRequestWithUser } from "../interfaces";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener usuarios según el rol
router.get("/", async (req: IRequestWithUser, res) => {
  try {
    const userRole = req.user?.rol;
    const { rol_id } = req.query;

    let usuarios;

    // Admin puede ver todos los usuarios
    if (userRole === "ADMIN") {
      usuarios = await UsuarioModel.findAll();
    }
    // Veterinario solo puede ver usuarios con rol DUENO (rol_id = 3)
    else if (userRole === "VETERINARIO") {
      // Si se especifica un rol_id, verificar que sea solo dueños
      if (rol_id && parseInt(rol_id as string) !== 3) {
        return res
          .status(403)
          .json({ message: "No tiene permiso para ver otros roles" });
      }
      // Veterinario solo ve dueños
      usuarios = await UsuarioModel.findByRol(3);
    } else {
      return res.status(403).json({ message: "No autorizado" });
    }

    res.json(usuarios);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// Obtener un usuario por ID (solo admin)
router.get("/:id", async (req: IRequestWithUser, res) => {
  try {
    // Verificar que sea admin
    if (req.user?.rol !== "ADMIN") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const idParam = req.params.id;
    if (Array.isArray(idParam)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const id = parseInt(idParam);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
});

export default router;
