<template>
  <div class="zonas-container">
    <div class="header">
      <div class="header-content">
        <h1>Zonas Protegidas</h1>
        <p class="header-description">
          <span class="material-symbols-rounded">info</span>
          Zonas marinas oficiales definidas por las autoridades. Las embarcaciones deben respetar estas áreas.
        </p>
      </div>
    </div>

    <div class="content-grid">
      <div class="map-section">
        <div class="map-wrapper">
          <div id="zones-map" ref="mapContainer"></div>
          <div class="map-controls">
            <button class="control-btn" @click="zoomIn" title="Acercar">
              <span class="material-symbols-rounded">add</span>
            </button>
            <button class="control-btn" @click="zoomOut" title="Alejar">
              <span class="material-symbols-rounded">remove</span>
            </button>
            <button class="control-btn" @click="centerMap" title="Centrar mapa">
              <span class="material-symbols-rounded">my_location</span>
            </button>
          </div>
          <div class="map-legend">
            <h4>Leyenda</h4>
            <div class="legend-item">
              <span class="legend-color high"></span>
              <span>Restricción Alta</span>
            </div>
            <div class="legend-item">
              <span class="legend-color medium"></span>
              <span>Restricción Media</span>
            </div>
            <div class="legend-item">
              <span class="legend-color low"></span>
              <span>Monitoreo</span>
            </div>
          </div>
        </div>
      </div>

      <div class="zones-list">
        <h2>
          <span class="material-symbols-rounded">shield</span>
          Zonas Registradas ({{ zones.length }})
        </h2>
        
        <div class="zones-cards">
          <div v-for="zone in zones" :key="zone.id" class="zone-card" :class="zone.level">
            <div class="zone-header">
              <div class="zone-title">
                <span class="zone-icon material-symbols-rounded">{{ zone.icon }}</span>
                <h3>{{ zone.name }}</h3>
              </div>
              <span class="zone-badge" :class="zone.level">{{ zone.levelLabel }}</span>
            </div>

            <div class="zone-info">
              <div class="info-row">
                <span class="material-symbols-rounded">straighten</span>
                <span>Área: {{ zone.area }} km²</span>
              </div>
              <div class="info-row">
                <span class="material-symbols-rounded">directions_boat</span>
                <span>Embarcaciones: {{ zone.boats }}</span>
              </div>
              <div class="info-row">
                <span class="material-symbols-rounded">calendar_month</span>
                <span>Creada: {{ zone.created }}</span>
              </div>
            </div>

            <div class="zone-description">
              <p>{{ zone.description }}</p>
            </div>

            <div class="zone-actions">
              <button class="btn-zone btn-primary" @click="focusZone(zone)">
                <span class="material-symbols-rounded">visibility</span>
                Ver en mapa
              </button>
              <button class="btn-zone btn-info" @click="showZoneDetails(zone)">
                <span class="material-symbols-rounded">info</span>
                Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop :class="selectedZone?.level">
          <button class="modal-close" @click="closeModal">
            <span class="material-symbols-rounded">close</span>
          </button>
          
          <div class="modal-header" v-if="selectedZone">
            <div class="modal-icon" :class="selectedZone.level">
              <span class="material-symbols-rounded">{{ selectedZone.icon }}</span>
            </div>
            <div class="modal-title">
              <h2>{{ selectedZone.name }}</h2>
              <span class="modal-badge" :class="selectedZone.level">
                {{ selectedZone.levelLabel }}
              </span>
            </div>
          </div>

          <div class="modal-body" v-if="selectedZone">
            <div class="detail-section">
              <h3>
                <span class="material-symbols-rounded">lock</span>
                Nivel de Restricción
              </h3>
              <div class="restriction-info" :class="selectedZone.level">
                <p class="restriction-title">{{ getRestrictionTitle(selectedZone.level) }}</p>
                <p class="restriction-desc">{{ getRestrictionDesc(selectedZone.level) }}</p>
              </div>
            </div>

            <div class="detail-grid">
              <div class="detail-item">
                <span class="material-symbols-rounded">straighten</span>
                <div>
                  <p class="detail-label">Área Total</p>
                  <p class="detail-value">{{ selectedZone.area }} km²</p>
                </div>
              </div>

              <div class="detail-item">
                <span class="material-symbols-rounded">directions_boat</span>
                <div>
                  <p class="detail-label">Embarcaciones</p>
                  <p class="detail-value">{{ selectedZone.boats }} detectadas</p>
                </div>
              </div>

              <div class="detail-item">
                <span class="material-symbols-rounded">calendar_month</span>
                <div>
                  <p class="detail-label">Fecha de Creación</p>
                  <p class="detail-value">{{ selectedZone.created }}</p>
                </div>
              </div>

              <div class="detail-item">
                <span class="material-symbols-rounded">verified</span>
                <div>
                  <p class="detail-label">Administrada por</p>
                  <p class="detail-value">CONAP Guatemala</p>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>
                <span class="material-symbols-rounded">description</span>
                Descripción
              </h3>
              <p class="zone-full-description">{{ selectedZone.description }}</p>
            </div>

            <div class="detail-section info-section">
              <span class="material-symbols-rounded">info</span>
              <p>Las zonas protegidas son definidas por las autoridades marítimas y no pueden ser modificadas sin autorización oficial.</p>
            </div>

            <div class="modal-actions">
              <button class="btn-modal btn-primary" @click="focusZoneFromModal">
                <span class="material-symbols-rounded">map</span>
                Ver en Mapa
              </button>
              <button class="btn-modal btn-secondary" @click="closeModal">
                <span class="material-symbols-rounded">check</span>
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { getAllZones, createZone, updateZone, deleteZone } from '@/backend/services/api.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const zones = ref([]);
const loading = ref(false);
const mapContainer = ref(null);
const showModal = ref(false);
const selectedZone = ref(null);

