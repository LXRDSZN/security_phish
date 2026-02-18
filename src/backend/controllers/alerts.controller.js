import Alert from '../models/Alert.js';
import Zone from '../models/Zone.js';
import { getVesselTracks } from '../services/gfw.service.js';
import { getZonesContainingPoint, detectProlongedStay } from '../services/geofencing.service.js';

/**
 * 🚨 GET /api/alerts?from=&to=&priority=&status=
 * Obtener alertas filtradas
 */
export const getAlerts = async (req, res) => {
  try {
    const { from, to, priority, status = 'active' } = req.query;

    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    // Normalizar al formato esperado por tu UI
    const alertsNormalized = alerts.map((alert) => {
      let icon = 'info';
      switch (alert.type) {
        case 'zone_violation':
          icon = 'dangerous';
          break;
        case 'prolonged_stay':
          icon = 'report';
          break;
        case 'quota_exceeded':
          icon = 'warning';
          break;
        case 'speed_violation':
          icon = 'speed';
          break;
        case 'no_report':
          icon = 'info';
          break;
        default:
          icon = 'settings';
      }

      return {
        id: alert._id,
        priority: alert.priority,
        icon,
        title: alert.title,
        description: alert.description,
        time: getTimeAgo(alert.createdAt),
        location: alert.location,
        boat: alert.vesselName || alert.vesselId || 'Desconocida',
        reporter: 'Sistema Automático',
        status: alert.status,
      };
    });

    res.json(alertsNormalized);
  } catch (error) {
    console.error('Error en alerts/getAlerts:', error);
    res.status(500).json({ error: 'Error obteniendo alertas' });
  }
};

/**
 * ⚙️ POST /api/alerts/run
 * Ejecutar reglas de alertas (detectar violaciones)
 * Este endpoint se puede llamar periódicamente (cron job)
 */
export const runAlertRules = async (req, res) => {
  try {
    const { vesselIds } = req.body;

    if (!vesselIds || vesselIds.length === 0) {
      return res.status(400).json({ error: 'vesselIds es requerido' });
    }

    // Obtener zonas activas
    const zones = await Zone.find({ active: true });

    const alertsCreated = [];
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Por cada embarcación, verificar tracks y reglas
    for (const vesselId of vesselIds) {
      try {
        // Obtener tracks de las últimas 24h
        const tracksResponse = await getVesselTracks(vesselId, yesterday, today);
        const tracks = tracksResponse.entries || [];

        if (tracks.length === 0) continue;

        // REGLA 1: Detectar entrada a zonas prohibidas
        for (const track of tracks) {
          const point = { lat: track.lat, lon: track.lon };
          const zonesFound = getZonesContainingPoint(point, zones);

          for (const zone of zonesFound) {
            if (zone.level === 'high') {
              // Verificar si ya existe alerta para esta embarcación y zona hoy
              const existingAlert = await Alert.findOne({
                vesselId,
                zoneId: zone._id,
                type: 'zone_violation',
                createdAt: { $gte: new Date(yesterday) },
              });

              if (!existingAlert) {
                const alert = new Alert({
                  priority: 'high',
                  type: 'zone_violation',
                  title: 'Embarcación en Zona Prohibida',
                  description: `La embarcación ${vesselId} ha ingresado a la zona protegida ${zone.name} sin autorización.`,
                  vesselId,
                  vesselName: vesselId,
                  location: zone.name,
                  coordinates: { lat: track.lat, lon: track.lon },
                  zoneId: zone._id,
                  zoneName: zone.name,
                  status: 'active',
                  metadata: { timestamp: track.timestamp },
                });

                await alert.save();
                alertsCreated.push(alert);

                // Incrementar contador de embarcaciones en la zona
                zone.boats += 1;
                await zone.save();
              }
            }
          }
        }

        // REGLA 2: Detectar permanencia prolongada (velocidad baja + mucho tiempo)
        for (const zone of zones) {
          if (zone.level === 'medium' || zone.level === 'high') {
            const isProlonged = detectProlongedStay(tracks, zone, 30); // 30 min

            if (isProlonged) {
              const existingAlert = await Alert.findOne({
                vesselId,
                zoneId: zone._id,
                type: 'prolonged_stay',
                createdAt: { $gte: new Date(yesterday) },
              });

              if (!existingAlert) {
                const alert = new Alert({
                  priority: 'medium',
                  type: 'prolonged_stay',
                  title: 'Permanencia Sospechosa Detectada',
                  description: `La embarcación ${vesselId} ha permanecido por tiempo prolongado en ${zone.name}.`,
                  vesselId,
                  vesselName: vesselId,
                  location: zone.name,
                  zoneId: zone._id,
                  zoneName: zone.name,
                  status: 'active',
                });

                await alert.save();
                alertsCreated.push(alert);
              }
            }
          }
        }
      } catch (error) {
        console.warn(`Error procesando ${vesselId}:`, error.message);
        continue; // Continuar con siguiente embarcación
      }
    }

    res.json({
      message: 'Reglas de alertas ejecutadas',
      vesselsProcessed: vesselIds.length,
      alertsCreated: alertsCreated.length,
      alerts: alertsCreated,
    });
  } catch (error) {
    console.error('Error en alerts/run:', error);
    res.status(500).json({ error: 'Error ejecutando reglas de alertas' });
  }
};

/**
 * ✅ PUT /api/alerts/:id/resolve
 * Resolver una alerta
 */
export const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolvedBy } = req.body;

    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ error: 'Alerta no encontrada' });
    }

    alert.status = 'resolved';
    alert.resolvedAt = new Date();
    alert.resolvedBy = resolvedBy || 'Usuario';

    await alert.save();

    res.json({
      message: 'Alerta resuelta',
      alert: {
        id: alert._id,
        status: alert.status,
        resolvedAt: alert.resolvedAt,
      },
    });
  } catch (error) {
    console.error('Error en alerts/resolve:', error);
    res.status(500).json({ error: 'Error resolviendo alerta' });
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
  getAlerts,
  runAlertRules,
  resolveAlert,
};
