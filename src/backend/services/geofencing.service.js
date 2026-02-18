/**
 * 🗺️ SERVICIO DE GEOFENCING
 * Detecta si un punto (lat, lon) está dentro de un polígono (zona protegida)
 * Usa algoritmo Ray-Casting para point-in-polygon
 */

/**
 * Point-in-Polygon usando Ray-Casting Algorithm
 * @param {Object} point - { lat: number, lon: number }
 * @param {Array} polygon - Array de [lon, lat] (formato GeoJSON)
 * @returns {Boolean}
 */
export const isPointInPolygon = (point, polygon) => {
  const { lat, lon } = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0]; // lon
    const yi = polygon[i][1]; // lat
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};

/**
 * Verifica si un punto está dentro de alguna zona protegida
 * @param {Object} point - { lat, lon }
 * @param {Array} zones - Array de zonas (cada una con geometry tipo Polygon)
 * @returns {Array} - Zonas que contienen el punto
 */
export const getZonesContainingPoint = (point, zones) => {
  const zonesFound = [];

  for (const zone of zones) {
    if (!zone.geometry || zone.geometry.type !== 'Polygon') continue;

    const coordinates = zone.geometry.coordinates[0]; // Primer anillo del polígono
    if (isPointInPolygon(point, coordinates)) {
      zonesFound.push(zone);
    }
  }

  return zonesFound;
};

/**
 * Calcula distancia entre dos puntos (Haversine)
 * @param {Object} point1 - { lat, lon }
 * @param {Object} point2 - { lat, lon }
 * @returns {Number} - Distancia en km
 */
export const calculateDistance = (point1, point2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lon - point1.lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

/**
 * Detecta si una embarcación estuvo dentro de una zona por tiempo prolongado
 * @param {Array} positions - [{ lat, lon, timestamp }]
 * @param {Object} zone - Zona con geometry
 * @param {Number} minMinutes - Tiempo mínimo en minutos
 * @returns {Boolean}
 */
export const detectProlongedStay = (positions, zone, minMinutes = 30) => {
  if (!zone.geometry || zone.geometry.type !== 'Polygon') return false;

  const coordinates = zone.geometry.coordinates[0];
  let entryTime = null;
  let insideCount = 0;

  for (const pos of positions) {
    const inside = isPointInPolygon({ lat: pos.lat, lon: pos.lon }, coordinates);

    if (inside) {
      if (!entryTime) {
        entryTime = new Date(pos.timestamp);
      }
      insideCount++;
    } else {
      // Salió de la zona, resetear
      entryTime = null;
      insideCount = 0;
    }

    // Verificar si estuvo más del tiempo mínimo
    if (entryTime && insideCount >= 2) {
      const currentTime = new Date(pos.timestamp);
      const durationMinutes = (currentTime - entryTime) / (1000 * 60);

      if (durationMinutes >= minMinutes) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Calcula área aproximada de un polígono (en km²)
 * Método simplificado para polígonos pequeños
 */
export const calculatePolygonArea = (coordinates) => {
  if (!coordinates || coordinates.length < 3) return 0;

  let area = 0;
  const R = 6371; // Radio Tierra en km

  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lon1, lat1] = coordinates[i];
    const [lon2, lat2] = coordinates[i + 1];

    area += toRad(lon2 - lon1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
  }

  area = (area * R * R) / 2;
  return Math.abs(area);
};

export default {
  isPointInPolygon,
  getZonesContainingPoint,
  calculateDistance,
  detectProlongedStay,
  calculatePolygonArea,
};
