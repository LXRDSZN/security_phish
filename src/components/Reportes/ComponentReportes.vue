<template>
  <div class="reportes-container">
    <div class="header">
      <h1>Generación de Reportes</h1>
      <button class="btn-generate" @click="showModal = true">
        <span class="material-symbols-rounded">add_circle</span>
        Nuevo Reporte
      </button>
    </div>

    <div class="report-types">
      <div class="type-card" v-for="type in reportTypes" :key="type.id">
        <div class="type-icon" :class="type.color">
          <span class="material-symbols-rounded">{{ type.icon }}</span>
        </div>
        <h3>{{ type.title }}</h3>
        <p>{{ type.description }}</p>
        <button class="btn-select" @click="selectType(type.id)">
          Generar
        </button>
      </div>
    </div>

    <div class="reports-history">
      <h2>
        <span class="material-symbols-rounded">history</span>
        Reportes Generados
      </h2>

      <div class="history-filters">
        <select v-model="filterType" class="filter-select">
          <option value="all">Todos los tipos</option>
          <option value="catch">Captura</option>
          <option value="activity">Actividad</option>
          <option value="compliance">Cumplimiento</option>
          <option value="incident">Incidentes</option>
        </select>
        <select v-model="filterPeriod" class="filter-select">
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="year">Este año</option>
          <option value="all">Todo</option>
        </select>
      </div>

      <div class="reports-list">
        <div v-for="report in filteredReports" :key="report.id" class="report-item">
          <div class="report-icon" :class="report.type">
            <span class="material-symbols-rounded">{{ report.icon }}</span>
          </div>
          
          <div class="report-info">
            <h3>{{ report.title }}</h3>
            <div class="report-meta">
              <span>
                <span class="material-symbols-rounded">person</span>
                {{ report.author }}
              </span>
              <span>
                <span class="material-symbols-rounded">calendar_today</span>
                {{ report.date }}
              </span>
              <span>
                <span class="material-symbols-rounded">schedule</span>
                {{ report.time }}
              </span>
            </div>
          </div>

          <div class="report-details">
            <span class="report-size">{{ report.size }}</span>
            <span class="report-format">{{ report.format }}</span>
          </div>

          <div class="report-actions">
            <button class="action-btn">
              <span class="material-symbols-rounded">visibility</span>
            </button>
            <button class="action-btn">
              <span class="material-symbols-rounded">download</span>
            </button>
            <button class="action-btn">
              <span class="material-symbols-rounded">share</span>
            </button>
            <button class="action-btn danger">
              <span class="material-symbols-rounded">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Generar Nuevo Reporte</h2>
          <button @click="showModal = false" class="btn-close">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>
        
        <form class="modal-form" @submit.prevent="generateReport">
          <div class="form-group">
            <label>Tipo de Reporte</label>
            <select required>
              <option value="">Seleccionar tipo...</option>
              <option value="catch">Reporte de Captura</option>
              <option value="activity">Reporte de Actividad</option>
              <option value="compliance">Reporte de Cumplimiento</option>
              <option value="incident">Reporte de Incidentes</option>
            </select>
          </div>

          <div class="form-group">
            <label>Título del Reporte</label>
            <input type="text" placeholder="Ej: Reporte Mensual de Capturas" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Fecha Inicio</label>
              <input type="date" required>
            </div>
            <div class="form-group">
              <label>Fecha Fin</label>
              <input type="date" required>
            </div>
          </div>

          <div class="form-group">
            <label>Embarcaciones</label>
            <select multiple>
              <option>PE-001 - Pescador del Mar</option>
              <option>PE-003 - Océano Azul</option>
              <option>PE-007 - Viento Norte</option>
              <option>PE-012 - Estrella Marina</option>
            </select>
          </div>

          <div class="form-group">
            <label>Formato de Exportación</label>
            <div class="format-options">
              <label class="format-option">
                <input type="radio" name="format" value="pdf" checked>
                <span>PDF</span>
              </label>
              <label class="format-option">
                <input type="radio" name="format" value="excel">
                <span>Excel</span>
              </label>
              <label class="format-option">
                <input type="radio" name="format" value="csv">
                <span>CSV</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showModal = false">
              Cancelar
            </button>
            <button type="submit" class="btn-generate-modal">
              Generar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const showModal = ref(false);
