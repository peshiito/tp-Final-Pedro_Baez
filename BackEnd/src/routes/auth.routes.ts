import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Rutas públicas (SOLO LOGIN)
router.post("/login", AuthController.login);

// Rutas protegidas (solo ADMIN)
router.post(
  "/register/dueno", // 👈 MOVER AQUÍ, PROTEGIDO
  authenticate,
  authorize("ADMIN"),
  AuthController.registerDueno,
);

router.post(
  "/register/veterinario",
  authenticate,
  authorize("ADMIN"),
  AuthController.registerVeterinario,
);

export default router;
