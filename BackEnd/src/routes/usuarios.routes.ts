import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UsuarioModel } from "../models/usuario.model";

const router = Router();

router.use(authenticate);

// Solo admin puede ver usuarios
router.get("/", authorize("ADMIN"), async (req, res) => {
  try {
    const usuarios = await UsuarioModel.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

export default router;