const filterType = ref('all');
const filterPeriod = ref('month');

const reportTypes = ref([
  {
    id: 'catch',
    icon: 'water',
    title: 'Reporte de Captura',
    description: 'Genera estadísticas detalladas sobre las capturas realizadas por embarcación y zona.',
    color: 'blue'
  },
  {
    id: 'activity',
    icon: 'show_chart',
    title: 'Reporte de Actividad',
    description: 'Analiza la actividad operativa de las embarcaciones y tiempo en faena.',
    color: 'green'
  },
  {
    id: 'compliance',
    icon: 'verified',
    title: 'Reporte de Cumplimiento',
    description: 'Evalúa el cumplimiento de normativas y regulaciones pesqueras.',
    color: 'purple'
  },
  {
    id: 'incident',
    icon: 'report',
    title: 'Reporte de Incidentes',
    description: 'Documenta alertas, violaciones y eventos relevantes del período.',
    color: 'red'
  }
]);

const reports = ref([
  {
    id: 1,
    type: 'catch',
    icon: 'water',
    title: 'Reporte Mensual de Capturas - Febrero 2024',
    author: 'Juan Pérez',
    date: '15/02/2024',
    time: '14:30',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: 2,
    type: 'activity',
    icon: 'show_chart',
    title: 'Análisis de Actividad Semanal',
    author: 'María López',
    date: '14/02/2024',
    time: '10:15',
    size: '1.8 MB',
    format: 'Excel'
  },
  {
    id: 3,
    type: 'compliance',
    icon: 'verified',
    title: 'Evaluación de Cumplimiento Q1',
    author: 'Carlos Ruiz',
    date: '12/02/2024',
    time: '16:45',
    size: '3.2 MB',
    format: 'PDF'
  },
  {
    id: 4,
    type: 'incident',
    icon: 'report',
    title: 'Reporte de Incidentes - Enero',
    author: 'Ana Torres',
    date: '10/02/2024',
    time: '09:20',
    size: '1.5 MB',
    format: 'PDF'
  }
]);

const filteredReports = computed(() => {
  let filtered = reports.value;
  
  if (filterType.value !== 'all') {
    filtered = filtered.filter(r => r.type === filterType.value);
  }
  
  return filtered;
});

const selectType = (typeId) => {
  console.log('Generar reporte tipo:', typeId);
  showModal.value = true;
};

const generateReport = () => {
  console.log('Generando reporte...');
  showModal.value = false;
};
</script>

<style scoped>
.reportes-container {
  padding: 2rem;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .reportes-container {
    padding: 1rem;
  }
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

.btn-generate {
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

.btn-generate:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.report-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.type-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.type-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.type-icon.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.type-icon.green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.type-icon.purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.type-icon.red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.type-card h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.type-card p {
  margin: 0 0 1.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
}

.btn-select {
  width: 100%;
  padding: 0.75rem;
  background: rgba(6, 78, 59, 0.1);
  color: #064e3b;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-select:hover {
  background: #064e3b;
  color: white;
}

.reports-history {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.reports-history h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #064e3b;
}

.history-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  border-color: #064e3b;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.report-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.report-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.report-icon.catch {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.report-icon.activity {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.report-icon.compliance {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.report-icon.incident {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.report-icon .material-symbols-rounded {
  font-size: 1.75rem;
}

.report-info {
  flex: 1;
}

.report-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1f2937;
}

.report-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.report-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.report-meta .material-symbols-rounded {
  font-size: 1rem;
}

.report-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
}

.report-size {
  font-size: 0.9rem;
  color: #6b7280;
}

.report-format {
  padding: 0.25rem 0.75rem;
  background: #e5e7eb;
  color: #1f2937;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  color: #6b7280;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #064e3b;
  color: white;
}

.action-btn.danger:hover {
  background: #ef4444;
  color: white;
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
  max-width: 600px;
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

.format-options {
  display: flex;
  gap: 1rem;
}

.format-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-option:has(input:checked) {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.format-option input {
  width: auto;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-generate-modal {
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

.btn-generate-modal {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-generate-modal:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

@media (max-width: 768px) {
  .reportes-container {
    padding: 1rem;
    margin-left: 72px;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .report-types {
    grid-template-columns: 1fr;
  }
  
  .report-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .report-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
