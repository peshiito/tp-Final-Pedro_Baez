import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { DuenoModel } from "../models/dueno.model";

const router = Router();

router.use(authenticate);

// Solo admin puede ver dueños
router.get("/", authorize("ADMIN"), async (req, res) => {
  try {
    const duenos = await DuenoModel.findAll();
    res.json(duenos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener dueños" });
  }
});

// Buscar dueño por usuario_id
router.get("/usuario/:usuarioId", authorize("ADMIN"), async (req, res) => {
  try {
    const usuarioIdParam = req.params.usuarioId;
    
    // Validar que sea string y no array
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
    console.error("Error al obtener dueño:", error);
    res.status(500).json({ message: "Error al obtener dueño" });
  }
});

export default router;
