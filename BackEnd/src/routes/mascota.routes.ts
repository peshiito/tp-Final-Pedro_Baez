import { Router } from "express";
import { MascotaController } from "../controllers/mascota.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { canAccessMascota } from "../middlewares/mascota.middleware";

const router = Router();

// Todas las rutas de mascotas requieren autenticación
router.use(authenticate);

// Rutas para dueños
router.post("/", MascotaController.create);
router.get("/", MascotaController.getMyMascotas);

// Rutas con parámetro ID (requieren verificación de pertenencia)
router.get("/:id", canAccessMascota, MascotaController.getOne);
router.put("/:id", canAccessMascota, MascotaController.update);
router.delete("/:id", canAccessMascota, MascotaController.delete);

// Rutas solo para admin (para ver todas las mascotas)
router.get("/admin/all", authorize("ADMIN"), MascotaController.getAllForAdmin);

export default router;
