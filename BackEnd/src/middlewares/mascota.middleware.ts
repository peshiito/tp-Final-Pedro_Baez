import { Response, NextFunction } from "express";
import { IRequestWithUser } from "../interfaces";
import { DuenoModel } from "../models/dueno.model";
import { MascotaModel } from "../models/mascota.model";

// Middleware para verificar que el usuario puede acceder a la mascota
export const canAccessMascota = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    // CORRECCIÓN: Asegurar que params.id es string
    const idParam = req.params.id;
    if (Array.isArray(idParam)) {
      return res.status(400).json({ message: "ID de mascota inválido" });
    }

    const mascotaId = parseInt(idParam);

    // Verificar que el ID es válido
    if (isNaN(mascotaId)) {
      return res.status(400).json({ message: "ID de mascota inválido" });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    // Admin puede acceder a todo
    if (req.user?.rol === "ADMIN") {
      return next();
    }

    // Veterinario puede acceder a todas las mascotas
    if (req.user?.rol === "VETERINARIO") {
      return next();
    }

    // Dueño: verificar que la mascota le pertenece
    if (req.user?.rol === "DUENO") {
      const dueno = await DuenoModel.findByUsuarioId(userId);
      if (!dueno) {
        return res.status(403).json({ message: "No eres un dueño registrado" });
      }

      const pertenece = await MascotaModel.belongsToDueno(mascotaId, dueno.id);
      if (!pertenece) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para acceder a esta mascota" });
      }

      return next();
    }

    return res
      .status(403)
      .json({ message: "No tienes permiso para esta acción" });
  } catch (error) {
    console.error("Error en middleware canAccessMascota:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
