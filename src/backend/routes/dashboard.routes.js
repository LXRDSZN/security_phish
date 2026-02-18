import { Router } from 'express';
import { getDashboardSummary, getRecentActivity } from '../controllers/dashboard.controller.js';

const router = Router();

/**
 * 📊 GET /api/dashboard/summary
 * KPIs principales para el Dashboard
 */
router.get('/summary', getDashboardSummary);

/**
 * 🕒 GET /api/dashboard/activity
 * Actividad reciente (últimas detecciones/eventos)
 */
router.get('/activity', getRecentActivity);

export default router;
