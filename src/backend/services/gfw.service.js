import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GFW_API_BASE = 'https://gateway.api.globalfishingwatch.org/v3';
const GFW_TOKEN = process.env.GFW_TOKEN;

// Cliente Axios configurado para GFW
const gfwClient = axios.create({
  baseURL: GFW_API_BASE,
  headers: {
    'Authorization': `Bearer ${GFW_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor para logging (desarrollo)
gfwClient.interceptors.request.use(
  (config) => {
    console.log(`🌊 GFW Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

gfwClient.interceptors.response.use(
  (response) => {
    console.log(`✅ GFW Response: ${response.status} - ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ GFW Error: ${error.response?.status} - ${error.config?.url}`, error.response?.data);
    return Promise.reject(error);
  }
);

/**
 * 🔍 BÚSQUEDA DE EMBARCACIONES
 * Endpoint: /vessels/search
 * Params: query (nombre o MMSI), datasets, limit
 * NOTA: GFW v3 no soporta offset, solo limit
 */
export const searchVessels = async (query, limit = 10) => {
  try {
    const response = await gfwClient.get('/vessels/search', {
      params: {
        query,
        datasets: ['public-global-vessel-identity:latest'],
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error buscando embarcaciones en GFW:', error.message);
    throw new Error('No se pudo buscar embarcaciones en GFW');
  }
};

/**
 * 🚢 INFORMACIÓN DE EMBARCACIÓN POR ID
 * Endpoint: /vessels/{vesselId}
 */
export const getVesselById = async (vesselId) => {
  try {
    const response = await gfwClient.get(`/vessels/${vesselId}`, {
      params: {
        datasets: ['public-global-vessel-identity:latest'],
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo embarcación ${vesselId}:`, error.message);
    throw new Error('No se pudo obtener información de la embarcación');
  }
};

/**
 * 📍 POSICIONES/TRACKS DE EMBARCACIÓN
 * Endpoint: /vessels/{vesselId}/tracks
 * IMPORTANTE: Requiere permisos especiales en tu cuenta GFW
 */
export const getVesselTracks = async (vesselId, startDate, endDate) => {
  try {
    const response = await gfwClient.get(`/vessels/${vesselId}/tracks`, {
      params: {
        'start-date': startDate, // formato: YYYY-MM-DD
        'end-date': endDate,
        datasets: ['public-global-tracks:latest'],
      },
    });
    return response.data;
  } catch (error) {
    // Si no tienes permisos, retorna array vacío en lugar de error
    if (error.response?.status === 403) {
      console.warn('⚠️ Sin permisos para tracks. Retornando vacío.');
      return { entries: [] };
    }
    throw error;
  }
};

/**
 * 🎣 EVENTOS DE PESCA (Fishing Events)
 * Endpoint: /events
 * NOTA: Depende de los datasets habilitados en tu cuenta
 */
export const getFishingEvents = async (startDate, endDate, vesselIds = []) => {
  try {
    const params = {
      'start-date': startDate,
      'end-date': endDate,
      datasets: ['public-global-fishing-events:latest'],
    };

    if (vesselIds.length > 0) {
      params['vessel-ids'] = vesselIds.join(',');
    }

    const response = await gfwClient.get('/events', { params });
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn('⚠️ Sin permisos para eventos de pesca. Retornando vacío.');
      return { entries: [] };
    }
    throw error;
  }
};

/**
 * 🌍 BÚSQUEDA DE EMBARCACIONES EN ÁREA GEOGRÁFICA
 * Endpoint: /vessels/search
 * Con filtro geográfico (bounding box)
 */
export const searchVesselsInArea = async (bounds, startDate, endDate) => {
  try {
    // bounds: { north, south, east, west }
    const response = await gfwClient.get('/vessels/search', {
      params: {
        datasets: ['public-global-vessel-identity:latest'],
        'start-date': startDate,
        'end-date': endDate,
        // GFW usa diferentes formatos según el endpoint, ajustar según docs
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error buscando embarcaciones en área:', error.message);
    throw error;
  }
};

/**
 * 📊 ACTIVITY (Actividad de embarcaciones)
 * NOTA: Este endpoint puede variar según tu suscripción
 * Alternativa: usar /vessels/{id}/activity
 */
export const getVesselActivity = async (vesselId, startDate, endDate) => {
  try {
    const response = await gfwClient.get(`/vessels/${vesselId}/activity`, {
      params: {
        'start-date': startDate,
        'end-date': endDate,
        datasets: ['public-global-fishing-effort:latest'],
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 404) {
      console.warn(`⚠️ Activity no disponible para ${vesselId}`);
      return { entries: [] };
    }
    throw error;
  }
};

/**
 * ℹ️ HELPER: Verificar disponibilidad de datasets
 * Endpoint: /datasets
 */
export const getAvailableDatasets = async () => {
  try {
    const response = await gfwClient.get('/datasets');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo datasets:', error.message);
    return [];
  }
};

export default {
  searchVessels,
  getVesselById,
  getVesselTracks,
  getFishingEvents,
  searchVesselsInArea,
  getVesselActivity,
  getAvailableDatasets,
};
