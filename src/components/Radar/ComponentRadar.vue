<template>
  <div class="radar-container">
    <div class="radar-header">
      <h1>Sistema de Radar</h1>
      <div class="radar-controls">
        <button class="btn-primary" @click="toggleRadar">
          <span class="material-symbols-rounded">{{ isActive ? 'stop' : 'play_arrow' }}</span>
          {{ isActive ? 'Detener' : 'Activar' }} Radar
        </button>
        <button class="btn-secondary">
          <span class="material-symbols-rounded">refresh</span>
          Actualizar
        </button>
      </div>
    </div>

    <div class="radar-status">
      <div class="status-badge" :class="isActive ? 'active' : 'inactive'">
        <span class="pulse"></span>
        {{ isActive ? 'Radar Activo' : 'Radar Inactivo' }}
      </div>
      <p>Última actualización: {{ lastUpdate }}</p>
    </div>

    <div class="radar-content">
      <div class="radar-display">
        <div class="radar-screen" :class="{ active: isActive }">
          <div class="radar-grid">
            <div class="grid-line horizontal" v-for="i in 8" :key="'h-'+i"></div>
            <div class="grid-line vertical" v-for="i in 8" :key="'v-'+i"></div>
          </div>
          <div class="radar-sweep" v-if="isActive"></div>
          <div class="radar-center"></div>
          
          <div v-for="detection in detections" 
               :key="detection.id" 
               class="radar-blip"
               :style="{ left: detection.x + '%', top: detection.y + '%' }">
            <span class="blip-pulse"></span>
          </div>

          <div class="radar-rings">
            <div class="ring" v-for="i in 4" :key="'ring-'+i"></div>
          </div>
        </div>

        <div class="radar-info">
          <div class="info-item">
            <span class="material-symbols-rounded">visibility</span>
            <div>
              <p class="label">Rango de Detección</p>
              <p class="value">50 km</p>
            </div>
          </div>
          <div class="info-item">
            <span class="material-symbols-rounded">speed</span>
            <div>
              <p class="label">Velocidad de Escaneo</p>
              <p class="value">30 RPM</p>
            </div>
          </div>
          <div class="info-item">
            <span class="material-symbols-rounded">schedule</span>
            <div>
              <p class="label">Tiempo de Ciclo</p>
              <p class="value">2.0 seg</p>
            </div>
          </div>
        </div>
      </div>

      <div class="detections-panel">
        <h2>
          <span class="material-symbols-rounded">satellite_alt</span>
          Detecciones Activas ({{ detections.length }})
        </h2>
        
        <div class="detections-list">
          <div v-for="detection in detectionsData" 
               :key="detection.id" 
               class="detection-card">
            <div class="detection-header">
              <span class="detection-id">{{ detection.name }}</span>
              <span class="detection-badge" :class="detection.status">
                {{ detection.status }}
              </span>
            </div>
            <div class="detection-details">
              <div class="detail-item">
                <span class="material-symbols-rounded">explore</span>
                <span>{{ detection.distance }} km</span>
              </div>
              <div class="detail-item">
                <span class="material-symbols-rounded">navigation</span>
                <span>{{ detection.bearing }}°</span>
              </div>
              <div class="detail-item">
                <span class="material-symbols-rounded">speed</span>
                <span>{{ detection.speed }} nudos</span>
              </div>
            </div>
            <div class="detection-time">
              Detectado: {{ detection.time }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isActive = ref(true);
const lastUpdate = ref('');
const detections = ref([
  { id: 1, x: 45, y: 30 },
  { id: 2, x: 65, y: 55 },
  { id: 3, x: 30, y: 60 },
  { id: 4, x: 70, y: 25 },
  { id: 5, x: 40, y: 70 }
]);

const detectionsData = ref([
  { id: 1, name: 'PE-001', status: 'normal', distance: 12.5, bearing: 45, speed: 8, time: '14:30:25' },
  { id: 2, name: 'PE-003', status: 'warning', distance: 8.3, bearing: 120, speed: 12, time: '14:28:10' },
  { id: 3, name: 'PE-007', status: 'normal', distance: 15.7, bearing: 230, speed: 6, time: '14:25:45' },
  { id: 4, name: 'PE-012', status: 'alert', distance: 5.2, bearing: 310, speed: 15, time: '14:32:00' },
  { id: 5, name: 'PE-015', status: 'normal', distance: 22.1, bearing: 180, speed: 9, time: '14:20:15' }
]);

let updateInterval;

const toggleRadar = () => {
  isActive.value = !isActive.value;
};

const updateTime = () => {
  const now = new Date();
  lastUpdate.value = now.toLocaleTimeString('es-ES');
};

onMounted(() => {
  updateTime();
  updateInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval);
});
</script>

<style scoped>
.radar-container {
  padding: 2rem;
  margin-left: 72px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
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

.status-badge.inactive {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 2px solid #ef4444;
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

.radar-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.radar-display {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.radar-screen {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: radial-gradient(circle, #1e293b 0%, #0f172a 100%);
  border-radius: 50%;
  border: 3px solid #334155;
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.radar-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.grid-line {
  position: absolute;
  background: #10b981;
}

.grid-line.horizontal {
  width: 100%;
  height: 1px;
}

.grid-line.vertical {
  width: 1px;
  height: 100%;
}

.radar-rings {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring {
  position: absolute;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 50%;
}

.ring:nth-child(1) { width: 25%; height: 25%; }
.ring:nth-child(2) { width: 50%; height: 50%; }
.ring:nth-child(3) { width: 75%; height: 75%; }
.ring:nth-child(4) { width: 95%; height: 95%; }

.radar-sweep {
  position: absolute;
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #10b981 100%);
  top: 50%;
  left: 50%;
  transform-origin: left center;
  animation: sweep 2s linear infinite;
  box-shadow: 0 0 20px #10b981;
}

@keyframes sweep {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.radar-center {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #10b981;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px #10b981;
  z-index: 10;
}

.radar-blip {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #f59e0b;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #f59e0b;
  animation: blip 2s infinite;
}

@keyframes blip {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.blip-pulse {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(245, 158, 11, 0.3);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
}

.radar-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item .material-symbols-rounded {
  font-size: 2rem;
  color: #10b981;
}

.label {
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.value {
  margin: 0.25rem 0 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
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
}

.detection-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
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
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.detail-item .material-symbols-rounded {
  font-size: 1rem;
}

.detection-time {
  font-size: 0.8rem;
  color: #64748b;
}

@media (max-width: 1200px) {
  .radar-content {
    grid-template-columns: 1fr;
  }
  
  .radar-info {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .radar-container {
    padding: 1rem;
  }
  
  .radar-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .radar-info {
    grid-template-columns: 1fr;
  }
}
</style>
