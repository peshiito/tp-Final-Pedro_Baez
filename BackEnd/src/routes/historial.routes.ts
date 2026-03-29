import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { HistorialModel } from "../models/historial.model";
import { VeterinarioModel } from "../models/veterinario.model";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener historial de una mascota
router.get(
  "/mascota/:mascotaId",
  authorize("ADMIN", "VETERINARIO"),
  async (req, res) => {
    try {
      const mascotaIdParam = req.params.mascotaId;
      if (Array.isArray(mascotaIdParam)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const mascotaId = parseInt(mascotaIdParam);
      if (isNaN(mascotaId)) {
        return res.status(400).json({ message: "ID de mascota inválido" });
      }

      const historial = await HistorialModel.findByMascotaId(mascotaId);
      res.json({
        message: "Historial obtenido exitosamente",
        total: historial.length,
        historial,
      });
    } catch (error) {
      console.error("Error obteniendo historial:", error);
      res.status(500).json({ message: "Error al obtener historial" });
    }
  },
);

// Obtener historial por veterinario
router.get(
  "/veterinario/:veterinarioId",
  authorize("VETERINARIO", "ADMIN"),
  async (req, res) => {
    try {
      const vetIdParam = req.params.veterinarioId;
      if (Array.isArray(vetIdParam)) {
        return res.status(400).json({ message: "ID de veterinario inválido" });
      }

      const veterinarioId = parseInt(vetIdParam);
      if (isNaN(veterinarioId)) {
        return res.status(400).json({ message: "ID de veterinario inválido" });
      }

      // Verificar que el veterinario existe
      const veterinario = await VeterinarioModel.findById(veterinarioId);
      if (!veterinario) {
        return res.status(404).json({ message: "Veterinario no encontrado" });
      }

      const historial = await HistorialModel.findByVeterinarioId(veterinarioId);
      res.json({
        message: "Historial del veterinario obtenido",
        total: historial.length,
        historial,
      });
    } catch (error) {
      console.error("Error obteniendo historial del veterinario:", error);
      res.status(500).json({ message: "Error al obtener historial" });
    }
  },
);

// Crear entrada en historial
router.post("/", authorize("VETERINARIO", "ADMIN"), async (req, res) => {
  try {
    const {
      mascota_id,
      veterinario_id,
      fecha,
      tipo,
      diagnostico,
      tratamiento,
      observaciones,
    } = req.body;

    if (!mascota_id || !veterinario_id || !fecha || !tipo || !diagnostico) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    // Validar tipo
    const tiposValidos = ["CONSULTA", "VACUNA", "CIRUGIA", "CONTROL"];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ message: "Tipo de consulta inválido" });
    }

    const id = await HistorialModel.create({
      mascota_id,
      veterinario_id,
      fecha: new Date(fecha),
      tipo,
      diagnostico,
      tratamiento,
      observaciones,
    });

    const nuevoHistorial = await HistorialModel.findById(id);
    res.status(201).json({
      message: "Historial creado exitosamente",
      historial: nuevoHistorial,
    });
  } catch (error) {
    console.error("Error creando historial:", error);
    res.status(500).json({ message: "Error al crear historial" });
  }
});

// Obtener una entrada específica
router.get("/:id", authorize("ADMIN", "VETERINARIO"), async (req, res) => {
  try {
    const idParam = req.params.id;
    if (Array.isArray(idParam)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const id = parseInt(idParam);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const historial = await HistorialModel.findById(id);
    if (!historial) {
      return res.status(404).json({ message: "Entrada no encontrada" });
    }

    res.json({ historial });
  } catch (error) {
    console.error("Error obteniendo entrada:", error);
    res.status(500).json({ message: "Error interno" });
  }
});

// Actualizar entrada
router.put("/:id", authorize("VETERINARIO", "ADMIN"), async (req, res) => {
  try {
    const idParam = req.params.id;
    if (Array.isArray(idParam)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const id = parseInt(idParam);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const { fecha, tipo, diagnostico, tratamiento, observaciones } = req.body;

    const updated = await HistorialModel.update(id, {
      fecha: fecha ? new Date(fecha) : undefined,
      tipo,
      diagnostico,
      tratamiento,
      observaciones,
    });

    if (updated) {
      const historial = await HistorialModel.findById(id);
      res.json({
        message: "Entrada actualizada",
        historial,
      });
    } else {
      res.status(404).json({ message: "Entrada no encontrada" });
    }
  } catch (error) {
    console.error("Error actualizando:", error);
    res.status(500).json({ message: "Error interno" });
  }
});

// Eliminar entrada (solo admin)
router.delete("/:id", authorize("ADMIN"), async (req, res) => {
  try {
    const idParam = req.params.id;
    if (Array.isArray(idParam)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const id = parseInt(idParam);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const deleted = await HistorialModel.delete(id);
    if (deleted) {
      res.json({ message: "Entrada eliminada" });
    } else {
      res.status(404).json({ message: "Entrada no encontrada" });
    }
  } catch (error) {
    console.error("Error eliminando:", error);
    res.status(500).json({ message: "Error interno" });
  }
});

export default router;
