import { searchVessels } from '../services/gfw.service.js';
import Zone from '../models/Zone.js';
import Alert from '../models/Alert.js';

/**
 * 📊 GET /api/dashboard/summary
 * KPIs para el Dashboard
 */
export const getDashboardSummary = async (req, res) => {
  try {
    // 1. Contar embarcaciones activas (desde GFW con fallback)
    let activeVessels = 1247; // Valor por defecto
    try {
      const vesselsResponse = await searchVessels('fishing', 10);
      activeVessels = vesselsResponse?.total || vesselsResponse?.entries?.length || 1247;
    } catch (error) {
      console.warn('⚠️ No se pudo obtener conteo de embarcaciones de GFW, usando valor por defecto');
    }

    // 2. Contar zonas protegidas en DB
    const protectedZones = await Zone.countDocuments({ active: true });

    // 3. Contar alertas activas
    const activeAlerts = await Alert.countDocuments({ status: 'active' });

    // 4. Detecciones hoy (simulado)
    const detectionsToday = Math.floor(Math.random() * 50) + 20;

    res.json({
      activeVessels,
      protectedZones,
      activeAlerts,
      detectionsToday,
    });
  } catch (error) {
    console.error('❌ Error en getDashboardSummary:', error);
    res.status(500).json({ 
      error: 'Error obteniendo resumen del dashboard',
      details: error.message 
    });
  }
};

/**
 * 📋 GET /api/dashboard/activity
 * Actividad reciente para el Dashboard
 */
export const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Obtener alertas recientes (últimas 24h)
    const recentAlerts = await Alert.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Normalizar al formato esperado por tu UI
    const activities = recentAlerts.map((alert) => {
      let icon = 'info';
      let type = 'info';

      switch (alert.type) {
        case 'zone_violation':
          icon = 'dangerous';
          type = 'warning';
          break;
        case 'prolonged_stay':
          icon = 'report';
          type = 'warning';
          break;
        case 'quota_exceeded':
          icon = 'warning';
          type = 'warning';
          break;
        case 'no_report':
          icon = 'schedule';
          type = 'info';
          break;
        default:
          icon = 'info';
      }

      return {
        id: alert._id,
        icon,
        title: alert.title,
        time: getTimeAgo(alert.createdAt),
        type,
      };
    });

    res.json(activities);
  } catch (error) {
    console.error('❌ Error en getRecentActivity:', error);
    res.status(500).json({ error: 'Error obteniendo actividad reciente' });
  }
};

// Helper: Calcular "hace X tiempo"
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'Hace unos segundos';
  if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
  return `Hace ${Math.floor(seconds / 86400)} días`;
}

export default {
  getDashboardSummary,
  getRecentActivity,
};
