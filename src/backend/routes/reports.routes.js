import { Router } from 'express';
import {
  generateReport,
  getReports,
  getReportById,
  deleteReport,
  downloadReport
} from '../controllers/reports.controller.js';

const router = Router();

/**
 * 📄 POST /api/reports/generate
 * Generar un nuevo reporte
 */
router.post('/generate', generateReport);

/**
 * 📋 GET /api/reports
 * Obtener lista de reportes generados
 */
router.get('/', getReports);

/**
 * 📄 GET /api/reports/:id
 * Obtener un reporte específico
 */
router.get('/:id', getReportById);

/**
 * 🗑️ DELETE /api/reports/:id
 * Eliminar un reporte
 */
router.delete('/:id', deleteReport);

/**
 * 📥 GET /api/reports/:id/download
 * Descargar un reporte
 */
router.get('/:id/download', downloadReport);

export default router;
