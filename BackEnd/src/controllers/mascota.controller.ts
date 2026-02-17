import { Request, Response } from "express";
import { MascotaModel } from "../models/mascota.model";
import { DuenoModel } from "../models/dueno.model";
import { CreateMascotaDTO, UpdateMascotaDTO } from "../dtos/mascota.dto";
import { IRequestWithUser, IMascota } from "../interfaces";

export class MascotaController {
  // Crear una nueva mascota (solo dueño autenticado)
  static async create(req: IRequestWithUser, res: Response) {
    try {
      const data: CreateMascotaDTO = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "No autenticado" });
      }

      // Obtener el dueño asociado al usuario
      const dueno = await DuenoModel.findByUsuarioId(userId);
      if (!dueno) {
        return res.status(403).json({ message: "No eres un dueño registrado" });
      }

      // Validar campos requeridos
      if (!data.nombre || !data.especie || !data.sexo) {
        return res.status(400).json({
          message: "Nombre, especie y sexo son requeridos",
        });
      }

      // Validar que sexo sea MACHO o HEMBRA
      if (data.sexo !== "MACHO" && data.sexo !== "HEMBRA") {
        return res.status(400).json({
          message: "Sexo debe ser MACHO o HEMBRA",
        });
      }

      // Manejar raza correctamente
      const razaValue = data.raza !== undefined ? data.raza : null;

      // Preparar datos para el modelo
      const mascotaData: Partial<IMascota> = {
        nombre: data.nombre,
        especie: data.especie,
        raza: razaValue,
        sexo: data.sexo,
        fecha_nacimiento: data.fecha_nacimiento
          ? new Date(data.fecha_nacimiento)
          : undefined,
        peso: data.peso,
        dueno_id: dueno.id,
      };

      // Crear la mascota
      const mascotaId = await MascotaModel.create(mascotaData);

      // Obtener la mascota creada para devolverla
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

  // Obtener todas las mascotas del dueño autenticado
  static async getMyMascotas(req: IRequestWithUser, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const dueno = await DuenoModel.findByUsuarioId(userId);
      if (!dueno) {
        return res.status(403).json({ message: "No eres un dueño registrado" });
      }

      const mascotas = await MascotaModel.findByDuenoId(dueno.id);

      res.json({
        message: "Mascotas obtenidas exitosamente",
        mascotas,
      });
    } catch (error) {
      console.error("Error obteniendo mascotas:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Obtener una mascota específica del dueño
  static async getOne(req: IRequestWithUser, res: Response) {
    try {
      // Asegurar que params.id es string
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

      const dueno = await DuenoModel.findByUsuarioId(userId);
      if (!dueno) {
        return res.status(403).json({ message: "No eres un dueño registrado" });
      }

      const mascota = await MascotaModel.findByIdAndDueno(mascotaId, dueno.id);
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

  // Actualizar una mascota
  static async update(req: IRequestWithUser, res: Response) {
    try {
      // Asegurar que params.id es string
      const idParam = req.params.id;
      if (Array.isArray(idParam)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const mascotaId = parseInt(idParam);

      // Verificar que el ID es válido
      if (isNaN(mascotaId)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const data: UpdateMascotaDTO = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const dueno = await DuenoModel.findByUsuarioId(userId);
      if (!dueno) {
        return res.status(403).json({ message: "No eres un dueño registrado" });
      }

      // Verificar que la mascota existe y pertenece al dueño
      const mascota = await MascotaModel.findByIdAndDueno(mascotaId, dueno.id);
      if (!mascota) {
        return res.status(404).json({ message: "Mascota no encontrada" });
      }

      // Validar sexo si viene en la actualización
      if (data.sexo && data.sexo !== "MACHO" && data.sexo !== "HEMBRA") {
        return res.status(400).json({
          message: "Sexo debe ser MACHO o HEMBRA",
        });
      }

      // CORRECCIÓN: Convertir fecha_nacimiento de string a Date si existe
      const updateData: Partial<IMascota> = {
        nombre: data.nombre,
        especie: data.especie,
        raza: data.raza,
        sexo: data.sexo,
        peso: data.peso,
        fecha_nacimiento: data.fecha_nacimiento
          ? new Date(data.fecha_nacimiento)
          : undefined,
      };

      // Eliminar propiedades undefined para no enviarlas al modelo
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      const updated = await MascotaModel.update(
        mascotaId,
        dueno.id,
        updateData,
      );

      if (updated) {
        // Obtener la mascota actualizada
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

  // Eliminar una mascota
  static async delete(req: IRequestWithUser, res: Response) {
    try {
      // Asegurar que params.id es string
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

      const dueno = await DuenoModel.findByUsuarioId(userId);
      if (!dueno) {
        return res.status(403).json({ message: "No eres un dueño registrado" });
      }

      const deleted = await MascotaModel.delete(mascotaId, dueno.id);

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

  // Para admin: obtener todas las mascotas
  static async getAllForAdmin(req: IRequestWithUser, res: Response) {
    try {
      const mascotas = await MascotaModel.findAll();
      res.json({
        message: "Todas las mascotas",
        mascotas,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
