import { Router } from 'express';
import {
  getStatisticsSummary,
  getVesselsStatistics,
  getZonesStatistics,
  getAlertsStatistics,
  getTimeSeriesData
} from '../controllers/statistics.controller.js';

const router = Router();

/**
 * 📊 GET /api/statistics/summary
 * Obtener resumen general de estadísticas
 */
router.get('/summary', getStatisticsSummary);

/**
 * 🚢 GET /api/statistics/vessels
 * Estadísticas de embarcaciones
 */
router.get('/vessels', getVesselsStatistics);

/**
 * 🗺️ GET /api/statistics/zones
 * Estadísticas de zonas protegidas
 */
router.get('/zones', getZonesStatistics);

/**
 * 🚨 GET /api/statistics/alerts
 * Estadísticas de alertas
 */
router.get('/alerts', getAlertsStatistics);

/**
 * 📈 GET /api/statistics/timeseries?period=day|week|month
 * Datos de serie temporal
 */
router.get('/timeseries', getTimeSeriesData);

export default router;