let map = null;
let zoneLayersGroup = null;

// Colores por nivel de zona
const zoneColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#3b82f6'
};

// Inicializar mapa de Leaflet
const initMap = () => {
  if (map) return;

  // Coordenadas de Guatemala (centro por defecto)
  const center = [15.5, -90.25];
  
  map = L.map('zones-map', {
    center: center,
    zoom: 8,
    zoomControl: false
  });

  // Agregar capa de mapa base (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  // Grupo para las zonas
  zoneLayersGroup = L.layerGroup().addTo(map);
};

// Renderizar zonas en el mapa
const renderZonesOnMap = () => {
  if (!map || !zoneLayersGroup) return;

  // Limpiar capas anteriores
  zoneLayersGroup.clearLayers();

  zones.value.forEach(zone => {
    if (!zone.geometry || !zone.geometry.coordinates) return;

    // Convertir coordenadas GeoJSON [lon, lat] a Leaflet [lat, lon]
    const coordinates = zone.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);

    // Crear polígono
    const polygon = L.polygon(coordinates, {
      color: zoneColors[zone.level],
      fillColor: zoneColors[zone.level],
      fillOpacity: 0.3,
      weight: 3
    });

    // Popup con información
    const popupContent = `
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 0.5rem; color: ${zoneColors[zone.level]};">
          ${zone.name}
        </h3>
        <p style="margin: 0.25rem 0; font-size: 0.9rem;">
          <strong>Nivel:</strong> ${zone.levelLabel}
        </p>
        <p style="margin: 0.25rem 0; font-size: 0.9rem;">
          <strong>Área:</strong> ${zone.area} km²
        </p>
        <p style="margin: 0.25rem 0; font-size: 0.9rem;">
          <strong>Embarcaciones:</strong> ${zone.boats}
        </p>
        <p style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #6b7280;">
          ${zone.description}
        </p>
      </div>
    `;

    polygon.bindPopup(popupContent);
    polygon.addTo(zoneLayersGroup);

    // Guardar referencia para enfocar después
    polygon.zoneId = zone.id;
  });

  // Ajustar vista para mostrar todas las zonas
  if (zoneLayersGroup.getLayers().length > 0) {
    map.fitBounds(zoneLayersGroup.getBounds(), { padding: [50, 50] });
  }
};

