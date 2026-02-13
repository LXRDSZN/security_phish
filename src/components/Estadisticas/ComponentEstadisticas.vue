<template>
  <div class="estadisticas-container">
    <div class="header">
      <h1>Estadísticas y Análisis</h1>
      <select v-model="timePeriod" class="time-select">
        <option value="day">Hoy</option>
        <option value="week">Esta Semana</option>
        <option value="month">Este Mes</option>
        <option value="year">Este Año</option>
      </select>
    </div>

    <div class="stats-overview">
      <div class="stat-card primary">
        <div class="stat-icon">
          <span class="material-symbols-rounded">water</span>
        </div>
        <div class="stat-info">
          <h3>{{ totalCapture }} Ton</h3>
          <p>Captura Total</p>
          <span class="trend up">+12% vs período anterior</span>
        </div>
      </div>

      <div class="stat-card success">
        <div class="stat-icon">
          <span class="material-symbols-rounded">trending_up</span>
        </div>
        <div class="stat-info">
          <h3>{{ efficiency }}%</h3>
          <p>Eficiencia Operativa</p>
          <span class="trend up">+5% vs período anterior</span>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon">
          <span class="material-symbols-rounded">schedule</span>
        </div>
        <div class="stat-info">
          <h3>{{ avgTime }}h</h3>
          <p>Tiempo Prom. Faena</p>
          <span class="trend down">-8% vs período anterior</span>
        </div>
      </div>

      <div class="stat-card info">
        <div class="stat-icon">
          <span class="material-symbols-rounded">eco</span>
        </div>
        <div class="stat-info">
          <h3>{{ compliance }}%</h3>
          <p>Cumplimiento Normativo</p>
          <span class="trend up">+3% vs período anterior</span>
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h2>
          <span class="material-symbols-rounded">monitoring</span>
          Captura por Embarcación
        </h2>
        <div class="chart-placeholder">
          <div class="bar-chart">
            <div v-for="boat in boatStats" :key="boat.name" class="bar-item">
              <div class="bar" :style="{ height: boat.percentage + '%' }">
                <span class="bar-value">{{ boat.value }}t</span>
              </div>
              <span class="bar-label">{{ boat.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h2>
          <span class="material-symbols-rounded">pie_chart</span>
          Distribución por Especie
        </h2>
        <div class="chart-placeholder">
          <div class="pie-chart">
            <div class="pie-visual">
              <span class="material-symbols-rounded">donut_large</span>
            </div>
            <div class="pie-legend">
              <div v-for="species in speciesData" :key="species.name" class="legend-item">
                <span class="legend-color" :style="{ background: species.color }"></span>
                <span class="legend-text">{{ species.name }} ({{ species.percentage }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card wide">
        <h2>
          <span class="material-symbols-rounded">show_chart</span>
          Tendencia de Capturas (Últimos 7 Días)
        </h2>
        <div class="chart-placeholder">
          <div class="line-chart">
            <div class="chart-grid">
              <div v-for="i in 5" :key="i" class="grid-line"></div>
            </div>
            <div class="chart-data">
              <div v-for="(day, index) in weekData" :key="index" class="data-point">
                <div class="point-bar" :style="{ height: day.value + '%' }"></div>
                <span class="point-label">{{ day.day }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="reports-section">
      <div class="section-header">
        <h2>
          <span class="material-symbols-rounded">assessment</span>
          Reportes Recientes
        </h2>
        <button class="btn-export">
          <span class="material-symbols-rounded">download</span>
          Exportar Datos
        </button>
      </div>

      <div class="reports-table">
        <div class="table-header">
          <div>Embarcación</div>
          <div>Capitán</div>
          <div>Captura (Ton)</div>
          <div>Zona</div>
          <div>Fecha</div>
          <div>Estado</div>
        </div>
        <div v-for="report in reports" :key="report.id" class="table-row">
          <div class="cell boat">
            <span class="material-symbols-rounded">directions_boat</span>
            {{ report.boat }}
          </div>
          <div class="cell">{{ report.captain }}</div>
          <div class="cell capture">{{ report.capture }}</div>
          <div class="cell">{{ report.zone }}</div>
          <div class="cell">{{ report.date }}</div>
          <div class="cell">
            <span class="status-badge" :class="report.status">
              {{ getStatusLabel(report.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const timePeriod = ref('week');
const totalCapture = ref(1247);
const efficiency = ref(87);
const avgTime = ref(6.5);
const compliance = ref(94);

const boatStats = ref([
  { name: 'PE-001', value: 45, percentage: 90 },
  { name: 'PE-003', value: 38, percentage: 76 },
  { name: 'PE-007', value: 42, percentage: 84 },
  { name: 'PE-012', value: 35, percentage: 70 },
  { name: 'PE-015', value: 40, percentage: 80 }
]);

const speciesData = ref([
  { name: 'Anchoveta', percentage: 45, color: '#3b82f6' },
  { name: 'Jurel', percentage: 25, color: '#10b981' },
  { name: 'Caballa', percentage: 20, color: '#f59e0b' },
  { name: 'Bonito', percentage: 10, color: '#ef4444' }
]);

const weekData = ref([
  { day: 'Lun', value: 75 },
  { day: 'Mar', value: 85 },
  { day: 'Mié', value: 70 },
  { day: 'Jue', value: 90 },
  { day: 'Vie', value: 80 },
  { day: 'Sáb', value: 65 },
  { day: 'Dom', value: 55 }
]);

const reports = ref([
  { id: 1, boat: 'PE-001', captain: 'Juan Pérez', capture: '12.5', zone: 'Zona A', date: '15/02/2024', status: 'approved' },
  { id: 2, boat: 'PE-003', captain: 'María López', capture: '18.3', zone: 'Zona B', date: '15/02/2024', status: 'approved' },
  { id: 3, boat: 'PE-007', captain: 'Carlos Ruiz', capture: '10.2', zone: 'Zona C', date: '14/02/2024', status: 'pending' },
  { id: 4, boat: 'PE-012', captain: 'Ana Torres', capture: '15.7', zone: 'Zona A', date: '14/02/2024', status: 'approved' },
  { id: 5, boat: 'PE-015', captain: 'Luis García', capture: '8.9', zone: 'Zona D', date: '13/02/2024', status: 'rejected' }
]);

const getStatusLabel = (status) => {
  const labels = {
    approved: 'Aprobado',
    pending: 'Pendiente',
    rejected: 'Rechazado'
  };
  return labels[status] || status;
};
</script>

<style scoped>
.estadisticas-container {
  padding: 2rem;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .estadisticas-container {
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

.time-select {
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;
}

.time-select:focus {
  border-color: #064e3b;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 1400px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
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

.stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.stat-card.info .stat-icon {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-info h3 {
  margin: 0;
  font-size: 2rem;
  color: #1f2937;
}

.stat-info p {
  margin: 0.25rem 0 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.trend {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.trend.up {
  color: #10b981;
}

.trend.down {
  color: #ef4444;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.chart-card.wide {
  grid-column: 1 / -1;
}

.chart-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #064e3b;
}

.chart-placeholder {
  min-height: 250px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 250px;
  gap: 1rem;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  border-radius: 8px 8px 0 0;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.bar-value {
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
}

.bar-label {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

.pie-chart {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  height: 250px;
}

.pie-visual {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    #3b82f6 0% 45%,
    #10b981 45% 70%,
    #f59e0b 70% 90%,
    #ef4444 90% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.pie-visual .material-symbols-rounded {
  font-size: 4rem;
  color: white;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-text {
  font-size: 0.9rem;
  color: #1f2937;
}

.line-chart {
  height: 250px;
  position: relative;
}

.chart-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-line {
  width: 100%;
  height: 1px;
  background: #e5e7eb;
}

.chart-data {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100%;
  position: relative;
  z-index: 1;
}

.data-point {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
}

.point-bar {
  width: 80%;
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
}

.point-bar:hover {
  opacity: 0.8;
}

.point-label {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.reports-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.25rem;
  color: #064e3b;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #064e3b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-export:hover {
  background: #022c22;
}

.reports-table {
  overflow-x: auto;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  align-items: center;
}

.table-header {
  background: #f9fafb;
  border-radius: 8px;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.cell {
  font-size: 0.9rem;
  color: #6b7280;
}

.cell.boat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1f2937;
  font-weight: 500;
}

.cell.boat .material-symbols-rounded {
  color: #064e3b;
}

.cell.capture {
  font-weight: 600;
  color: #1f2937;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.approved {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.status-badge.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card.wide {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .estadisticas-container {
    padding: 1rem;
    margin-left: 72px;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}
</style>
