<template>
  <div class="alertas-container">
    <div class="header">
      <h1>Sistema de Alertas</h1>
      <div class="header-actions">
        <button class="btn-filter" :class="{ active: filter === 'all' }" @click="filter = 'all'">
          Todas
        </button>
        <button class="btn-filter" :class="{ active: filter === 'high' }" @click="filter = 'high'">
          Alta Prioridad
        </button>
        <button class="btn-filter" :class="{ active: filter === 'medium' }" @click="filter = 'medium'">
          Media
        </button>
        <button class="btn-filter" :class="{ active: filter === 'low' }" @click="filter = 'low'">
          Baja
        </button>
      </div>
    </div>

    <div class="alert-stats">
      <div class="stat-box high">
        <span class="material-symbols-rounded">error</span>
        <div>
          <h3>{{ alertCounts.high }}</h3>
          <p>Alertas Críticas</p>
        </div>
      </div>
      <div class="stat-box medium">
        <span class="material-symbols-rounded">warning</span>
        <div>
          <h3>{{ alertCounts.medium }}</h3>
          <p>Alertas Medias</p>
        </div>
      </div>
      <div class="stat-box low">
        <span class="material-symbols-rounded">info</span>
        <div>
          <h3>{{ alertCounts.low }}</h3>
          <p>Alertas Informativas</p>
        </div>
      </div>
      <div class="stat-box resolved">
        <span class="material-symbols-rounded">check_circle</span>
        <div>
          <h3>{{ alertCounts.resolved }}</h3>
          <p>Resueltas Hoy</p>
        </div>
      </div>
    </div>

    <div class="alerts-content">
      <div class="alerts-list">
        <div v-for="alert in filteredAlerts" :key="alert.id" class="alert-card" :class="alert.priority">
          <div class="alert-icon">
            <span class="material-symbols-rounded">{{ alert.icon }}</span>
          </div>
          
          <div class="alert-content">
            <div class="alert-header">
              <div>
                <h3>{{ alert.title }}</h3>
                <p class="alert-meta">
                  <span class="material-symbols-rounded">schedule</span>
                  {{ alert.time }} | 
                  <span class="material-symbols-rounded">location_on</span>
                  {{ alert.location }}
                </p>
              </div>
              <span class="alert-badge" :class="alert.priority">
                {{ getPriorityLabel(alert.priority) }}
              </span>
            </div>
            
            <p class="alert-description">{{ alert.description }}</p>
            
            <div class="alert-details">
              <div class="detail-tag">
                <span class="material-symbols-rounded">directions_boat</span>
                {{ alert.boat }}
              </div>
              <div class="detail-tag">
                <span class="material-symbols-rounded">person</span>
                {{ alert.reporter }}
              </div>
            </div>

            <div class="alert-actions">
              <button class="btn-action primary">
                <span class="material-symbols-rounded">visibility</span>
                Ver Detalles
              </button>
              <button class="btn-action">
                <span class="material-symbols-rounded">location_searching</span>
                Ubicar
              </button>
              <button class="btn-action success" @click="handleResolveAlert(alert.id)">
                <span class="material-symbols-rounded">check</span>
                Resolver
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="alert-map">
        <h2>
          <span class="material-symbols-rounded">map</span>
          Mapa de Alertas
        </h2>
        <div class="map-view">
          <span class="material-symbols-rounded">public</span>
          <p>Ubicación de alertas activas</p>
          <div class="map-legend">
            <div class="legend-item high">
              <span></span>
              Alta Prioridad
            </div>
            <div class="legend-item medium">
              <span></span>
              Media Prioridad
            </div>
            <div class="legend-item low">
              <span></span>
              Baja Prioridad
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getAlerts, resolveAlert } from '@/backend/services/api.js';

const filter = ref('all');
const alerts = ref([]);
const loading = ref(false);

// Cargar alertas desde GFW
const loadAlerts = async () => {
  try {
    loading.value = true;
    const filters = { status: 'active' };
    
    if (filter.value !== 'all') {
      filters.priority = filter.value;
    }
    
    const alertsData = await getAlerts(filters);
    alerts.value = alertsData.map(alert => ({
      id: alert.id,
      priority: alert.priority,
      icon: alert.icon || 'warning',
      title: alert.title,
      description: alert.description,
      time: alert.time,
      location: alert.location,
      boat: alert.boat,
      reporter: alert.reporter,
      status: alert.status
    }));
  } catch (error) {
    console.error('Error cargando alertas:', error);
    alerts.value = [];
  } finally {
    loading.value = false;
  }
};

