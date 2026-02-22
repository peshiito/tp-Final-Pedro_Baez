import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { VeterinarioModel } from '../models/veterinario.model';

const router = Router();

router.use(authenticate);

// Obtener todos los veterinarios (admin y veterinarios pueden ver)
router.get('/', authorize('ADMIN', 'VETERINARIO'), async (req, res) => {
  try {
    const veterinarios = await VeterinarioModel.findAll();
    res.json(veterinarios);
  } catch (error) {
    console.error('Error obteniendo veterinarios:', error);
    res.status(500).json({ message: 'Error al obtener veterinarios' });
  }
});

// Obtener un veterinario por ID
router.get('/:id', authorize('ADMIN', 'VETERINARIO'), async (req, res) => {
  try {
    const idParam = req.params.id;
    if (Array.isArray(idParam)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    
    const veterinario = await VeterinarioModel.findById(id);
    if (!veterinario) {
      return res.status(404).json({ message: 'Veterinario no encontrado' });
    }
    res.json(veterinario);
  } catch (error) {
    console.error('Error obteniendo veterinario:', error);
    res.status(500).json({ message: 'Error al obtener veterinario' });
  }
});

export default router;
