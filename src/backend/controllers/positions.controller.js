import { getVesselTracks } from '../services/gfw.service.js';

/**
 * 📍 GET /api/positions?vesselId=&from=&to=
 * Obtener posiciones/tracks de una embarcación
 */
export const getPositions = async (req, res) => {
  try {
    const { vesselId, from, to } = req.query;

    // Validaciones
    if (!vesselId) {
      return res.status(400).json({ error: 'vesselId es requerido' });
    }

    // Fechas por defecto: últimos 7 días
    const endDate = to || new Date().toISOString().split('T')[0];
    const startDate =
      from ||
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log(`Consultando tracks: ${vesselId} desde ${startDate} hasta ${endDate}`);

    const response = await getVesselTracks(vesselId, startDate, endDate);

    // Normalizar posiciones al formato esperado por tu UI
    const positions = (response.entries || []).map((entry) => ({
      mmsi: entry.vesselId || vesselId,
      lat: entry.lat,
      lon: entry.lon,
      timestamp: entry.timestamp,
      speed: entry.speed || 0,
      course: entry.course || 0,
    }));

    res.json({
      vesselId,
      startDate,
      endDate,
      total: positions.length,
      positions,
    });
  } catch (error) {
    console.error('Error en positions:', error);
    
    // Si no hay permisos, devolver vacío en lugar de error
    if (error.message.includes('permisos')) {
      return res.json({
        vesselId: req.query.vesselId,
        startDate: req.query.from,
        endDate: req.query.to,
        total: 0,
        positions: [],
        warning: 'Sin permisos para obtener tracks. Contacta con GFW para activar este dataset.',
      });
    }

    res.status(500).json({ error: 'Error obteniendo posiciones' });
  }
};

export default {
  getPositions,
};
