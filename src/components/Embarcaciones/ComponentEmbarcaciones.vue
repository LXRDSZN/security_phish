<template>
  <div class="embarcaciones-container">
    <div class="header">
      <div class="header-content">
        <h1>
          <span class="material-symbols-rounded">directions_boat</span>
          Embarcaciones Monitoreadas
        </h1>
        <p class="subtitle">Sistema de monitoreo en tiempo real</p>
      </div>
      <div class="stats-mini">
        <div class="mini-stat">
          <span class="material-symbols-rounded">inventory</span>
          <div>
            <p class="mini-value">{{ totalResults }}</p>
            <p class="mini-label">Total</p>
          </div>
        </div>
        <div class="mini-stat">
          <span class="material-symbols-rounded">public</span>
          <div>
            <p class="mini-value">{{ filteredBoats.length }}</p>
            <p class="mini-label">Filtradas</p>
          </div>
        </div>
      </div>
    </div>

    <div class="filters-card">
      <div class="search-box">
        <span class="material-symbols-rounded">search</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar por nombre, matrícula, MMSI, IMO..."
          @input="onSearchInput"
        >
        <span v-if="loading" class="loading-spinner material-symbols-rounded">progress_activity</span>
      </div>
      <div class="filters-row">
        <select v-model="filterStatus" class="filter-select">
          <option value="all">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="maintenance">Mantenimiento</option>
        </select>
        <div class="filter-info">
          <span class="material-symbols-rounded">info</span>
          Mostrando {{ filteredBoats.length }} de {{ totalResults }} resultados
        </div>
      </div>
    </div>

    <!-- Estado Inicial -->
    <div v-if="!searchQuery && boats.length === 0 && !loading" class="empty-state initial">
      <div class="empty-icon">
        <span class="material-symbols-rounded">search</span>
      </div>
      <h3>Busca embarcaciones para comenzar</h3>
      <p>Ingresa un nombre, matrícula, MMSI o IMO en el buscador</p>
      <div class="search-tips">
        <p class="tip-title">💡 Ejemplos de búsqueda:</p>
        <div class="tips-grid">
          <div class="tip-item">
            <span class="material-symbols-rounded">directions_boat</span>
            <span>"Pacific Explorer"</span>
          </div>
          <div class="tip-item">
            <span class="material-symbols-rounded">tag</span>
            <span>MMSI: 538005989</span>
          </div>
          <div class="tip-item">
            <span class="material-symbols-rounded">badge</span>
            <span>IMO: 9234567</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Cargando -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner-big">
        <span class="material-symbols-rounded">progress_activity</span>
      </div>
      <p>Buscando embarcaciones...</p>
    </div>

    <!-- Sin Resultados por Filtro -->
    <div v-if="!loading && searchQuery && filteredBoats.length === 0 && boats.length > 0" class="empty-state no-filter">
      <div class="empty-icon">
        <span class="material-symbols-rounded">filter_list_off</span>
      </div>
      <h3>No hay embarcaciones con el estado "{{ getStatusLabel(filterStatus) }}"</h3>
      <p>Intenta cambiar el filtro o realizar una nueva búsqueda</p>
      <button class="btn-reset" @click="filterStatus = 'all'">
        <span class="material-symbols-rounded">refresh</span>
        Mostrar todos los estados
      </button>
    </div>

    <!-- Sin Resultados de Búsqueda -->
    <div v-if="!loading && searchQuery && boats.length === 0" class="empty-state no-results">
      <div class="empty-icon">
        <span class="material-symbols-rounded">search_off</span>
      </div>
      <h3>No se encontraron embarcaciones</h3>
      <p>No hay resultados para "{{ searchQuery }}"</p>
      <button class="btn-reset" @click="searchQuery = ''">
        <span class="material-symbols-rounded">clear</span>
        Limpiar búsqueda
      </button>
    </div>

    <!-- Grid de Embarcaciones -->
    <div v-if="!loading && filteredBoats.length > 0" class="embarcaciones-grid">
      <div v-for="boat in filteredBoats" :key="boat.id" class="boat-card">
        <div class="boat-header-card">
          <div class="boat-icon" :class="boat.status">
            <span class="material-symbols-rounded">directions_boat</span>
          </div>
          <div class="boat-title">
            <h3>{{ boat.name }}</h3>
            <p class="boat-type">{{ boat.type }}</p>
          </div>
          <span class="boat-badge" :class="boat.status">
            <span class="badge-dot"></span>
            {{ getStatusLabel(boat.status) }}
          </span>
        </div>
        
        <div class="boat-details-grid">
          <div class="detail-item">
            <span class="material-symbols-rounded">badge</span>
            <div>
              <p class="detail-label">Matrícula</p>
              <p class="detail-value">{{ boat.registration }}</p>
            </div>
          </div>
          <div class="detail-item">
            <span class="material-symbols-rounded">straighten</span>
            <div>
              <p class="detail-label">Eslora</p>
              <p class="detail-value">{{ boat.length }}m</p>
            </div>
          </div>
          <div class="detail-item">
            <span class="material-symbols-rounded">flag</span>
            <div>
              <p class="detail-label">Bandera</p>
              <p class="detail-value">{{ boat.flag || 'N/A' }}</p>
            </div>
          </div>
          <div class="detail-item">
            <span class="material-symbols-rounded">schedule</span>
            <div>
              <p class="detail-label">Último reporte</p>
              <p class="detail-value">{{ boat.lastReport }}</p>
            </div>
          </div>
        </div>

        <div class="boat-actions">
          <button class="btn-action primary" @click="viewDetails(boat)">
            <span class="material-symbols-rounded">visibility</span>
            Ver Detalles
          </button>
          <button class="btn-action secondary" @click="trackVessel(boat)">
            <span class="material-symbols-rounded">location_searching</span>
            Rastrear
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div v-if="selectedVessel" class="modal-overlay" @click="selectedVessel = null">
      <div class="modal-details" @click.stop>
        <div class="modal-header">
          <h2>
            <span class="material-symbols-rounded">directions_boat</span>
            {{ selectedVessel.name }}
          </h2>
          <button @click="selectedVessel = null" class="btn-close">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h3>
              <span class="material-symbols-rounded">info</span>
              Información General
            </h3>
            <div class="details-list">
              <div class="detail-row-modal">
                <span class="label">Nombre:</span>
                <span class="value">{{ selectedVessel.name }}</span>
              </div>
              <div class="detail-row-modal">
                <span class="label">Tipo:</span>
                <span class="value">{{ selectedVessel.type }}</span>
              </div>
              <div class="detail-row-modal">
                <span class="label">Matrícula:</span>
                <span class="value">{{ selectedVessel.registration }}</span>
              </div>
              <div class="detail-row-modal">
                <span class="label">Eslora:</span>
                <span class="value">{{ selectedVessel.length }}m</span>
              </div>
              <div class="detail-row-modal">
                <span class="label">Bandera:</span>
                <span class="value">{{ selectedVessel.flag || 'N/A' }}</span>
              </div>
              <div class="detail-row-modal">
                <span class="label">Estado:</span>
                <span class="value">
                  <span class="boat-badge" :class="selectedVessel.status">
                    {{ getStatusLabel(selectedVessel.status) }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-modal secondary" @click="selectedVessel = null">
            <span class="material-symbols-rounded">close</span>
            Cerrar
          </button>
          <button class="btn-modal primary" @click="trackVessel(selectedVessel)">
            <span class="material-symbols-rounded">location_searching</span>
            Rastrear en Mapa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { searchVessels } from '@/backend/services/api.js';

const router = useRouter();
const searchQuery = ref('');
const filterStatus = ref('all');
const loading = ref(false);
const boats = ref([]);
const totalResults = ref(0);
const selectedVessel = ref(null);

// Buscar embarcaciones en GFW
const performSearch = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    boats.value = [];
    totalResults.value = 0;
    return;
  }

  try {
    loading.value = true;
    const result = await searchVessels(searchQuery.value, 50);
    
    const query = searchQuery.value.toLowerCase().trim();
    
    // Normalizar datos de GFW al formato del componente
    boats.value = result.vessels
      .map(vessel => ({
        id: vessel.id,
        name: vessel.name || 'Sin nombre',
        registration: vessel.mmsi || vessel.imo || vessel.callsign || 'N/A',
        type: vessel.type || 'Desconocido',
        length: vessel.length || 0,
        flag: vessel.flag || 'N/A',
        status: 'active', // Por defecto activo si está en GFW
        lastReport: 'Tiempo real',
        mmsi: vessel.mmsi,
        imo: vessel.imo
      }))
      .filter(vessel => {
        // Filtro más estricto: debe coincidir con nombre, mmsi o imo principalmente
        const name = (vessel.name || '').toLowerCase();
        const mmsi = (vessel.mmsi || '').toString().toLowerCase();
        const imo = (vessel.imo || '').toString().toLowerCase();
        const registration = (vessel.registration || '').toLowerCase();
        
        return name.includes(query) || 
               mmsi.includes(query) || 
               imo.includes(query) ||
               (query.length > 5 && registration.includes(query));
      });
    
    totalResults.value = boats.value.length;
  } catch (error) {
    console.error('Error buscando embarcaciones:', error);
    boats.value = [];
    totalResults.value = 0;
  } finally {
    loading.value = false;
  }
};

