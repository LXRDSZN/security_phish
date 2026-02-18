import { searchVessels, getVesselById } from '../services/gfw.service.js';

/**
 * 🔍 GET /api/vessels/search?q=
 * Buscar embarcaciones por nombre o MMSI
 */
export const search = async (req, res) => {
  try {
    const { query = '', limit = 20 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Query debe tener al menos 2 caracteres' });
    }

    const response = await searchVessels(query, parseInt(limit));

    // Debug: ver estructura real de GFW
    if (response.entries && response.entries.length > 0) {
      console.log('📦 Estructura GFW (primer resultado):', JSON.stringify(response.entries[0], null, 2));
    }

    // Normalizar a formato esperado por tu UI
    const vessels = (response.entries || []).map((vessel) => {
      // GFW v3 estructura: vessel.registryInfo[], vessel.selfReportedInfo, vessel.combinedSourcesInfo[]
      const registry = vessel.registryInfo?.[0] || {};
      const selfReported = vessel.selfReportedInfo || {};
      const combined = vessel.combinedSourcesInfo?.[0] || {};
      
      return {
        id: vessel.id,
        name: combined.shipname || registry.shipname || selfReported.shipname || 'Desconocido',
        mmsi: combined.ssvid || registry.ssvid || selfReported.ssvid || 'N/A',
        imo: registry.imo || combined.imo || 'N/A',
        flag: combined.flag || registry.flag || selfReported.flag || 'Unknown',
        type: combined.vesselType || registry.vesselType || selfReported.vesselType || 'Unknown',
        callsign: combined.callsign || registry.callsign || selfReported.callsign || 'N/A',
        length: combined.length || registry.length || null,
        tonnage: combined.tonnage || registry.tonnage || null,
        builtYear: registry.builtYear || null,
      };
    });

    res.json({
      total: response.total || vessels.length,
      vessels,
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Error en vessels/search:', error);
    res.status(500).json({ error: 'Error buscando embarcaciones' });
  }
};

/**
 * 🚢 GET /api/vessels/:id
 * Obtener detalles de una embarcación específica
 */
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await getVesselById(id);

    if (!response) {
      return res.status(404).json({ error: 'Embarcación no encontrada' });
    }

    // Normalizar detalles
    const identity = response.registryInfo?.[0] || {};
    const selfReported = response.selfReportedInfo || {};

    const vessel = {
      id: response.id,
      name: identity.shipname || selfReported.shipname || 'Desconocido',
      mmsi: identity.ssvid || selfReported.ssvid || 'N/A',
      imo: identity.imo || 'N/A',
      flag: identity.flag || selfReported.flag || 'Unknown',
      type: identity.vesselType || selfReported.vesselType || 'Unknown',
      callsign: identity.callsign || 'N/A',
      length: identity.length || null,
      tonnage: identity.tonnage || null,
      builtYear: identity.builtYear || null,
      registryOwner: identity.owner || 'N/A',
      registryOperator: identity.operator || 'N/A',
      registryAuthorizations: identity.authorizations || [],
    };

    res.json(vessel);
  } catch (error) {
    console.error('Error en vessels/:id:', error);
    res.status(500).json({ error: 'Error obteniendo embarcación' });
  }
};

export default {
  search,
  getById,
};
