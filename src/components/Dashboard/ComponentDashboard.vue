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
        <div class="map-placeholder">
          <span class="material-symbols-rounded">public</span>
          <p>Vista del mapa de embarcaciones</p>
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
import { ref, onMounted } from 'vue';
import { getDashboardSummary, getRecentActivity, getAlerts } from '@/backend/services/api.js';

const currentDate = ref('');
const totalEmbarcaciones = ref(0);
const zonasProtegidas = ref(0);
const alertasActivas = ref(0);
const deteccionesHoy = ref(0);
const loading = ref(true);

const recentActivities = ref([]);
const alerts = ref([]);

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
    alerts.value = alertsData.slice(0, 3).map(alert => ({
      id: alert.id,
      severity: alert.priority,
      title: alert.title,
      description: alert.description,
      time: alert.time
    }));

  } catch (error) {
    console.error('Error cargando datos del dashboard:', error);
    // Mantener valores por defecto en caso de error
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Cargar datos de GFW
  loadDashboardData();
  
  // Actualizar cada 30 segundos
  setInterval(loadDashboardData, 30000);
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
  min-height: 300px;
}

.map-placeholder {
  background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
  border-radius: 8px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
}

.map-placeholder p {
  font-size: 1rem;
  margin-top: 1rem;
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