// Handler para el input de búsqueda
const onSearchInput = () => {
  // La búsqueda se hace con el watch debounce
};

// Watch para búsqueda en tiempo real (con debounce)
let searchTimeout;
watch(searchQuery, (newValue) => {
  clearTimeout(searchTimeout);
  if (newValue && newValue.length >= 2) {
    searchTimeout = setTimeout(() => {
      performSearch();
    }, 500);
  } else {
    boats.value = [];
    totalResults.value = 0;
  }
});

const filteredBoats = computed(() => {
  let filtered = boats.value;
  
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(boat => boat.status === filterStatus.value);
  }
  
  return filtered;
});

const getStatusLabel = (status) => {
  const labels = {
    active: 'Activo',
    inactive: 'Inactivo',
    maintenance: 'Mantenimiento',
    all: 'Todos'
  };
  return labels[status] || status;
};

const viewDetails = (boat) => {
  selectedVessel.value = boat;
};

const trackVessel = (boat) => {
  selectedVessel.value = null;
  // Redirigir al Radar con los datos de la embarcación
  router.push({
    name: 'Radar',
    query: { 
      vesselId: boat.id, 
      vesselName: boat.name,
      mmsi: boat.mmsi || boat.registration
    }
  });
};
</script>

<style scoped>
.embarcaciones-container {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
}

