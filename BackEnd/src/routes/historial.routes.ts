import { Router } from "express";
import { HistorialController } from "../controllers/historial.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas accesibles por ADMIN y VETERINARIO
router.get(
  "/mascota/:mascotaId",
  authorize("ADMIN", "VETERINARIO"),
  HistorialController.getByMascota,
);
router.get(
  "/:id",
  authorize("ADMIN", "VETERINARIO"),
  HistorialController.getOne,
);

// Crear entrada (solo veterinarios)
router.post("/", authorize("VETERINARIO", "ADMIN"), HistorialController.create);

// Actualizar entrada (vet que creó o admin)
router.put(
  "/:id",
  authorize("ADMIN", "VETERINARIO"),
  HistorialController.update,
);

// Eliminar entrada (solo admin)
router.delete("/:id", authorize("ADMIN"), HistorialController.delete);

export default router;
