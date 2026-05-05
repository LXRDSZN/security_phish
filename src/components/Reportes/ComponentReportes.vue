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
        <select v-model="filterType" @change="loadReports" class="filter-select">
          <option value="all">Todos los tipos</option>
          <option value="summary">Resumen General</option>
          <option value="alerts">Alertas</option>
          <option value="vessels">Embarcaciones</option>
          <option value="zones">Zonas Protegidas</option>
          <option value="compliance">Cumplimiento</option>
        </select>
        <select v-model="filterPeriod" @change="loadReports" class="filter-select">
          <option value="all">Todos los períodos</option>
          <option value="day">Último día</option>
          <option value="week">Última semana</option>
          <option value="month">Último mes</option>
          <option value="year">Último año</option>
        </select>
      </div>

      <div class="reports-list">
        <div v-for="report in filteredReports" :key="report.id" class="report-item">
           <div class="report-icon" :class="report.type">
            <span class="material-symbols-rounded">{{ getTypeIcon(report.type) }}</span>
          </div>
          
          <div class="report-info">
            <h3>{{ report.title }}</h3>
            <div class="report-meta">
              <span>
                <span class="material-symbols-rounded">person</span>
                {{ report.generatedBy }}
              </span>
              <span>
                <span class="material-symbols-rounded">calendar_today</span>
                {{ new Date(report.generatedAt).toLocaleDateString('es-ES') }}
              </span>
              <span>
                <span class="material-symbols-rounded">schedule</span>
                {{ new Date(report.generatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
          </div>

          <div class="report-details">
            <span class="report-size">{{ report.fileSize }}</span>
            <span class="report-format">{{ report.format.toUpperCase() }}</span>
          </div>

          <div class="report-actions">
            <button class="action-btn" @click="viewReport(report.id)" title="Ver reporte">
              <span class="material-symbols-rounded">visibility</span>
            </button>
            <button class="action-btn" @click="downloadReport(report.id)" title="Descargar">
              <span class="material-symbols-rounded">download</span>
            </button>
            <button class="action-btn danger" @click="deleteReport(report.id)" title="Eliminar">
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
        
        <form class="modal-form" @submit.prevent="generateReportHandler">
          <div class="form-group">
            <label>Tipo de Reporte *</label>
            <select v-model="newReport.type" required>
              <option value="">Seleccionar tipo...</option>
              <option value="summary">Reporte Resumen General</option>
              <option value="alerts">Reporte de Alertas</option>
              <option value="vessels">Reporte de Embarcaciones</option>
              <option value="zones">Reporte de Zonas Protegidas</option>
              <option value="compliance">Reporte de Cumplimiento</option>
            </select>
          </div>

          <div class="form-group">
            <label>Título del Reporte *</label>
            <input 
              v-model="newReport.title"
              type="text" 
              placeholder="Ej: Reporte Mensual de Alertas" 
              required>
          </div>

          <div class="form-group">
            <label>Período de Análisis *</label>
            <select v-model="newReport.period" required>
              <option value="day">Último Día</option>
              <option value="week">Última Semana</option>
              <option value="month">Último Mes</option>
              <option value="year">Último Año</option>
            </select>
            <small class="form-hint">
              📅 Fecha de emisión: {{ getCurrentDate() }}
            </small>
          </div>

          <div class="form-group">
            <label>Formato de Exportación *</label>
            <div class="format-options">
              <label class="format-option">
                <input type="radio" v-model="newReport.format" value="json" checked>
                <span>
                  <span class="material-symbols-rounded">code</span>
                  JSON
                </span>
              </label>
              <label class="format-option">
                <input type="radio" v-model="newReport.format" value="csv">
                <span>
                  <span class="material-symbols-rounded">table_chart</span>
                  CSV
                </span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Descripción (opcional)</label>
            <textarea 
              v-model="newReport.description"
              placeholder="Agregue notas o comentarios sobre este reporte..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal">
              Cancelar
            </button>
            <button type="submit" class="btn-generate-modal" :disabled="generating">
              <span v-if="generating">Generando...</span>
              <span v-else>Generar Reporte</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  generateReport as generateReportAPI,
  getReports as getReportsAPI,
  getReportById,
  deleteReport as deleteReportAPI,
  downloadReportFile
} from '@/backend/services/api.js';

const showModal = ref(false);
const filterType = ref('all');
const filterPeriod = ref('all');
const generating = ref(false);
const loading = ref(false);

// Nuevo reporte
const newReport = ref({
  title: '',
  type: '',
  period: 'month',
  format: 'json',
  description: ''
});

// Lista de reportes generados
const reports = ref([]);

const reportTypes = ref([
  {
    id: 'summary',
    icon: 'summarize',
    title: 'Reporte Resumen General',
    description: 'Resumen completo del sistema: embarcaciones, zonas, alertas y cumplimiento.',
    color: 'blue'
  },
  {
    id: 'alerts',
    icon: 'notification_important',
    title: 'Reporte de Alertas',
    description: 'Análisis detallado de alertas generadas, prioridades y resoluciones.',
    color: 'red'
  },
  {
    id: 'vessels',
    icon: 'directions_boat',
    title: 'Reporte de Embarcaciones',
    description: 'Estadísticas de embarcaciones monitoreadas y su actividad.',
    color: 'green'
  },
  {
    id: 'zones',
    icon: 'shield',
    title: 'Reporte de Zonas Protegidas',
    description: 'Estado y actividad en las zonas marinas protegidas.',
    color: 'purple'
  },
  {
    id: 'compliance',
    icon: 'verified',
    title: 'Reporte de Cumplimiento',
    description: 'Evaluación del cumplimiento normativo y tasas de resolución.',
    color: 'yellow'
  }
]);

// Cargar reportes
const loadReports = async () => {
  try {
    loading.value = true;
    const response = await getReportsAPI({
      type: filterType.value,
      period: filterPeriod.value
    });
    reports.value = response.reports || [];
  } catch (error) {
    console.error('Error cargando reportes:', error);
  } finally {
    loading.value = false;
  }
};

// Filtrar reportes
const filteredReports = computed(() => {
  return reports.value.filter(report => {
    const matchType = filterType.value === 'all' || report.type === filterType.value;
    const matchPeriod = filterPeriod.value === 'all' || report.period === filterPeriod.value;
    return matchType && matchPeriod;
  });
});

// Seleccionar tipo de reporte
const selectType = (typeId) => {
  const type = reportTypes.value.find(t => t.id === typeId);
  if (type) {
    newReport.value.type = typeId;
    newReport.value.title = type.title;
    showModal.value = true;
  }
};

// Generar reporte
const generateReportHandler = async () => {
  try {
    generating.value = true;

    const response = await generateReportAPI({
      title: newReport.value.title,
      type: newReport.value.type,
      period: newReport.value.period,
      format: newReport.value.format
    });

    // Agregar a la lista
    await loadReports();

    // Descargar automáticamente
    downloadGeneratedReport(response.data, response.report);

    alert('✅ Reporte generado y descargado exitosamente');
    closeModal();

  } catch (error) {
    console.error('Error generando reporte:', error);
    alert('❌ Error al generar el reporte');
  } finally {
    generating.value = false;
  }
};

// Descargar reporte generado
const downloadGeneratedReport = (data, reportInfo) => {
  const filename = `${reportInfo.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${reportInfo.format}`;
  
  let content, mimeType;
  
  if (reportInfo.format === 'json') {
    content = JSON.stringify(data, null, 2);
    mimeType = 'application/json';
  } else if (reportInfo.format === 'csv') {
    content = convertToCSV(data);
    mimeType = 'text/csv';
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Ver reporte
const viewReport = async (reportId) => {
  try {
    const report = await getReportById(reportId);
    console.log('Reporte:', report);
    
    // Mostrar en modal o nueva ventana
    const dataStr = JSON.stringify(report.data, null, 2);
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head>
          <title>${report.title}</title>
          <style>
            body { font-family: monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
            pre { background: #252526; padding: 20px; border-radius: 8px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>${report.title}</h1>
          <p>Generado: ${new Date(report.generatedAt).toLocaleString('es-ES')}</p>
          <pre>${dataStr}</pre>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error viendo reporte:', error);
    alert('Error al cargar el reporte');
  }
};

// Descargar reporte
const downloadReport = async (reportId) => {
  try {
    const report = await getReportById(reportId);
    downloadGeneratedReport(report.data, report);
  } catch (error) {
    console.error('Error descargando reporte:', error);
    alert('Error al descargar el reporte');
  }
};

// Eliminar reporte
const deleteReport = async (reportId) => {
  if (!confirm('¿Estás seguro de eliminar este reporte?')) return;
  
  try {
    await deleteReportAPI(reportId);
    await loadReports();
    alert('✅ Reporte eliminado correctamente');
  } catch (error) {
    console.error('Error eliminando reporte:', error);
    alert('Error al eliminar el reporte');
  }
};

// Utilidades
const closeModal = () => {
  showModal.value = false;
  newReport.value = {
    title: '',
    type: '',
    period: 'month',
    format: 'json',
    description: ''
  };
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getTypeIcon = (type) => {
  const icons = {
    summary: 'summarize',
    alerts: 'notification_important',
    vessels: 'directions_boat',
    zones: 'shield',
    compliance: 'verified'
  };
  return icons[type] || 'description';
};

const convertToCSV = (data) => {
  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(acc, flattenObject(value, newKey));
      } else {
        acc[newKey] = value;
      }
      return acc;
    }, {});
  };
  
  const flatData = flattenObject(data);
  const headers = Object.keys(flatData).join(',');
  const values = Object.values(flatData).map(v => 
    typeof v === 'string' && v.includes(',') ? `"${v}"` : v
  ).join(',');
  
  return `${headers}\n${values}`;
};

// Cargar al montar
onMounted(() => {
  loadReports();
});
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

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
  min-height: 80px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
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
