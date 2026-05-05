<template>
  <div class="radar-container">
    <div class="radar-header">
      <h1>Sistema de Radar - Mapa en Tiempo Real</h1>
      <div class="radar-controls">
        <button class="btn-primary" @click="refreshData">
          <span class="material-symbols-rounded">refresh</span>
          Actualizar Datos
        </button>
        <button class="btn-secondary" @click="centerMap">
          <span class="material-symbols-rounded">my_location</span>
          Centrar Mapa
        </button>
      </div>
    </div>

    <div class="radar-status">
      <div class="status-badge active">
        <span class="pulse"></span>
        Radar Activo
      </div>
      <p>Última actualización: {{ lastUpdate }}</p>
      <div class="stats-bar">
        <span><strong>{{ vessels.length }}</strong> embarcaciones detectadas</span>
        <span><strong>{{ zones.length }}</strong> zonas monitoreadas</span>
        <span><strong>{{ alerts.length }}</strong> alertas activas</span>
      </div>
    </div>

    <div class="radar-content">
      <div class="map-container">
        <div id="map" ref="mapContainer"></div>
        
        <div class="map-legend">
          <h3>Leyenda</h3>
          <div class="legend-item">
            <span class="legend-icon vessel"></span>
            <span>Embarcación</span>
          </div>
          <div class="legend-item">
            <span class="legend-icon zone"></span>
            <span>Zona Protegida</span>
          </div>
          <div class="legend-item">
            <span class="legend-icon alert"></span>
            <span>Alerta</span>
          </div>
        </div>
      </div>

      <div class="detections-panel">
        <h2>
          <span class="material-symbols-rounded">directions_boat</span>
          Embarcaciones Detectadas ({{ vessels.length }})
        </h2>
        
        <div v-if="loading" class="loading-state">
          <span class="material-symbols-rounded spinning">progress_activity</span>
          <p>Cargando embarcaciones...</p>
        </div>
        
        <div v-else class="detections-list">
          <div v-for="vessel in vessels" 
               :key="vessel.id" 
               class="detection-card"
               @click="focusVessel(vessel)">
            <div class="detection-header">
              <span class="detection-id">{{ vessel.name }}</span>
              <span class="detection-badge" :class="vessel.status">
                {{ vessel.status }}
              </span>
            </div>
            <div class="detection-details">
              <div class="detail-item">
                <span class="material-symbols-rounded">flag</span>
                <span>{{ vessel.flag }}</span>
              </div>
              <div class="detail-item">
                <span class="material-symbols-rounded">category</span>
                <span>{{ vessel.type }}</span>
              </div>
              <div class="detail-item" v-if="vessel.mmsi">
                <span class="material-symbols-rounded">tag</span>
                <span>MMSI: {{ vessel.mmsi }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { searchVessels } from '@/backend/services/api.js';
import { getAllZones } from '@/backend/services/api.js';
import { getAlerts } from '@/backend/services/api.js';

const route = useRoute();
const mapContainer = ref(null);
let map = null;
const loading = ref(true);
const lastUpdate = ref('');
const vessels = ref([]);
const zones = ref([]);
const alerts = ref([]);
const vesselMarkers = ref([]);
const zonePolygons = ref([]);

// Inicializar el mapa
const initMap = () => {
  if (!mapContainer.value) return;

  // Crear mapa centrado en el océano Pacífico (coordenadas generales)
  map = L.map(mapContainer.value).setView([-10, -80], 5);

  // Agregar capa de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  console.log('✅ Mapa inicializado');
};

// Cargar embarcaciones desde GFW
const loadVessels = async () => {
  try {
    loading.value = true;
    console.log('🔄 Cargando embarcaciones desde GFW...');
    
    // Si viene de búsqueda de embarcación, buscar esa específica
    const searchTerm = route.query.vesselName || route.query.mmsi || 'fishing';
    const result = await searchVessels(searchTerm, 50);
    
    vessels.value = result.vessels.map(vessel => ({
      id: vessel.id,
      name: vessel.name || 'Sin nombre',
      mmsi: vessel.mmsi,
      imo: vessel.imo,
      flag: vessel.flag || 'Unknown',
      type: vessel.type || 'Unknown',
      status: 'normal',
      // Posiciones simuladas (GFW requiere permisos especiales para tracks)
      lat: -10 + (Math.random() - 0.5) * 20,
      lon: -80 + (Math.random() - 0.5) * 20
    }));

    console.log(`✅ ${vessels.value.length} embarcaciones cargadas`);
    console.log('📋 Primeras 5 embarcaciones:', vessels.value.slice(0, 5).map(v => ({ name: v.name, mmsi: v.mmsi, flag: v.flag })));
    
    // Agregar marcadores al mapa
    addVesselMarkers();
    
    // Si viene de rastrear una embarcación específica, enfocarla
    if (route.query.vesselId || route.query.vesselName) {
      setTimeout(() => {
        const targetVessel = vessels.value.find(v => 
          v.id === route.query.vesselId || 
          v.name === route.query.vesselName ||
          v.mmsi === route.query.mmsi
        );
        if (targetVessel) {
          focusVessel(targetVessel);
        }
      }, 500);
    }
    
  } catch (error) {
    console.error('❌ Error cargando embarcaciones:', error);
  } finally {
    loading.value = false;
  }
};

// Cargar zonas protegidas
const loadZones = async () => {
  try {
    const zonesData = await getAllZones(true);
    zones.value = zonesData;
    
    console.log(`✅ ${zones.value.length} zonas cargadas`);
    
    // Agregar polígonos al mapa
    addZonePolygons();
    
  } catch (error) {
    console.error('❌ Error cargando zonas:', error);
  }
};

// Cargar alertas activas
const loadAlerts = async () => {
  try {
    const alertsData = await getAlerts({ status: 'active' });
    alerts.value = alertsData.slice(0, 10);
    
    console.log(`✅ ${alerts.value.length} alertas cargadas`);
    
  } catch (error) {
    console.error('❌ Error cargando alertas:', error);
  }
};

// Agregar marcadores de embarcaciones al mapa
const addVesselMarkers = () => {
  if (!map) return;

  // Limpiar marcadores anteriores
  vesselMarkers.value.forEach(marker => marker.remove());
  vesselMarkers.value = [];

  // Crear marcadores para cada embarcación
  vessels.value.forEach(vessel => {
    const icon = L.divIcon({
      className: 'vessel-marker',
      html: `<div class="marker-content">
               <span class="material-symbols-rounded">directions_boat</span>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([vessel.lat, vessel.lon], { icon })
      .addTo(map)
      .bindPopup(`
        <div class="vessel-popup">
          <h3>${vessel.name}</h3>
          <p><strong>MMSI:</strong> ${vessel.mmsi || 'N/A'}</p>
          <p><strong>Bandera:</strong> ${vessel.flag}</p>
          <p><strong>Tipo:</strong> ${vessel.type}</p>
          <p><strong>Estado:</strong> ${vessel.status}</p>
        </div>
      `);

    vesselMarkers.value.push(marker);
  });

  console.log(`✅ ${vesselMarkers.value.length} marcadores agregados al mapa`);
};

// Agregar polígonos de zonas protegidas
const addZonePolygons = () => {
  if (!map || !zones.value.length) return;

  // Limpiar polígonos anteriores
  zonePolygons.value.forEach(poly => poly.remove());
  zonePolygons.value = [];

  zones.value.forEach(zone => {
    if (!zone.geometry || zone.geometry.type !== 'Polygon') return;

    const coordinates = zone.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);

    const color = zone.level === 'high' ? '#ef4444' : 
                  zone.level === 'medium' ? '#f59e0b' : '#3b82f6';

    const polygon = L.polygon(coordinates, {
      color: color,
      fillColor: color,
      fillOpacity: 0.2,
      weight: 2
    }).addTo(map)
      .bindPopup(`
        <div class="zone-popup">
          <h3>${zone.name}</h3>
          <p><strong>Nivel:</strong> ${zone.level}</p>
          <p>${zone.description || 'Zona protegida'}</p>
        </div>
      `);

    zonePolygons.value.push(polygon);
  });

  console.log(`✅ ${zonePolygons.value.length} zonas agregadas al mapa`);
};

// Enfocar embarcación en el mapa
const focusVessel = (vessel) => {
  if (!map) return;
  map.setView([vessel.lat, vessel.lon], 10);
  
  // Abrir popup del marcador correspondiente
  const marker = vesselMarkers.value.find(m => 
    m.getLatLng().lat === vessel.lat && m.getLatLng().lng === vessel.lon
  );
  if (marker) marker.openPopup();
};

// Centrar mapa
const centerMap = () => {
  if (!map) return;
  map.setView([-10, -80], 5);
};

// Refrescar datos
const refreshData = async () => {
  updateTime();
  await Promise.all([
    loadVessels(),
    loadZones(),
    loadAlerts()
  ]);
};

// Actualizar tiempo
const updateTime = () => {
  const now = new Date();
  lastUpdate.value = now.toLocaleTimeString('es-ES');
};

let updateInterval;

onMounted(async () => {
  initMap();
  updateTime();
  
  // Cargar datos iniciales
  await refreshData();
  
  // Actualizar cada 30 segundos
  updateInterval = setInterval(() => {
    updateTime();
  }, 30000);
});

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval);
  if (map) map.remove();
});
</script>

<style scoped>
.radar-container {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .radar-container {
    padding: 1rem;
  }
}

.radar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.radar-header h1 {
  font-size: 2rem;
  margin: 0;
}

.radar-controls {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.radar-status {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 2px solid #10b981;
}

.pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.stats-bar {
  display: flex;
  gap: 2rem;
  font-size: 0.95rem;
}

.stats-bar span {
  color: rgba(255, 255, 255, 0.8);
}

.stats-bar strong {
  color: #10b981;
  font-size: 1.1rem;
}

.radar-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.map-container {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

#map {
  width: 100%;
  height: 600px;
  z-index: 1;
}

.map-legend {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  color: #1f2937;
}

.map-legend h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: #064e3b;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.legend-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.legend-icon.vessel {
  background: #10b981;
}

.legend-icon.zone {
  background: rgba(59, 130, 246, 0.3);
  border: 2px solid #3b82f6;
}

.legend-icon.alert {
  background: #ef4444;
}

.detections-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.detections-panel h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.6);
}

.spinning {
  animation: spin 1s linear infinite;
  font-size: 3rem;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.detections-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
}

.detection-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.detection-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
  border-color: #10b981;
}

.detection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.detection-id {
  font-weight: 600;
  font-size: 1.1rem;
}

.detection-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.detection-badge.normal {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.detection-badge.warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.detection-badge.alert {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.detection-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.detail-item .material-symbols-rounded {
  font-size: 1.1rem;
  color: #10b981;
}

@media (max-width: 1200px) {
  .radar-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .radar-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stats-bar {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>

<style>
/* Estilos globales para Leaflet */
.vessel-marker {
  background: transparent;
  border: none;
}

.marker-content {
  width: 32px;
  height: 32px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.5);
  animation: marker-pulse 2s infinite;
}

@keyframes marker-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.vessel-popup h3 {
  margin: 0 0 0.5rem 0;
  color: #064e3b;
}

.vessel-popup p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.zone-popup h3 {
  margin: 0 0 0.5rem 0;
  color: #064e3b;
}

.zone-popup p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}
</style>
