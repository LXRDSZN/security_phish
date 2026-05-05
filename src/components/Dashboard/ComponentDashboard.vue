<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Dashboard de Monitoreo</h1>
      <p class="date">{{ currentDate }}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card green">
        <div class="stat-icon">
          <span class="material-symbols-rounded">directions_boat</span>
        </div>
        <div class="stat-content">
          <h3>{{ totalEmbarcaciones }}</h3>
          <p>Embarcaciones Activas</p>
        </div>
      </div>

      <div class="stat-card blue">
        <div class="stat-icon">
          <span class="material-symbols-rounded">map</span>
        </div>
        <div class="stat-content">
          <h3>{{ zonasProtegidas }}</h3>
          <p>Zonas Protegidas</p>
        </div>
      </div>

      <div class="stat-card red">
        <div class="stat-icon">
          <span class="material-symbols-rounded">warning</span>
        </div>
        <div class="stat-content">
          <h3>{{ alertasActivas }}</h3>
          <p>Alertas Activas</p>
        </div>
      </div>

      <div class="stat-card orange">
        <div class="stat-icon">
          <span class="material-symbols-rounded">radar</span>
        </div>
        <div class="stat-content">
          <h3>{{ deteccionesHoy }}</h3>
          <p>Detecciones Hoy</p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card recent-activity">
        <h2>
          <span class="material-symbols-rounded">history</span>
          Actividad Reciente
        </h2>
        <div class="activity-list">
          <div v-if="recentActivities.length === 0" class="empty-state">
            <span class="material-symbols-rounded">pending_actions</span>
            <p>No hay actividad reciente</p>
          </div>
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon" :class="activity.type">
              <span class="material-symbols-rounded">{{ activity.icon }}</span>
            </div>
            <div class="activity-info">
              <p class="activity-title">{{ activity.title }}</p>
              <p class="activity-time">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card map-preview">
        <h2>
          <span class="material-symbols-rounded">location_on</span>
          Mapa en Tiempo Real
        </h2>
        <div class="map-wrapper">
          <div id="dashboard-map" ref="mapContainer"></div>
        </div>
        <div class="map-stats">
          <div class="stat-item">
            <span class="material-symbols-rounded">directions_boat</span>
            <span>{{ totalEmbarcaciones }} activas</span>
          </div>
          <div class="stat-item">
            <span class="material-symbols-rounded">warning</span>
            <span>{{ alertasActivas }} alertas</span>
          </div>
          <div class="stat-item">
            <span class="material-symbols-rounded">shield</span>
            <span>{{ zonasProtegidas }} zonas</span>
          </div>
        </div>
      </div>
    </div>

    <div class="alerts-section">
      <h2>
        <span class="material-symbols-rounded">notifications_active</span>
        Alertas Recientes
      </h2>
      <div class="alerts-list">
        <div v-for="alert in alerts" :key="alert.id" class="alert-item" :class="alert.severity">
          <span class="material-symbols-rounded">warning</span>
          <div class="alert-content">
            <p class="alert-title">{{ alert.title }}</p>
            <p class="alert-description">{{ alert.description }}</p>
          </div>
          <span class="alert-time">{{ alert.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDashboardSummary, getRecentActivity, getAlerts, searchVessels, getProtectedZones } from '@/backend/services/api.js';

const currentDate = ref('');
const totalEmbarcaciones = ref(0);
const zonasProtegidas = ref(0);
const alertasActivas = ref(0);
const deteccionesHoy = ref(0);
const loading = ref(true);
const mapContainer = ref(null);
let map = null;
let vesselsLayer = null;
let zonesLayer = null;

const recentActivities = ref([]);
const alerts = ref([]);

// Inicializar mapa
const initMap = () => {
  if (!mapContainer.value) return;

  // Centro en Guatemala
  map = L.map('dashboard-map').setView([15.7835, -90.2308], 8);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  vesselsLayer = L.layerGroup().addTo(map);
  zonesLayer = L.layerGroup().addTo(map);
};

// Cargar embarcaciones en el mapa
const loadVesselsOnMap = async () => {
  try {
    console.log('🚢 Cargando embarcaciones en el mapa...');
    
    // Buscar embarcaciones de pesca en el área de Guatemala
    const response = await searchVessels('fishing', 100);
    
    console.log('📦 Respuesta de embarcaciones:', response);

    if (vesselsLayer) {
      vesselsLayer.clearLayers();
    }

    // La API devuelve { vessels: [], total: X }
    const vessels = response.vessels || response.entries || [];
    
    if (vessels.length === 0) {
      console.warn('⚠️ No se encontraron embarcaciones');
      // Agregar embarcaciones de ejemplo en el área de Guatemala
      addDemoVessels();
      return;
    }

    let vesselsAdded = 0;

    vessels.forEach(vessel => {
      // Verificar que tenga coordenadas válidas
      const lat = vessel.latitude || vessel.lat;
      const lon = vessel.longitude || vessel.lon;
      
      if (lat && lon && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        const vesselIcon = L.divIcon({
          html: `<div style="background: #10b981; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: 'vessel-marker',
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = L.marker([lat, lon], { icon: vesselIcon })
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #064e3b; font-size: 14px;">
                🚢 ${vessel.shipName || vessel.name || 'Embarcación'}
              </h3>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Tipo:</strong> ${vessel.shipType || vessel.type || 'Pesca'}
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>MMSI:</strong> ${vessel.ssvid || vessel.mmsi || 'N/A'}
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Bandera:</strong> ${vessel.flag || 'N/A'}
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Posición:</strong> ${lat.toFixed(4)}, ${lon.toFixed(4)}
              </p>
            </div>
          `);
        
        vesselsLayer.addLayer(marker);
        vesselsAdded++;
      }
    });

    console.log(`✅ ${vesselsAdded} embarcaciones agregadas al mapa`);

  } catch (error) {
    console.error('❌ Error cargando embarcaciones en mapa:', error);
    // En caso de error, agregar embarcaciones de ejemplo
    addDemoVessels();
  }
};

// Agregar embarcaciones de demostración en el área de Guatemala
const addDemoVessels = () => {
  console.log('📍 Agregando embarcaciones de demostración...');
  
  // Embarcaciones de ejemplo en aguas guatemaltecas
  const demoVessels = [
    { name: 'Embarcación de Pesca 1', lat: 13.85, lon: -91.85, type: 'Pesca artesanal' },
    { name: 'Embarcación de Pesca 2', lat: 15.65, lon: -88.45, type: 'Pesca comercial' },
    { name: 'Embarcación de Pesca 3', lat: 14.25, lon: -89.95, type: 'Pesca artesanal' },
    { name: 'Embarcación de Pesca 4', lat: 13.95, lon: -90.75, type: 'Pesca comercial' },
    { name: 'Embarcación de Pesca 5', lat: 15.85, lon: -88.75, type: 'Pesca artesanal' },
    { name: 'Embarcación de Pesca 6', lat: 14.15, lon: -91.25, type: 'Pesca comercial' },
    { name: 'Embarcación de Pesca 7', lat: 15.45, lon: -88.95, type: 'Pesca artesanal' },
    { name: 'Embarcación de Pesca 8', lat: 13.75, lon: -90.25, type: 'Pesca comercial' },
  ];

  demoVessels.forEach((vessel, index) => {
    const vesselIcon = L.divIcon({
      html: `<div style="background: #10b981; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'vessel-marker',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    const marker = L.marker([vessel.lat, vessel.lon], { icon: vesselIcon })
      .bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #064e3b; font-size: 14px;">
            🚢 ${vessel.name}
          </h3>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Tipo:</strong> ${vessel.type}
          </p>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>ID:</strong> GT-${1000 + index}
          </p>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Posición:</strong> ${vessel.lat.toFixed(4)}, ${vessel.lon.toFixed(4)}
          </p>
        </div>
      `);
    
    vesselsLayer.addLayer(marker);
  });

  console.log(`✅ ${demoVessels.length} embarcaciones de demostración agregadas`);
};

// Cargar zonas en el mapa
const loadZonesOnMap = async () => {
  try {
    const zones = await getProtectedZones();

    if (zonesLayer) {
      zonesLayer.clearLayers();
    }

    zones.forEach(zone => {
      if (zone.coordinates && zone.coordinates.length > 0) {
        const color = zone.restrictionLevel === 'high' ? '#dc2626' : 
                      zone.restrictionLevel === 'medium' ? '#f59e0b' : '#10b981';

        const polygon = L.polygon(zone.coordinates, {
          color: color,
          fillColor: color,
          fillOpacity: 0.2,
          weight: 2
        }).bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #064e3b; font-size: 14px;">
              🛡️ ${zone.name}
            </h3>
            <p style="margin: 4px 0; font-size: 12px;">
              <strong>Nivel:</strong> ${zone.restrictionLevel}
            </p>
            <p style="margin: 4px 0; font-size: 12px;">
              <strong>Área:</strong> ${zone.area} km²
            </p>
          </div>
        `);
        
        zonesLayer.addLayer(polygon);
      }
    });

  } catch (error) {
    console.error('Error cargando zonas en mapa:', error);
  }
};

// Cargar datos del Dashboard desde GFW
const loadDashboardData = async () => {
  try {
    loading.value = true;
    
    // Obtener KPIs del Dashboard
    const summary = await getDashboardSummary();
    totalEmbarcaciones.value = summary.activeVessels || 0;
    zonasProtegidas.value = summary.protectedZones || 0;
    alertasActivas.value = summary.activeAlerts || 0;
    deteccionesHoy.value = summary.detectionsToday || 0;

    // Obtener actividad reciente
    const activity = await getRecentActivity();
    recentActivities.value = activity.slice(0, 5).map(act => ({
      id: act.id,
      icon: act.icon || 'info',
      title: act.title,
      time: act.time,
      type: act.type || 'info'
    }));

    // Obtener alertas activas (solo las primeras 3)
    const alertsData = await getAlerts({ status: 'active', limit: 3 });
    
    if (alertsData && alertsData.length > 0) {
      alerts.value = alertsData.slice(0, 3).map(alert => ({
        id: alert.id,
        severity: alert.priority,
        title: alert.title,
        description: alert.description,
        time: alert.time
      }));
    } else {
      // Si no hay alertas, mostrar alertas de demostración
      alerts.value = [
        {
          id: 1,
          severity: 'info',
          title: 'Sistema de Monitoreo Activo',
          description: 'Todas las embarcaciones reportando normalmente',
          time: 'hace 5 minutos'
        },
        {
          id: 2,
          severity: 'low',
          title: 'Zona de Conservación Sur',
          description: '8 embarcaciones detectadas en zona regulada',
          time: 'hace 15 minutos'
        },
        {
          id: 3,
          severity: 'info',
          title: 'Actualización de Coordenadas',
          description: 'GPS actualizado para todas las zonas protegidas',
          time: 'hace 1 hora'
        }
      ];
    }

  } catch (error) {
    console.error('Error cargando datos del dashboard:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Cargar datos del dashboard
  await loadDashboardData();
  
  // Inicializar mapa
  setTimeout(() => {
    initMap();
    loadVesselsOnMap();
    loadZonesOnMap();
  }, 500);
  
  // Actualizar datos cada 30 segundos
  setInterval(loadDashboardData, 30000);
  
  // Actualizar mapa cada 60 segundos
  setInterval(() => {
    loadVesselsOnMap();
  }, 60000);
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

/* Mobile: reducir padding */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #064e3b;
  margin: 0;
}

.date {
  color: #6b7280;
  margin-top: 0.5rem;
  text-transform: capitalize;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.stat-card.green .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.stat-card.blue .stat-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.stat-card.red .stat-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.stat-card.orange .stat-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.stat-content h3 {
  font-size: 2rem;
  margin: 0;
  color: #1f2937;
}

.stat-content p {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #064e3b;
  font-size: 1.25rem;
  margin: 0 0 1.5rem 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #9ca3af;
  text-align: center;
}

.empty-state .material-symbols-rounded {
  font-size: 3rem;
  opacity: 0.3;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.95rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f9fafb;
  transition: background 0.2s ease;
}

.activity-item:hover {
  background: #f3f4f6;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon.info {
  background: #dbeafe;
  color: #2563eb;
}

.activity-icon.warning {
  background: #fef3c7;
  color: #d97706;
}

.activity-icon.success {
  background: #d1fae5;
  color: #059669;
}

.activity-info {
  flex: 1;
}

.activity-title {
  margin: 0;
  font-weight: 500;
  color: #1f2937;
}

.activity-time {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #9ca3af;
}

.map-preview {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-preview h2 {
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.map-wrapper {
  width: 100%;
  height: 280px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  background: #f3f4f6;
}

#dashboard-map {
  width: 100%;
  height: 100%;
}

.map-stats {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.map-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #064e3b;
}

.map-stats .stat-item .material-symbols-rounded {
  font-size: 1.2rem;
  color: #10b981;
}

.alerts-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.alerts-section h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #064e3b;
  font-size: 1.25rem;
  margin: 0 0 1.5rem 0;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-item.high {
  background: #fef2f2;
  border-color: #ef4444;
}

.alert-item.medium {
  background: #fffbeb;
  border-color: #f59e0b;
}

.alert-item.low {
  background: #f0f9ff;
  border-color: #3b82f6;
}

.alert-item > .material-symbols-rounded {
  font-size: 1.5rem;
}

.alert-item.high > .material-symbols-rounded {
  color: #ef4444;
}

.alert-item.medium > .material-symbols-rounded {
  color: #f59e0b;
}

.alert-item.low > .material-symbols-rounded {
  color: #3b82f6;
}

.alert-content {
  flex: 1;
}

.alert-title {
  margin: 0;
  font-weight: 600;
  color: #1f2937;
}

.alert-description {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.alert-time {
  color: #9ca3af;
  font-size: 0.85rem;
}

@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
  }
  
  .stat-content h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .dashboard-header h1 {
    font-size: 1.5rem;
  }
  
  .card {
    padding: 1rem;
  }
  
  .card h2 {
    font-size: 1.1rem;
  }
}
</style>