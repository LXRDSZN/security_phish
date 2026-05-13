/**
 * 🗺️ SERVICIO DE POSICIONES DE EMBARCACIONES
 * Genera coordenadas fijas y coherentes para embarcaciones en aguas guatemaltecas
 */

// Áreas marítimas de Guatemala - SOLO EN EL MAR, FUERA DE ZONAS PROTEGIDAS
const MARITIME_ZONES = {
  // Costa Pacífico de Guatemala - AL SUR Y OESTE (en el océano)
  PACIFIC_NORTHWEST: {
    name: 'Pacífico Noroeste',
    minLat: 13.20,
    maxLat: 13.60,
    minLon: -92.50,
    maxLon: -92.00
  },
  PACIFIC_WEST: {
    name: 'Pacífico Oeste',
    minLat: 13.00,
    maxLat: 13.50,
    minLon: -92.30,
    maxLon: -91.90
  },
  PACIFIC_SOUTHWEST: {
    name: 'Pacífico Suroeste',
    minLat: 12.80,
    maxLat: 13.30,
    minLon: -92.00,
    maxLon: -91.50
  },
  PACIFIC_SOUTH: {
    name: 'Pacífico Sur',
    minLat: 12.50,
    maxLat: 13.00,
    minLon: -91.50,
    maxLon: -91.00
  },
  // Costa Caribe de Guatemala - AL NORTE Y ESTE (en el mar)
  CARIBBEAN_NORTH: {
    name: 'Caribe Norte',
    minLat: 16.00,
    maxLat: 16.40,
    minLon: -88.80,
    maxLon: -88.30
  },
  CARIBBEAN_EAST: {
    name: 'Caribe Este',
    minLat: 15.90,
    maxLat: 16.30,
    minLon: -88.40,
    maxLon: -87.90
  },
  CARIBBEAN_NORTHEAST: {
    name: 'Caribe Noreste',
    minLat: 16.10,
    maxLat: 16.50,
    minLon: -88.20,
    maxLon: -87.70
  }
};

// Cache de posiciones para mantener consistencia
const vesselPositionsCache = new Map();

/**
 * Genera una posición fija para una embarcación basada en su ID
 * @param {string} vesselId - ID único de la embarcación
 * @param {number} index - Índice en el array (para distribución)
 * @returns {object} { lat, lon, zone, area }
 */
export const generateVesselPosition = (vesselId, index) => {
  // Crear clave única usando ID + índice para evitar colisiones
  const cacheKey = vesselId ? `${vesselId}-${index}` : `vessel-${index}`;
  
  // Si ya existe en cache, retornar
  if (vesselPositionsCache.has(cacheKey)) {
    return vesselPositionsCache.get(cacheKey);
  }

  // Determinar zona basada en el índice (distribución equitativa)
  const zones = Object.values(MARITIME_ZONES);
  const zoneIndex = index % zones.length;
  const zone = zones[zoneIndex];

  // Generar coordenadas ALEATORIAS dentro de la zona usando semillas únicas
  const latRange = zone.maxLat - zone.minLat;
  const lonRange = zone.maxLon - zone.minLon;
  
  // Usar múltiples semillas para mayor dispersión
  const hash = vesselId ? simpleHash(vesselId) : (index * 7919); // número primo
  const seed1 = (hash * 2654435761) % 100000; // números grandes para mejor distribución
  const seed2 = (hash * 1103515245 + index * 12345) % 100000;
  const seed3 = (index * 16807 + hash * 48271) % 100000;
  
  // Generar offsets completamente aleatorios (0 a 1)
  const latOffset = ((seed1 + seed3 * 0.618033) % 100000) / 100000;
  const lonOffset = ((seed2 + seed1 * 0.381966) % 100000) / 100000;

  const position = {
    latitude: parseFloat((zone.minLat + latOffset * latRange).toFixed(6)),
    longitude: parseFloat((zone.minLon + lonOffset * lonRange).toFixed(6)),
    lat: parseFloat((zone.minLat + latOffset * latRange).toFixed(6)),
    lon: parseFloat((zone.minLon + lonOffset * lonRange).toFixed(6)),
    zone: zone.name,
    area: determineArea(zone.name)
  };

  // Guardar en cache
  vesselPositionsCache.set(cacheKey, position);

  return position;
};

/**
 * Genera posiciones para un array de embarcaciones
 * @param {Array} vessels - Array de embarcaciones de GFW
 * @returns {Array} Embarcaciones con coordenadas agregadas
 */
export const addPositionsToVessels = (vessels) => {
  return vessels.map((vessel, index) => {
    const position = generateVesselPosition(vessel.id || vessel.ssvid, index);
    
    return {
      ...vessel,
      ...position
    };
  });
};

/**
 * Obtiene la posición de una embarcación específica
 * @param {string} vesselId - ID de la embarcación
 * @param {number} index - Índice opcional
 * @returns {object} Posición { lat, lon, zone, area }
 */
export const getVesselPosition = (vesselId, index = 0) => {
  const cacheKey = vesselId ? `${vesselId}-${index}` : `vessel-${index}`;
  
  if (vesselPositionsCache.has(cacheKey)) {
    return vesselPositionsCache.get(cacheKey);
  }
  
  return generateVesselPosition(vesselId, index);
};

/**
 * Limpia el cache de posiciones (útil para testing)
 */
export const clearPositionsCache = () => {
  vesselPositionsCache.clear();
};

/**
 * Obtiene todas las posiciones cacheadas
 * @returns {Array} Array de posiciones con sus IDs
 */
export const getAllCachedPositions = () => {
  return Array.from(vesselPositionsCache.entries()).map(([id, position]) => ({
    vesselId: id,
    ...position
  }));
};

/**
 * Hash simple para generar números consistentes desde strings
 * @param {string} str - String a hashear
 * @returns {number} Valor hash
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Determina el área general basada en la zona
 * @param {string} zoneName - Nombre de la zona
 * @returns {string} Área general
 */
function determineArea(zoneName) {
  if (zoneName.includes('Pacífico')) {
    return 'Costa Pacífico de Guatemala';
  } else if (zoneName.includes('Caribe')) {
    return 'Costa Caribe de Guatemala';
  }
  return 'Aguas Territoriales de Guatemala';
}

/**
 * Genera 50 posiciones fijas para embarcaciones de demostración
 * @returns {Array} Array de 50 posiciones
 */
export const generateDemoPositions = () => {
  const positions = [];
  const zones = Object.values(MARITIME_ZONES);
  
  for (let i = 0; i < 50; i++) {
    const zone = zones[i % zones.length];
    const latRange = zone.maxLat - zone.minLat;
    const lonRange = zone.maxLon - zone.minLon;
    
    // Distribución uniforme dentro de cada zona
    const subIndex = Math.floor(i / zones.length);
    const latOffset = (subIndex * 0.15) * latRange;
    const lonOffset = ((i % 5) * 0.2) * lonRange;
    
    positions.push({
      vesselId: `DEMO-${String(i + 1).padStart(3, '0')}`,
      latitude: parseFloat((zone.minLat + latOffset).toFixed(6)),
      longitude: parseFloat((zone.minLon + lonOffset).toFixed(6)),
      lat: parseFloat((zone.minLat + latOffset).toFixed(6)),
      lon: parseFloat((zone.minLon + lonOffset).toFixed(6)),
      zone: zone.name,
      area: determineArea(zone.name)
    });
  }
  
  return positions;
};

export default {
  generateVesselPosition,
  addPositionsToVessels,
  getVesselPosition,
  clearPositionsCache,
  getAllCachedPositions,
  generateDemoPositions,
  MARITIME_ZONES
};
