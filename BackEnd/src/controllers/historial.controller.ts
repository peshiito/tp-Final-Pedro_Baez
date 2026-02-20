import { Request, Response } from "express";
import { HistorialModel } from "../models/historial.model";
import { MascotaModel } from "../models/mascota.model";
import { VeterinarioModel } from "../models/veterinario.model";
import { CreateHistorialDTO, UpdateHistorialDTO } from "../dtos/historial.dto";
import { IRequestWithUser } from "../interfaces";

export class HistorialController {
  // Crear entrada en historial (solo veterinarios)
  static async create(req: IRequestWithUser, res: Response) {
    try {
      const data: CreateHistorialDTO = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.rol;

      // Solo veterinarios pueden crear historial
      if (userRole !== "VETERINARIO" && userRole !== "ADMIN") {
        return res
          .status(403)
          .json({
            message: "Solo veterinarios pueden crear historial clínico",
          });
      }

      // Validar campos requeridos
      if (!data.mascota_id || !data.fecha || !data.tipo || !data.diagnostico) {
        return res.status(400).json({
          message: "mascota_id, fecha, tipo y diagnostico son requeridos",
        });
      }

      // Validar que la mascota existe
      const mascota = await MascotaModel.findById(data.mascota_id);
      if (!mascota) {
        return res.status(404).json({ message: "Mascota no encontrada" });
      }

      // Obtener el veterinario_id del usuario logueado
      const veterinario = await VeterinarioModel.findByUsuarioId(userId!);
      if (!veterinario) {
        return res
          .status(403)
          .json({ message: "No eres un veterinario registrado" });
      }

      // Validar tipo
      const tiposValidos = ["CONSULTA", "VACUNA", "CIRUGIA", "CONTROL"];
      if (!tiposValidos.includes(data.tipo)) {
        return res.status(400).json({
          message: "Tipo debe ser CONSULTA, VACUNA, CIRUGIA o CONTROL",
        });
      }

      // Crear historial
      const historialId = await HistorialModel.create({
        mascota_id: data.mascota_id,
        veterinario_id: veterinario.id,
        fecha: new Date(data.fecha),
        tipo: data.tipo,
        diagnostico: data.diagnostico,
        tratamiento: data.tratamiento,
        observaciones: data.observaciones,
      });

      const nuevoHistorial = await HistorialModel.findById(historialId);

      res.status(201).json({
        message: "Entrada de historial creada exitosamente",
        historial: nuevoHistorial,
      });
    } catch (error) {
      console.error("Error creando historial:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Obtener historial de una mascota
  static async getByMascota(req: IRequestWithUser, res: Response) {
    try {
      const mascotaIdParam = req.params.mascotaId;
      if (Array.isArray(mascotaIdParam)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const mascotaId = parseInt(mascotaIdParam);
      if (isNaN(mascotaId)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const userRole = req.user?.rol;
      if (userRole !== "ADMIN" && userRole !== "VETERINARIO") {
        return res
          .status(403)
          .json({ message: "No tienes permiso para ver historiales" });
      }

      const historial = await HistorialModel.findByMascotaId(mascotaId);

      res.json({
        message: "Historial obtenido exitosamente",
        total: historial.length,
        historial,
      });
    } catch (error) {
      console.error("Error obteniendo historial:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Obtener una entrada específica
  static async getOne(req: IRequestWithUser, res: Response) {
    try {
      const idParam = req.params.id;
      if (Array.isArray(idParam)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const historialId = parseInt(idParam);
      if (isNaN(historialId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const userRole = req.user?.rol;
      if (userRole !== "ADMIN" && userRole !== "VETERINARIO") {
        return res.status(403).json({ message: "No tienes permiso" });
      }

      const historial = await HistorialModel.findById(historialId);
      if (!historial) {
        return res
          .status(404)
          .json({ message: "Entrada de historial no encontrada" });
      }

      res.json({
        message: "Entrada obtenida exitosamente",
        historial,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Actualizar entrada (vet que creó o admin)
  static async update(req: IRequestWithUser, res: Response) {
    try {
      const idParam = req.params.id;
      if (Array.isArray(idParam)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const historialId = parseInt(idParam);
      if (isNaN(historialId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const data: UpdateHistorialDTO = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.rol;

      // Verificar que la entrada existe
      const historial = await HistorialModel.findById(historialId);
      if (!historial) {
        return res.status(404).json({ message: "Entrada no encontrada" });
      }

      // Verificar permisos: admin puede todo, vet solo sus propias entradas
      if (userRole !== "ADMIN") {
        const veterinario = await VeterinarioModel.findByUsuarioId(userId!);
        if (!veterinario || historial.veterinario_id !== veterinario.id) {
          return res.status(403).json({
            message: "Solo puedes modificar tus propias entradas",
          });
        }
      }

      // Validar tipo si viene
      if (data.tipo) {
        const tiposValidos = ["CONSULTA", "VACUNA", "CIRUGIA", "CONTROL"];
        if (!tiposValidos.includes(data.tipo)) {
          return res.status(400).json({
            message: "Tipo debe ser CONSULTA, VACUNA, CIRUGIA o CONTROL",
          });
        }
      }

      // Preparar datos para actualizar
      const updateData: any = { ...data };
      if (data.fecha) {
        updateData.fecha = new Date(data.fecha);
      }

      const updated = await HistorialModel.update(historialId, updateData);

      if (updated) {
        const historialActualizado = await HistorialModel.findById(historialId);
        res.json({
          message: "Entrada actualizada exitosamente",
          historial: historialActualizado,
        });
      } else {
        res.status(400).json({ message: "No se pudo actualizar" });
      }
    } catch (error) {
      console.error("Error actualizando historial:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Eliminar entrada (solo admin)
  static async delete(req: IRequestWithUser, res: Response) {
    try {
      const idParam = req.params.id;
      if (Array.isArray(idParam)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const historialId = parseInt(idParam);
      if (isNaN(historialId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const userRole = req.user?.rol;
      if (userRole !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Solo admin puede eliminar entradas" });
      }

      const deleted = await HistorialModel.delete(historialId);

      if (deleted) {
        res.json({ message: "Entrada eliminada exitosamente" });
      } else {
        res.status(404).json({ message: "Entrada no encontrada" });
      }
    } catch (error) {
      console.error("Error eliminando historial:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
