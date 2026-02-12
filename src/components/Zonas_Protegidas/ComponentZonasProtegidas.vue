<template>
  <div class="zonas-container">
    <div class="header">
      <h1>Zonas Protegidas</h1>
      <button class="btn-add">
        <span class="material-symbols-rounded">add_location</span>
        Nueva Zona
      </button>
    </div>

    <div class="content-grid">
      <div class="map-section">
        <div class="map-wrapper">
          <div class="map-placeholder">
            <span class="material-symbols-rounded">public</span>
            <p>Mapa de Zonas Protegidas</p>
          </div>
          <div class="map-controls">
            <button class="control-btn">
              <span class="material-symbols-rounded">add</span>
            </button>
            <button class="control-btn">
              <span class="material-symbols-rounded">remove</span>
            </button>
            <button class="control-btn">
              <span class="material-symbols-rounded">my_location</span>
            </button>
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
              <button class="btn-zone">
                <span class="material-symbols-rounded">visibility</span>
                Ver en mapa
              </button>
              <button class="btn-zone">
                <span class="material-symbols-rounded">edit</span>
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const zones = ref([
  {
    id: 1,
    name: 'Zona Protegida Norte',
    level: 'high',
    levelLabel: 'Restricción Alta',
    icon: 'dangerous',
    area: 125.5,
    boats: 0,
    created: '15/01/2024',
    description: 'Zona de reproducción de especies protegidas. Prohibido el ingreso de cualquier embarcación.'
  },
  {
    id: 2,
    name: 'Reserva Marina Este',
    level: 'medium',
    levelLabel: 'Restricción Media',
    icon: 'warning',
    area: 88.3,
    boats: 2,
    created: '20/02/2024',
    description: 'Zona de pesca regulada. Se requiere permiso especial para acceso.'
  },
  {
    id: 3,
    name: 'Área de Conservación Sur',
    level: 'low',
    levelLabel: 'Monitoreo',
    icon: 'visibility',
    area: 200.0,
    boats: 8,
    created: '10/03/2024',
    description: 'Zona bajo monitoreo constante. Pesca permitida con restricciones.'
  },
  {
    id: 4,
    name: 'Santuario Marino Oeste',
    level: 'high',
    levelLabel: 'Restricción Alta',
    icon: 'dangerous',
    area: 150.0,
    boats: 0,
    created: '05/12/2023',
    description: 'Santuario de vida marina. Acceso prohibido sin autorización especial.'
  }
]);
</script>

<style scoped>
.zonas-container {
  padding: 2rem;
  margin-left: 72px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
}

.map-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.map-wrapper {
  position: relative;
}

.map-placeholder {
  background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
  border-radius: 8px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
}

.map-placeholder p {
  font-size: 1.25rem;
  margin-top: 1rem;
}

.map-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.zones-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.btn-zone:hover {
  background: rgba(6, 78, 59, 0.15);
}

.btn-zone .material-symbols-rounded {
  font-size: 1.2rem;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
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
</style>
