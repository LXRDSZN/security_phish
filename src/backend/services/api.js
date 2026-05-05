import axios from 'axios';

// Crear instancia de Axios con la configuración básica
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL del backend
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
##################################################################################################
#                          api para login                                                         #
##################################################################################################
*/
export const login = async (username,password) => {
  try {
    const response = await api.post('http://localhost:5000/api/auth/login', {
      username,
      password
    });

    // Devuelve la respuesta de la API, que puede incluir un mensaje de éxito
    return response.data;
  } catch (error) {
    console.error('Error al hacer iniciar sesion:', error);
    // Lanza el error para ser manejado en el componente Vue
    throw error;
  }
};

/*
##################################################################################################
#                          api para registrar                                                     #
##################################################################################################
*/

export const signup = async (username, email, password) => {
  try {
    const response = await api.post('http://localhost:5000/api/auth/signup', {
      username,
      email,
      password
    });

    // Devuelve los datos del servidor (token, mensaje, etc.)
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    // Reenvía el error al componente que lo llamó
    throw error;
  }
};

/*
##################################################################################################
#                          api para cerrar sesión                                                 #
##################################################################################################
*/

export const logout = async () => {
  try {
    const response = await api.post('http://localhost:5000/api/auth/logout', {}, {
      withCredentials: true, //cookie HttpOnly
    });
    return response.data;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

/*
##################################################################################################
#                          api para obtener la cookie                                             #
##################################################################################################
*/

export const obtenerPerfil = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/perfil', {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};

/*
##################################################################################################
#                      API PARA GLOBAL FISHING WATCH - DASHBOARD                                  #
##################################################################################################
*/

/**
 * 📊 Obtener resumen del Dashboard (KPIs)
 */
export const getDashboardSummary = async () => {
  try {
    const response = await api.get('/dashboard/summary');
    return response.data;
  } catch (error) {
    console.error('Error al obtener resumen del dashboard:', error);
    throw error;
  }
};

/**
 * 🕒 Obtener actividad reciente
 */
export const getRecentActivity = async () => {
  try {
    const response = await api.get('/dashboard/activity');
    return response.data;
  } catch (error) {
    console.error('Error al obtener actividad reciente:', error);
    throw error;
  }
};

/*
##################################################################################################
#                      API PARA GLOBAL FISHING WATCH - EMBARCACIONES                              #
##################################################################################################
*/

/**
 * 🔍 Buscar embarcaciones
 * @param {string} query - Término de búsqueda
 * @param {number} limit - Límite de resultados (default: 20)
 */
export const searchVessels = async (query, limit = 20) => {
  try {
    const response = await api.get('/vessels/search', {
      params: { query, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar embarcaciones:', error);
    throw error;
  }
};

/**
 * 🚢 Obtener detalles de embarcación
 * @param {string} vesselId - ID de la embarcación
 */
export const getVesselById = async (vesselId) => {
  try {
    const response = await api.get(`/vessels/${vesselId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener embarcación:', error);
    throw error;
  }
};

/*
##################################################################################################
#                      API PARA GLOBAL FISHING WATCH - POSICIONES/TRACKS                          #
##################################################################################################
*/

/**
 * 📍 Obtener posiciones de embarcación
 * @param {string} vesselId - ID de la embarcación
 * @param {string} from - Fecha inicio (YYYY-MM-DD)
 * @param {string} to - Fecha fin (YYYY-MM-DD)
 */
export const getVesselPositions = async (vesselId, from, to) => {
  try {
    const response = await api.get(`/positions/${vesselId}`, {
      params: { from, to },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener posiciones:', error);
    throw error;
  }
};

/*
##################################################################################################
#                      API PARA ZONAS PROTEGIDAS                                                  #
##################################################################################################
*/

/**
 * 🗺️ Obtener todas las zonas
 * @param {boolean} active - Filtrar solo activas (opcional)
 */
export const getAllZones = async (active) => {
  try {
    const params = {};
    if (active !== undefined) params.active = active;
    
    const response = await api.get('/zones', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener zonas:', error);
    return []; // Retornar array vacío en caso de error
  }
};

// Alias para el dashboard
export const getProtectedZones = getAllZones;

/**
 * 📌 Obtener zona por ID
 * @param {string} zoneId - ID de la zona
 */
export const getZoneById = async (zoneId) => {
  try {
    const response = await api.get(`/zones/${zoneId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener zona:', error);
    throw error;
  }
};

/**
 * ➕ Crear nueva zona
 * @param {object} zoneData - { name, description, level, geometry }
 */
export const createZone = async (zoneData) => {
  try {
    const response = await api.post('/zones', zoneData);
    return response.data;
  } catch (error) {
    console.error('Error al crear zona:', error);
    throw error;
  }
};

/**
 * ✏️ Actualizar zona
 * @param {string} zoneId - ID de la zona
 * @param {object} updates - Campos a actualizar
 */
export const updateZone = async (zoneId, updates) => {
  try {
    const response = await api.put(`/zones/${zoneId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar zona:', error);
    throw error;
  }
};

/**
 * 🗑️ Eliminar zona
 * @param {string} zoneId - ID de la zona
 */
export const deleteZone = async (zoneId) => {
  try {
    const response = await api.delete(`/zones/${zoneId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar zona:', error);
    throw error;
  }
};

/*
##################################################################################################
#                      API PARA ALERTAS                                                           #
##################################################################################################
*/

/**
 * 🚨 Obtener alertas con filtros
 * @param {object} filters - { from, to, priority, status }
 */
export const getAlerts = async (filters = {}) => {
  try {
    const response = await api.get('/alerts', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    throw error;
  }
};

/**
 * ⚙️ Ejecutar reglas de alertas
 * @param {array} vesselIds - Lista de IDs de embarcaciones a verificar
 */
export const runAlertRules = async (vesselIds) => {
  try {
    const response = await api.post('/alerts/run', { vesselIds });
    return response.data;
  } catch (error) {
    console.error('Error al ejecutar reglas de alertas:', error);
    throw error;
  }
};

/**
 * ✅ Resolver alerta
 * @param {string} alertId - ID de la alerta
 * @param {string} resolvedBy - Usuario que resuelve
 */
export const resolveAlert = async (alertId, resolvedBy) => {
  try {
    const response = await api.put(`/alerts/${alertId}/resolve`, { resolvedBy });
    return response.data;
  } catch (error) {
    console.error('Error al resolver alerta:', error);
    throw error;
  }
};

/*
##################################################################################################
#                      API PARA ESTADÍSTICAS                                                      #
##################################################################################################
*/

/**
 * 📊 Obtener resumen de estadísticas
 * @param {string} period - day, week, month, year
 */
export const getStatisticsSummary = async (period = 'month') => {
  try {
    const response = await api.get(`/statistics/summary?period=${period}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener resumen de estadísticas:', error);
    throw error;
  }
};

/**
 * 🚢 Obtener estadísticas de embarcaciones
 */
export const getVesselsStatistics = async () => {
  try {
    const response = await api.get('/statistics/vessels');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de embarcaciones:', error);
    throw error;
  }
};

/**
 * 🗺️ Obtener estadísticas de zonas
 */
export const getZonesStatistics = async () => {
  try {
    const response = await api.get('/statistics/zones');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de zonas:', error);
    throw error;
  }
};

/**
 * 🚨 Obtener estadísticas de alertas
 * @param {string} period - day, week, month, year
 */
export const getAlertsStatistics = async (period = 'month') => {
  try {
    const response = await api.get(`/statistics/alerts?period=${period}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de alertas:', error);
    throw error;
  }
};

/**
 * 📈 Obtener datos de serie temporal
 * @param {string} period - day, week, month, year
 * @param {string} metric - alerts, vessels, etc
 */
export const getTimeSeriesData = async (period = 'week', metric = 'alerts') => {
  try {
    const response = await api.get(`/statistics/timeseries?period=${period}&metric=${metric}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener serie temporal:', error);
    throw error;
  }
};

/*
##################################################################################################
#                      API PARA REPORTES                                                          #
##################################################################################################
*/

/**
 * 📄 Generar un nuevo reporte
 * @param {object} reportData - { title, type, period, format }
 */
export const generateReport = async (reportData) => {
  try {
    const response = await api.post('/reports/generate', reportData);
    return response.data;
  } catch (error) {
    console.error('Error al generar reporte:', error);
    throw error;
  }
};

/**
 * 📋 Obtener lista de reportes
 * @param {object} filters - { type, period, limit }
 */
export const getReports = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/reports?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    throw error;
  }
};

/**
 * 📄 Obtener un reporte específico
 * @param {string} reportId - ID del reporte
 */
export const getReportById = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    throw error;
  }
};

/**
 * 🗑️ Eliminar un reporte
 * @param {string} reportId - ID del reporte
 */
export const deleteReport = async (reportId) => {
  try {
    const response = await api.delete(`/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    throw error;
  }
};

/**
 * 📥 Descargar un reporte
 * @param {string} reportId - ID del reporte
 */
export const downloadReportFile = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error al descargar reporte:', error);
    throw error;
  }
};