// Cargar zonas desde la API
const loadZones = async () => {
  try {
    loading.value = true;
    const zonesData = await getAllZones(true); // Solo activas
    
    zones.value = zonesData.map(zone => ({
      id: zone.id,
      name: zone.name,
      level: zone.level,
      levelLabel: zone.levelLabel,
      icon: zone.icon,
      area: zone.area,
      boats: zone.boats,
      created: zone.created,
      description: zone.description,
      geometry: zone.geometry
    }));

    // Renderizar en el mapa después de cargar
    await nextTick();
    renderZonesOnMap();
  } catch (error) {
    console.error('Error cargando zonas:', error);
    zones.value = [];
  } finally {
    loading.value = false;
  }
};

// Enfocar zona en el mapa
const focusZone = (zone) => {
  if (!map || !zone.geometry) return;

  const coordinates = zone.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
  const bounds = L.latLngBounds(coordinates);
  
  map.fitBounds(bounds, { 
    padding: [100, 100],
    maxZoom: 12
  });

  // Encontrar y abrir popup
  zoneLayersGroup.eachLayer(layer => {
    if (layer.zoneId === zone.id) {
      layer.openPopup();
    }
  });

  // Scroll suave al mapa (solo en desktop)
  if (window.innerWidth > 1200) {
    const mapElement = document.getElementById('zones-map');
    if (mapElement) {
      mapElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }
};

// Controles de mapa
const zoomIn = () => {
  if (map) map.zoomIn();
};

const zoomOut = () => {
  if (map) map.zoomOut();
};

const centerMap = () => {
  if (map && zoneLayersGroup.getLayers().length > 0) {
    map.fitBounds(zoneLayersGroup.getBounds(), { padding: [50, 50] });
  }
};

// Mostrar detalles de la zona
const showZoneDetails = (zone) => {
  selectedZone.value = zone;
  showModal.value = true;
};

// Cerrar modal
const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    selectedZone.value = null;
  }, 300);
};

// Enfocar zona desde el modal
const focusZoneFromModal = () => {
  if (selectedZone.value) {
    focusZone(selectedZone.value);
    closeModal();
  }
};

// Obtener título de restricción
const getRestrictionTitle = (level) => {
  const titles = {
    high: '⛔ PROHIBIDO TOTALMENTE',
    medium: '⚠️ REGULADO - Permiso Requerido',
    low: '👁️ VIGILANCIA ACTIVA'
  };
  return titles[level] || '';
};

// Obtener descripción de restricción
const getRestrictionDesc = (level) => {
  const descriptions = {
    high: 'No se permite ninguna actividad pesquera. Solo acceso autorizado con permiso especial. Violación sujeta a multas y sanciones.',
    medium: 'Pesca permitida SOLO con licencia especial. Cuotas de captura limitadas. Métodos de pesca restringidos. Reportes obligatorios.',
    low: 'Pesca permitida normalmente. Actividad monitoreada constantemente. Reportes recomendados. Inspecciones aleatorias.'
  };
  return descriptions[level] || '';
};

// Cargar zonas al montar
onMounted(async () => {
  await loadZones();
  await nextTick();
  initMap();
});

// Limpiar mapa al desmontar
onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
.zonas-container {
  padding: 2rem;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.header h1 {
  font-size: 2rem;
  color: #064e3b;
  margin: 0;
}

.header-description {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.95rem;
  padding: 0.75rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border-left: 4px solid #3b82f6;
  border-radius: 6px;
}

.header-description .material-symbols-rounded {
  color: #3b82f6;
  font-size: 1.3rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  align-items: start;
}

.map-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow: hidden;
}

.map-wrapper {
  position: relative;
}

#zones-map {
  width: 100%;
  height: 600px;
  border-radius: 8px;
  z-index: 1;
}

.map-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
}

.control-btn {
  width: 44px;
  height: 44px;
  background: white;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #f3f4f6;
  transform: scale(1.05);
}

.control-btn .material-symbols-rounded {
  color: #064e3b;
}

.map-legend {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 1000;
}

.map-legend h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #1f2937;
  font-weight: 600;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-color {
  width: 20px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid;
}

.legend-color.high {
  background-color: rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
}

.legend-color.medium {
  background-color: rgba(245, 158, 11, 0.3);
  border-color: #f59e0b;
}

.legend-color.low {
  background-color: rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
}

.zones-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Scrollbar personalizado */
.zones-list::-webkit-scrollbar {
  width: 8px;
}

.zones-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.zones-list::-webkit-scrollbar-thumb {
  background: #064e3b;
  border-radius: 10px;
}

