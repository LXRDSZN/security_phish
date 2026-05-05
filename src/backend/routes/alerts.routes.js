import { Router } from 'express';
import { getAlerts, runAlertRules, resolveAlert, runImmediateAnalysis } from '../controllers/alerts.controller.js';

const router = Router();

/**
 * 🚨 GET /api/alerts?from=&to=&priority=&status=
 * Listar alertas con filtros
 */
router.get('/', getAlerts);

/**
 * ⚙️ POST /api/alerts/run
 * Ejecutar reglas de detección de alertas
 */
router.post('/run', runAlertRules);

/**
 * 🔍 POST /api/alerts/analyze
 * Ejecutar análisis automático inmediato
 */
router.post('/analyze', runImmediateAnalysis);

/**
 * ✅ PUT /api/alerts/:id/resolve
 * Resolver una alerta
 */
router.put('/:id/resolve', resolveAlert);

export default router;
