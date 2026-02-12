<template>
  <div class="configuracion-container">
    <div class="header">
      <h1>Configuración del Sistema</h1>
    </div>

    <div class="config-layout">
      <div class="config-sidebar">
        <button 
          v-for="section in sections" 
          :key="section.id"
          class="sidebar-btn"
          :class="{ active: activeSection === section.id }"
          @click="activeSection = section.id">
          <span class="material-symbols-rounded">{{ section.icon }}</span>
          <span>{{ section.title }}</span>
        </button>
      </div>

      <div class="config-content">
        <div v-if="activeSection === 'profile'" class="config-section">
          <h2>Perfil de Usuario</h2>
          <div class="profile-card">
            <div class="profile-avatar">
              <span class="material-symbols-rounded">person</span>
            </div>
            <button class="btn-upload">Cambiar Foto</button>
          </div>

          <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" value="Juan Pérez González" placeholder="Nombre completo">
          </div>

          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" value="juan.perez@pesquera.com" placeholder="Correo electrónico">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Cargo</label>
              <input type="text" value="Supervisor" placeholder="Cargo">
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" value="+51 987 654 321" placeholder="Teléfono">
            </div>
          </div>

          <button class="btn-save">Guardar Cambios</button>
        </div>

        <div v-if="activeSection === 'security'" class="config-section">
          <h2>Seguridad</h2>
          
          <div class="security-card">
            <h3>Cambiar Contraseña</h3>
            <div class="form-group">
              <label>Contraseña Actual</label>
              <input type="password" placeholder="••••••••">
            </div>
            <div class="form-group">
              <label>Nueva Contraseña</label>
              <input type="password" placeholder="••••••••">
            </div>
            <div class="form-group">
              <label>Confirmar Contraseña</label>
              <input type="password" placeholder="••••••••">
            </div>
            <button class="btn-save">Actualizar Contraseña</button>
          </div>

          <div class="security-card">
            <h3>Autenticación de Dos Factores</h3>
            <p class="description">Agrega una capa adicional de seguridad a tu cuenta.</p>
            <div class="toggle-option">
              <span>Habilitar autenticación 2FA</span>
              <label class="toggle">
                <input type="checkbox">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="security-card">
            <h3>Sesiones Activas</h3>
            <div class="session-item">
              <div class="session-info">
                <span class="material-symbols-rounded">computer</span>
                <div>
                  <p class="session-device">Chrome en Windows</p>
                  <p class="session-location">Lima, Perú • Activa ahora</p>
                </div>
              </div>
              <button class="btn-logout">Cerrar</button>
            </div>
          </div>
        </div>

        <div v-if="activeSection === 'notifications'" class="config-section">
          <h2>Notificaciones</h2>
          
          <div class="notification-card">
            <h3>Alertas del Sistema</h3>
            <div class="toggle-option">
              <div>
                <p class="option-title">Alertas de embarcaciones</p>
                <p class="option-description">Recibe notificaciones sobre embarcaciones en zonas restringidas</p>
              </div>
              <label class="toggle">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
            <div class="toggle-option">
              <div>
                <p class="option-title">Alertas de radar</p>
                <p class="option-description">Notificaciones de detecciones del sistema de radar</p>
              </div>
              <label class="toggle">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
            <div class="toggle-option">
              <div>
                <p class="option-title">Reportes automáticos</p>
                <p class="option-description">Recibe reportes diarios automáticamente</p>
              </div>
              <label class="toggle">
                <input type="checkbox">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="notification-card">
            <h3>Métodos de Notificación</h3>
            <div class="toggle-option">
              <div>
                <p class="option-title">Correo electrónico</p>
                <p class="option-description">Enviar notificaciones por correo</p>
              </div>
              <label class="toggle">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
            <div class="toggle-option">
              <div>
                <p class="option-title">Notificaciones push</p>
                <p class="option-description">Mostrar notificaciones en el navegador</p>
              </div>
              <label class="toggle">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div v-if="activeSection === 'system'" class="config-section">
          <h2>Configuración del Sistema</h2>
          
          <div class="system-card">
            <h3>Preferencias de Visualización</h3>
            <div class="form-group">
              <label>Idioma</label>
              <select>
                <option>Español</option>
                <option>English</option>
                <option>Português</option>
              </select>
            </div>
            <div class="form-group">
              <label>Zona Horaria</label>
              <select>
                <option>América/Lima (GMT-5)</option>
                <option>América/Bogotá (GMT-5)</option>
                <option>América/México (GMT-6)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Formato de Fecha</label>
              <select>
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>

          <div class="system-card">
            <h3>Mapa y Radar</h3>
            <div class="form-group">
              <label>Rango de Radar (km)</label>
              <input type="number" value="50" min="10" max="100">
            </div>
            <div class="form-group">
              <label>Intervalo de Actualización (seg)</label>
              <input type="number" value="30" min="10" max="300">
            </div>
            <div class="toggle-option">
              <div>
                <p class="option-title">Mostrar trayectorias</p>
                <p class="option-description">Visualizar el historial de rutas de embarcaciones</p>
              </div>
              <label class="toggle">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <button class="btn-save">Guardar Configuración</button>
        </div>

        <div v-if="activeSection === 'about'" class="config-section">
          <h2>Acerca del Sistema</h2>
          
          <div class="about-card">
            <div class="app-logo">
              <span class="material-symbols-rounded">waves</span>
            </div>
            <h3>Sistema de Monitoreo Pesquero</h3>
            <p class="version">Versión 1.0.0</p>
            <p class="description">
              Sistema integral de monitoreo y control de actividades pesqueras, 
              diseñado para garantizar la sostenibilidad y el cumplimiento de regulaciones.
            </p>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="material-symbols-rounded">update</span>
              <div>
                <p class="info-label">Última Actualización</p>
                <p class="info-value">15 de Febrero, 2024</p>
              </div>
            </div>
            <div class="info-item">
              <span class="material-symbols-rounded">developer_mode</span>
              <div>
                <p class="info-label">Versión del Sistema</p>
                <p class="info-value">1.0.0 (Build 2024.02)</p>
              </div>
            </div>
            <div class="info-item">
              <span class="material-symbols-rounded">support</span>
              <div>
                <p class="info-label">Soporte Técnico</p>
                <p class="info-value">soporte@pesquera.com</p>
              </div>
            </div>
            <div class="info-item">
              <span class="material-symbols-rounded">gavel</span>
              <div>
                <p class="info-label">Licencia</p>
                <p class="info-value">Propietaria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeSection = ref('profile');

