import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/zones.controller.js';

const router = Router();

/**
 * 🗺️ GET /api/zones?active=
 * Listar todas las zonas protegidas
 */
router.get('/', getAll);

/**
 * 📌 GET /api/zones/:id
 * Obtener zona específica
 */
router.get('/:id', getById);

/**
 * ➕ POST /api/zones
 * Crear nueva zona protegida
 */
router.post('/', create);

/**
 * ✏️ PUT /api/zones/:id
 * Actualizar zona existente
 */
router.put('/:id', update);

/**
 * 🗑️ DELETE /api/zones/:id
 * Eliminar zona
 */
router.delete('/:id', remove);

export default router;
