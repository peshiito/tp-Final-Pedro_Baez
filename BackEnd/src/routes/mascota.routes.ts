import { Router } from "express";
import { MascotaController } from "../controllers/mascota.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas accesibles por ADMIN y VETERINARIO
router.get("/", authorize("ADMIN", "VETERINARIO"), MascotaController.getAll);
router.get("/:id", authorize("ADMIN", "VETERINARIO"), MascotaController.getOne);
router.get(
  "/dueno/:duenoId",
  authorize("ADMIN", "VETERINARIO"),
  MascotaController.getByDueno,
);
router.post("/", authorize("ADMIN", "VETERINARIO"), MascotaController.create);
router.put("/:id", authorize("ADMIN", "VETERINARIO"), MascotaController.update);

// Solo ADMIN puede eliminar
router.delete("/:id", authorize("ADMIN"), MascotaController.delete);

export default router;
