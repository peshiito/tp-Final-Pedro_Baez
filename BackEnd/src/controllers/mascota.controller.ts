import { Request, Response } from "express";
import { MascotaModel } from "../models/mascota.model";
import { DuenoModel } from "../models/dueno.model";
import { CreateMascotaDTO, UpdateMascotaDTO } from "../dtos/mascota.dto";
import { IRequestWithUser } from "../interfaces";

export class MascotaController {
  // Crear mascota (Admin y Veterinario)
  static async create(req: IRequestWithUser, res: Response) {
    try {
      const data: CreateMascotaDTO = req.body;
      const userRole = req.user?.rol;

      // Solo admin y veterinario pueden crear mascotas
      if (userRole !== "ADMIN" && userRole !== "VETERINARIO") {
        return res
          .status(403)
          .json({ message: "No tienes permiso para crear mascotas" });
      }

      // Validar que el dueño existe
      const dueno = await DuenoModel.findById(data.dueno_id);
      if (!dueno) {
        return res
          .status(404)
          .json({ message: "El dueño especificado no existe" });
      }

      // Validar campos requeridos
      if (!data.nombre || !data.especie || !data.sexo || !data.dueno_id) {
        return res.status(400).json({
          message: "Nombre, especie, sexo y dueño_id son requeridos",
        });
      }

      // Validar sexo
      if (data.sexo !== "MACHO" && data.sexo !== "HEMBRA") {
        return res
          .status(400)
          .json({ message: "Sexo debe ser MACHO o HEMBRA" });
      }

      // Crear la mascota
      const mascotaId = await MascotaModel.create({
        nombre: data.nombre,
        especie: data.especie,
        raza: data.raza || null,
        sexo: data.sexo,
        fecha_nacimiento: data.fecha_nacimiento
          ? new Date(data.fecha_nacimiento)
          : undefined,
        peso: data.peso,
        dueno_id: data.dueno_id,
      });

      // Obtener la mascota creada
      const nuevaMascota = await MascotaModel.findById(mascotaId);

      res.status(201).json({
        message: "Mascota registrada exitosamente",
        mascota: nuevaMascota,
      });
    } catch (error) {
      console.error("Error creando mascota:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Obtener TODAS las mascotas (Admin y Veterinario)
  static async getAll(req: IRequestWithUser, res: Response) {
    try {
      const userRole = req.user?.rol;

      if (userRole !== "ADMIN" && userRole !== "VETERINARIO") {
        return res
          .status(403)
          .json({ message: "No tienes permiso para ver mascotas" });
      }

      const mascotas = await MascotaModel.findAll();

      res.json({
        message: "Mascotas obtenidas exitosamente",
        total: mascotas.length,
        mascotas,
      });
    } catch (error) {
      console.error("Error obteniendo mascotas:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Obtener una mascota por ID
  static async getOne(req: IRequestWithUser, res: Response) {
    try {
      const idParam = req.params.id;
      if (Array.isArray(idParam)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const mascotaId = parseInt(idParam);
      if (isNaN(mascotaId)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const userRole = req.user?.rol;
      if (userRole !== "ADMIN" && userRole !== "VETERINARIO") {
        return res
          .status(403)
          .json({ message: "No tienes permiso para ver mascotas" });
      }

      const mascota = await MascotaModel.findById(mascotaId);
      if (!mascota) {
        return res.status(404).json({ message: "Mascota no encontrada" });
      }

      res.json({
        message: "Mascota obtenida exitosamente",
        mascota,
      });
    } catch (error) {
      console.error("Error obteniendo mascota:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Actualizar mascota
  static async update(req: IRequestWithUser, res: Response) {
    try {
      const idParam = req.params.id;
      if (Array.isArray(idParam)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const mascotaId = parseInt(idParam);
      if (isNaN(mascotaId)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const userRole = req.user?.rol;
      if (userRole !== "ADMIN" && userRole !== "VETERINARIO") {
        return res
          .status(403)
          .json({ message: "No tienes permiso para actualizar mascotas" });
      }

      const data: UpdateMascotaDTO = req.body;

      // Verificar que la mascota existe
      const mascota = await MascotaModel.findById(mascotaId);
      if (!mascota) {
        return res.status(404).json({ message: "Mascota no encontrada" });
      }

      // Si se quiere cambiar de dueño, verificar que el nuevo dueño existe
      if (data.dueno_id) {
        const dueno = await DuenoModel.findById(data.dueno_id);
        if (!dueno) {
          return res
            .status(404)
            .json({ message: "El dueño especificado no existe" });
        }
      }

      // Validar sexo si viene
      if (data.sexo && data.sexo !== "MACHO" && data.sexo !== "HEMBRA") {
        return res
          .status(400)
          .json({ message: "Sexo debe ser MACHO o HEMBRA" });
      }

      // Preparar datos para actualizar
      const updateData: any = { ...data };
      if (data.fecha_nacimiento) {
        updateData.fecha_nacimiento = new Date(data.fecha_nacimiento);
      }

      const updated = await MascotaModel.updateAdmin(mascotaId, updateData);

      if (updated) {
        const mascotaActualizada = await MascotaModel.findById(mascotaId);
        res.json({
          message: "Mascota actualizada exitosamente",
          mascota: mascotaActualizada,
        });
      } else {
        res.status(400).json({ message: "No se pudo actualizar la mascota" });
      }
    } catch (error) {
      console.error("Error actualizando mascota:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Eliminar mascota (solo admin)
  static async delete(req: IRequestWithUser, res: Response) {
    try {
      const idParam = req.params.id;
      if (Array.isArray(idParam)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const mascotaId = parseInt(idParam);
      if (isNaN(mascotaId)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const userRole = req.user?.rol;
      if (userRole !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Solo admin puede eliminar mascotas" });
      }

      const deleted = await MascotaModel.deleteAdmin(mascotaId);

      if (deleted) {
        res.json({ message: "Mascota eliminada exitosamente" });
      } else {
        res.status(404).json({ message: "Mascota no encontrada" });
      }
    } catch (error) {
      console.error("Error eliminando mascota:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Buscar mascotas por dueño
  // Buscar mascotas por dueño
  static async getByDueno(req: IRequestWithUser, res: Response) {
    try {
      // CORRECCIÓN: Asegurar que params.duenoId es string
      const duenoIdParam = req.params.duenoId;
      if (Array.isArray(duenoIdParam)) {
        return res.status(400).json({ message: "ID de dueño inválido" });
      }

      const duenoId = parseInt(duenoIdParam);
      if (isNaN(duenoId)) {
        return res.status(400).json({ message: "ID de dueño inválido" });
      }

      const userRole = req.user?.rol;
      if (userRole !== "ADMIN" && userRole !== "VETERINARIO") {
        return res.status(403).json({ message: "No tienes permiso" });
      }

      const mascotas = await MascotaModel.findByDuenoId(duenoId);

      res.json({
        message: "Mascotas del dueño obtenidas",
        total: mascotas.length,
        mascotas,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