// Resolver una alerta
const handleResolveAlert = async (alertId) => {
  try {
    await resolveAlert(alertId, 'Usuario del Sistema');
    // Recargar alertas después de resolver
    await loadAlerts();
    alert('Alerta resuelta exitosamente');
  } catch (error) {
    console.error('Error resolviendo alerta:', error);
    alert('Error al resolver la alerta');
  }
};

const alertCounts = computed(() => ({
  high: alerts.value.filter(a => a.priority === 'high').length,
  medium: alerts.value.filter(a => a.priority === 'medium').length,
  low: alerts.value.filter(a => a.priority === 'low').length,
  resolved: 0 // Este valor vendría de una consulta separada
}));

const filteredAlerts = computed(() => {
  if (filter.value === 'all') return alerts.value;
  return alerts.value.filter(alert => alert.priority === filter.value);
});

const getPriorityLabel = (priority) => {
  const labels = {
    high: 'Alta Prioridad',
    medium: 'Media Prioridad',
    low: 'Baja Prioridad'
  };
  return labels[priority] || priority;
};

// Cargar alertas al montar el componente
onMounted(() => {
  loadAlerts();
  
  // Actualizar alertas cada 60 segundos
  setInterval(loadAlerts, 60000);
});

// Recargar cuando cambia el filtro
watch(() => filter.value, () => {
  loadAlerts();
});
</script>

<style scoped>
.alertas-container {
  padding: 2rem;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: #064e3b;
  margin: 0 0 1rem 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-filter {
  padding: 0.5rem 1rem;
  background: white;
  color: #6b7280;
  border: 2px solid transparent;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-filter:hover {
  background: #f3f4f6;
}

.btn-filter.active {
  background: #064e3b;
  color: white;
  border-color: #064e3b;
}

.alert-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (max-width: 1400px) {
  .alert-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid;
}

.stat-box .material-symbols-rounded {
  font-size: 2.5rem;
}

.stat-box h3 {
  margin: 0;
  font-size: 2rem;
  color: #1f2937;
}

.stat-box p {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.stat-box.high {
  border-left-color: #ef4444;
}

.stat-box.high .material-symbols-rounded {
  color: #ef4444;
}

.stat-box.medium {
  border-left-color: #f59e0b;
}

.stat-box.medium .material-symbols-rounded {
  color: #f59e0b;
}

.stat-box.low {
  border-left-color: #3b82f6;
}

.stat-box.low .material-symbols-rounded {
  color: #3b82f6;
}

.stat-box.resolved {
  border-left-color: #10b981;
}

.stat-box.resolved .material-symbols-rounded {
  color: #10b981;
}

.alerts-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-card {
  display: flex;
  gap: 1rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.alert-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.alert-card.high {
  border-left-color: #ef4444;
}

.alert-card.medium {
  border-left-color: #f59e0b;
}

.alert-card.low {
  border-left-color: #3b82f6;
}

.alert-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-card.high .alert-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.alert-card.medium .alert-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.alert-card.low .alert-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.alert-icon .material-symbols-rounded {
  font-size: 1.75rem;
}

.alert-content {
  flex: 1;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.alert-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1f2937;
}

.alert-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.alert-meta .material-symbols-rounded {
  font-size: 1rem;
}

.alert-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.alert-badge.high {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.alert-badge.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.alert-badge.low {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.alert-description {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.5;
}

.alert-details {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #1f2937;
}

.detail-tag .material-symbols-rounded {
  font-size: 1rem;
  color: #064e3b;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: rgba(6, 78, 59, 0.1);
  color: #064e3b;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action:hover {
  background: rgba(6, 78, 59, 0.15);
}

.btn-action.primary {
  background: #064e3b;
  color: white;
}

.btn-action.primary:hover {
  background: #022c22;
}

.btn-action.success {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.btn-action.success:hover {
  background: rgba(16, 185, 129, 0.2);
}

.btn-action .material-symbols-rounded {
  font-size: 1.1rem;
}

.alert-map {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.alert-map h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #064e3b;
}

.map-view {
  background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
  border-radius: 8px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
}

.map-view p {
  font-size: 1rem;
  margin-top: 1rem;
}

.map-legend {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.75rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #1f2937;
}

.legend-item span {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-item.high span {
  background: #ef4444;
}

.legend-item.medium span {
  background: #f59e0b;
}

.legend-item.low span {
  background: #3b82f6;
}

@media (max-width: 1200px) {
  .alerts-content {
    grid-template-columns: 1fr;
  }
  
  .alert-map {
    position: static;
  }
}

@media (max-width: 768px) {
  .alertas-container {
    padding: 1rem;
  }
  
  .alert-stats {
    grid-template-columns: 1fr;
  }
  
  .alert-actions {
    flex-direction: column;
  }
}
</style>
