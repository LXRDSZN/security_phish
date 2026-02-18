import { Router } from 'express';
import { getPositions } from '../controllers/positions.controller.js';

const router = Router();

/**
 * 📍 GET /api/positions/:vesselId?from=&to=
 * Obtener posiciones de embarcación en rango de fechas
 */
router.get('/:vesselId', getPositions);

export default router;
