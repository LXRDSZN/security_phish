<template>
  <div class="embarcaciones-container">
    <div class="header">
      <h1>Gestión de Embarcaciones</h1>
      <button class="btn-add" @click="showModal = true">
        <span class="material-symbols-rounded">add</span>
        Nueva Embarcación
      </button>
    </div>

    <div class="filters">
      <div class="search-box">
        <span class="material-symbols-rounded">search</span>
        <input type="text" v-model="searchQuery" placeholder="Buscar embarcación...">
      </div>
      <select v-model="filterStatus" class="filter-select">
        <option value="all">Todos los estados</option>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
        <option value="maintenance">Mantenimiento</option>
      </select>
    </div>

    <div class="embarcaciones-grid">
      <div v-for="boat in filteredBoats" :key="boat.id" class="boat-card">
        <div class="boat-image">
          <span class="material-symbols-rounded">directions_boat</span>
          <div class="status-indicator" :class="boat.status"></div>
        </div>
        
        <div class="boat-content">
          <div class="boat-header">
            <h3>{{ boat.name }}</h3>
            <span class="boat-badge" :class="boat.status">{{ getStatusLabel(boat.status) }}</span>
          </div>
          
          <div class="boat-details">
            <div class="detail-row">
              <span class="material-symbols-rounded">badge</span>
              <span>Matrícula: {{ boat.registration }}</span>
            </div>
            <div class="detail-row">
              <span class="material-symbols-rounded">person</span>
              <span>Capitán: {{ boat.captain }}</span>
            </div>
            <div class="detail-row">
              <span class="material-symbols-rounded">category</span>
              <span>Tipo: {{ boat.type }}</span>
            </div>
            <div class="detail-row">
              <span class="material-symbols-rounded">straighten</span>
              <span>Eslora: {{ boat.length }}m</span>
            </div>
          </div>

          <div class="boat-stats">
            <div class="stat">
              <span class="material-symbols-rounded">location_on</span>
              <div>
                <p class="stat-label">Última posición</p>
                <p class="stat-value">{{ boat.lastLocation }}</p>
              </div>
            </div>
            <div class="stat">
              <span class="material-symbols-rounded">schedule</span>
              <div>
                <p class="stat-label">Último reporte</p>
                <p class="stat-value">{{ boat.lastReport }}</p>
              </div>
            </div>
          </div>

          <div class="boat-actions">
            <button class="btn-action" @click="viewDetails(boat.id)">
              <span class="material-symbols-rounded">visibility</span>
              Ver
            </button>
            <button class="btn-action">
              <span class="material-symbols-rounded">edit</span>
              Editar
            </button>
            <button class="btn-action">
              <span class="material-symbols-rounded">location_searching</span>
              Rastrear
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Registrar Nueva Embarcación</h2>
          <button @click="showModal = false" class="btn-close">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>
        <form class="modal-form">
          <div class="form-group">
            <label>Nombre de la Embarcación</label>
            <input type="text" placeholder="Ej: Pescador 1">
          </div>
          <div class="form-group">
            <label>Matrícula</label>
            <input type="text" placeholder="Ej: PE-001">
          </div>
          <div class="form-group">
            <label>Capitán</label>
            <input type="text" placeholder="Nombre del capitán">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Tipo</label>
              <select>
                <option>Artesanal</option>
                <option>Industrial</option>
                <option>Deportiva</option>
              </select>
            </div>
            <div class="form-group">
              <label>Eslora (m)</label>
              <input type="number" placeholder="10">
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showModal = false">Cancelar</button>
            <button type="submit" class="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const showModal = ref(false);
const searchQuery = ref('');
const filterStatus = ref('all');

const boats = ref([
  {
    id: 1,
    name: 'Pescador del Mar',
    registration: 'PE-001',
    captain: 'Juan Pérez',
    type: 'Artesanal',
    length: 12,
    status: 'active',
    lastLocation: 'Zona A - Sector 3',
    lastReport: 'Hace 15 min'
  },
  {
    id: 2,
    name: 'Océano Azul',
    registration: 'PE-003',
    captain: 'María López',
    type: 'Industrial',
    length: 25,
    status: 'active',
    lastLocation: 'Zona B - Sector 1',
    lastReport: 'Hace 30 min'
  },
  {
    id: 3,
    name: 'Viento Norte',
    registration: 'PE-007',
    captain: 'Carlos Ruiz',
    type: 'Artesanal',
    length: 10,
    status: 'maintenance',
    lastLocation: 'Puerto Principal',
    lastReport: 'Hace 2 días'
  },
  {
    id: 4,
    name: 'Estrella Marina',
    registration: 'PE-012',
    captain: 'Ana Torres',
    type: 'Deportiva',
    length: 8,
    status: 'inactive',
    lastLocation: 'Marina Sur',
    lastReport: 'Hace 5 horas'
  }
]);

const filteredBoats = computed(() => {
  let filtered = boats.value;
  
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(boat => boat.status === filterStatus.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(boat => 
      boat.name.toLowerCase().includes(query) ||
      boat.registration.toLowerCase().includes(query) ||
      boat.captain.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

const getStatusLabel = (status) => {
  const labels = {
    active: 'Activo',
    inactive: 'Inactivo',
    maintenance: 'Mantenimiento'
  };
  return labels[status] || status;
};

const viewDetails = (id) => {
  console.log('Ver detalles de embarcación:', id);
};
</script>

<style scoped>
.embarcaciones-container {
  padding: 2rem;
  margin-left: var(--sidebar-width, 72px);
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
  transition: margin-left 0.3s ease;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: #064e3b;
  margin: 0;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-box .material-symbols-rounded {
  color: #6b7280;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  background: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-size: 1rem;
  cursor: pointer;
  outline: none;
}

.embarcaciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.boat-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.boat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.boat-image {
  position: relative;
  height: 120px;
  background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.boat-image .material-symbols-rounded {
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.8);
}

.status-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.status-indicator.active {
  background: #10b981;
  animation: pulse-indicator 2s infinite;
}

.status-indicator.inactive {
  background: #6b7280;
}

.status-indicator.maintenance {
  background: #f59e0b;
}

@keyframes pulse-indicator {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.boat-content {
  padding: 1.5rem;
}

.boat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.boat-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.boat-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.boat-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.boat-badge.inactive {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.boat-badge.maintenance {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.boat-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.detail-row .material-symbols-rounded {
  font-size: 1.2rem;
  color: #064e3b;
}

.boat-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  gap: 0.5rem;
}

.stat .material-symbols-rounded {
  color: #064e3b;
  font-size: 1.5rem;
}

.stat-label {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.stat-value {
  margin: 0.25rem 0 0;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
}

.boat-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
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

.btn-action:hover {
  background: rgba(6, 78, 59, 0.15);
}

.btn-action .material-symbols-rounded {
  font-size: 1.2rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #064e3b;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #6b7280;
  transition: color 0.2s ease;
}

.btn-close:hover {
  color: #1f2937;
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1f2937;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #10b981;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-save {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

@media (max-width: 768px) {
  .embarcaciones-container {
    padding: 1rem;
    margin-left: 72px;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .embarcaciones-grid {
    grid-template-columns: 1fr;
  }
}
</style>
