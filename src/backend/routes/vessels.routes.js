import { Router } from 'express';
import { search, getById } from '../controllers/vessels.controller.js';

const router = Router();

/**
 * 🔍 GET /api/vessels/search?query=&offset=&limit=
 * Buscar embarcaciones en GFW
 */
router.get('/search', search);

/**
 * 🚢 GET /api/vessels/:id
 * Obtener detalles de embarcación específica
 */
router.get('/:id', getById);

export default router;