.zones-list::-webkit-scrollbar-thumb:hover {
  background: #022c22;
}

.zones-list h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #064e3b;
  font-size: 1.25rem;
  margin: 0;
}

.zones-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.zone-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.zone-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.zone-card.high {
  border-left-color: #ef4444;
}

.zone-card.medium {
  border-left-color: #f59e0b;
}

.zone-card.low {
  border-left-color: #3b82f6;
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.zone-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.zone-icon {
  font-size: 1.5rem;
}

.zone-card.high .zone-icon {
  color: #ef4444;
}

.zone-card.medium .zone-icon {
  color: #f59e0b;
}

.zone-card.low .zone-icon {
  color: #3b82f6;
}

.zone-title h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1f2937;
}

.zone-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.zone-badge.high {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.zone-badge.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.zone-badge.low {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.zone-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.info-row .material-symbols-rounded {
  font-size: 1.2rem;
  color: #064e3b;
}

.zone-description {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
}

.zone-description p {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
}

.zone-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-zone {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: rgba(6, 78, 59, 0.1);
  color: #064e3b;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-zone.btn-primary {
  background: rgba(6, 78, 59, 0.1);
  color: #064e3b;
}

.btn-zone.btn-primary:hover {
  background: rgba(6, 78, 59, 0.2);
}

.btn-zone.btn-info {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.btn-zone.btn-info:hover {
  background: rgba(59, 130, 246, 0.2);
}

.btn-zone .material-symbols-rounded {
  font-size: 1.2rem;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .map-section {
    position: relative;
    top: 0;
    max-height: none;
  }
  
  .zones-list {
    max-height: none;
    overflow-y: visible;
  }
}

@media (max-width: 768px) {
  .zonas-container {
    padding: 1rem;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  color: #1f2937;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.modal-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 2px solid;
}

.modal-content.high .modal-header {
  border-bottom-color: #ef4444;
  background: linear-gradient(to bottom, rgba(239, 68, 68, 0.05), transparent);
}

.modal-content.medium .modal-header {
  border-bottom-color: #f59e0b;
  background: linear-gradient(to bottom, rgba(245, 158, 11, 0.05), transparent);
}

.modal-content.low .modal-header {
  border-bottom-color: #3b82f6;
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent);
}

.modal-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2.5rem;
}

.modal-icon.high {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

.modal-icon.medium {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.modal-icon.low {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.modal-title {
  text-align: center;
}

.modal-title h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: #1f2937;
}

.modal-badge {
  display: inline-block;
  padding: 0.375rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.modal-badge.high {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.modal-badge.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.modal-badge.low {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.modal-body {
  padding: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #064e3b;
  margin: 0 0 1rem;
}

.restriction-info {
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid;
}

.restriction-info.high {
  background: rgba(239, 68, 68, 0.05);
  border-left-color: #ef4444;
}

.restriction-info.medium {
  background: rgba(245, 158, 11, 0.05);
  border-left-color: #f59e0b;
}

.restriction-info.low {
  background: rgba(59, 130, 246, 0.05);
  border-left-color: #3b82f6;
}

.restriction-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin: 0 0 0.75rem;
  color: #1f2937;
}

.restriction-desc {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.detail-item:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.detail-item .material-symbols-rounded {
  color: #064e3b;
  font-size: 1.5rem;
}

.detail-label {
  margin: 0;
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.detail-value {
  margin: 0.25rem 0 0;
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
}

.zone-full-description {
  margin: 0;
  color: #6b7280;
  line-height: 1.8;
  font-size: 1rem;
}

.info-section {
  background: rgba(59, 130, 246, 0.05);
  padding: 1rem 1.25rem;
  border-radius: 10px;
  border-left: 4px solid #3b82f6;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.info-section .material-symbols-rounded {
  color: #3b82f6;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-section p {
  margin: 0;
  color: #1f2937;
  line-height: 1.6;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-modal {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-modal.btn-primary {
  background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
  color: white;
}

.btn-modal.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(6, 78, 59, 0.3);
}

.btn-modal.btn-secondary {
  background: #f3f4f6;
  color: #1f2937;
}

.btn-modal.btn-secondary:hover {
  background: #e5e7eb;
}

/* Modal Animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