const sections = ref([
  { id: 'profile', title: 'Perfil', icon: 'person' },
  { id: 'security', title: 'Seguridad', icon: 'lock' },
  { id: 'notifications', title: 'Notificaciones', icon: 'notifications' },
  { id: 'system', title: 'Sistema', icon: 'settings' },
  { id: 'about', title: 'Acerca de', icon: 'info' }
]);
</script>

<style scoped>
.configuracion-container {
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
  margin: 0;
}

.config-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.config-sidebar {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.sidebar-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 8px;
  text-align: left;
  font-size: 1rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.sidebar-btn:hover {
  background: #f9fafb;
  color: #064e3b;
}

.sidebar-btn.active {
  background: #064e3b;
  color: white;
}

.sidebar-btn .material-symbols-rounded {
  font-size: 1.5rem;
}

.config-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.config-section h2 {
  font-size: 1.75rem;
  color: #064e3b;
  margin: 0 0 2rem 0;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 12px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
}

.btn-upload {
  padding: 0.75rem 1.5rem;
  background: #064e3b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-upload:hover {
  background: #022c22;
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
  border-color: #064e3b;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn-save {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.security-card,
.notification-card,
.system-card {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
}

.security-card h3,
.notification-card h3,
.system-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.description {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.toggle-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.option-title {
  margin: 0;
  font-weight: 500;
  color: #1f2937;
}

.option-description {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.3s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #10b981;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.session-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.session-info .material-symbols-rounded {
  font-size: 2rem;
  color: #064e3b;
}

.session-device {
  margin: 0;
  font-weight: 500;
  color: #1f2937;
}

.session-location {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background: #ef4444;
  color: white;
}

.about-card {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 2rem;
}

.app-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.about-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: white;
}

.version {
  margin: 0 0 1rem 0;
  color: rgba(255, 255, 255, 0.8);
}

.about-card .description {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
}

.info-item .material-symbols-rounded {
  font-size: 2rem;
  color: #064e3b;
}

.info-label {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.info-value {
  margin: 0.25rem 0 0;
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 1024px) {
  .config-layout {
    grid-template-columns: 1fr;
  }
  
  .config-sidebar {
    position: static;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .configuracion-container {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