/* ===== HEADER ===== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  color: #064e3b;
  margin: 0 0 0.5rem 0;
}

.header-content h1 .material-symbols-rounded {
  font-size: 2.5rem;
  color: #10b981;
}

.subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 0.95rem;
}

.stats-mini {
  display: flex;
  gap: 1.5rem;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.mini-stat .material-symbols-rounded {
  font-size: 2rem;
  color: #10b981;
}

.mini-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #064e3b;
  margin: 0;
  line-height: 1;
}

.mini-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== FILTERS CARD ===== */
.filters-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.search-box .material-symbols-rounded {
  position: absolute;
  left: 1rem;
  color: #6b7280;
  font-size: 1.5rem;
}

.search-box input {
  width: 100%;
  padding: 1rem 1rem 1rem 3.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.loading-spinner {
  position: absolute;
  right: 1rem;
  color: #10b981;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.filters-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #10b981;
}

.filter-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
  margin-left: auto;
}

.filter-info .material-symbols-rounded {
  font-size: 1.25rem;
}

/* ===== EMPTY STATES ===== */
.empty-state {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.empty-icon .material-symbols-rounded {
  font-size: 4rem;
  color: white;
}

.empty-state h3 {
  font-size: 1.75rem;
  color: #064e3b;
  margin: 0 0 0.75rem 0;
}

.empty-state p {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
}

.search-tips {
  background: #f0fdf4;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.tip-title {
  font-size: 1rem;
  font-weight: 600;
  color: #064e3b;
  margin: 0 0 1rem 0;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #374151;
}

.tip-item .material-symbols-rounded {
  color: #10b981;
  font-size: 1.25rem;
}

.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* ===== LOADING STATE ===== */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner-big {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.loading-spinner-big .material-symbols-rounded {
  font-size: 3rem;
  color: white;
  animation: spin 1s linear infinite;
}

.loading-state p {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0;
}

/* ===== EMBARCACIONES GRID ===== */
.embarcaciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  animation: fadeIn 0.5s ease;
}

.boat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.boat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.boat-header-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.boat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.boat-icon.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.boat-icon.inactive {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.boat-icon.maintenance {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.boat-icon .material-symbols-rounded {
  font-size: 2rem;
  color: white;
}

.boat-title {
  flex: 1;
  min-width: 0;
}

.boat-title h3 {
  font-size: 1.1rem;
  color: #064e3b;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.boat-type {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.boat-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.boat-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.boat-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.boat-badge.maintenance {
  background: #fef3c7;
  color: #92400e;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.boat-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.detail-item .material-symbols-rounded {
  font-size: 1.5rem;
  color: #10b981;
  flex-shrink: 0;
}

.detail-label {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.95rem;
  color: #374151;
  font-weight: 600;
  margin: 0;
}

.boat-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action.primary {
  background: #10b981;
  color: white;
}

.btn-action.primary:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-action.secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-action.secondary:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.3s ease;
}

.modal-details {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f3f4f6;
}

.modal-header h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: #064e3b;
  margin: 0;
}

.modal-header h2 .material-symbols-rounded {
  font-size: 2rem;
  color: #10b981;
}

.btn-close {
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: #e5e7eb;
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.detail-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #064e3b;
  margin: 0 0 1rem 0;
}

.detail-section h3 .material-symbols-rounded {
  color: #10b981;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
}

.detail-row-modal .label {
  font-weight: 600;
  color: #6b7280;
}

.detail-row-modal .value {
  color: #374151;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 2px solid #f3f4f6;
}

.btn-modal {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-modal.primary {
  background: #10b981;
  color: white;
}

.btn-modal.primary:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-modal.secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-modal.secondary:hover {
  background: #e5e7eb;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .embarcaciones-container {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .stats-mini {
    width: 100%;
    justify-content: space-between;
  }

  .embarcaciones-grid {
    grid-template-columns: 1fr;
  }

  .boat-details-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>
