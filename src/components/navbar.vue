<template>
  <aside class="sidebar" :class="{ expanded: isOpen }">

    <!-- BOTÓN MENÚ -->
    <div class="menu-toggle" @click="toggleMenu">
      <span class="material-symbols-rounded">menu</span>
    </div>

    <!-- MENÚ -->
    <nav class="menu">
      <RouterLink to="/Dashboard" class="menu-item">
        <span class="material-symbols-rounded">dashboard</span>
        <span class="text">Dashboard</span>
      </RouterLink>

      <RouterLink to="/Radar" class="menu-item">
        <span class="material-symbols-rounded">radar</span>
        <span class="text">Radar</span>
      </RouterLink>

      <RouterLink to="/Embarcaciones" class="menu-item">
        <span class="material-symbols-rounded">directions_boat</span>
        <span class="text">Embarcaciones</span>
      </RouterLink>

      <RouterLink to="/Zonas_protegidas" class="menu-item">
        <span class="material-symbols-rounded">map</span>
        <span class="text">Zonas protegidas</span>
      </RouterLink>

      <RouterLink to="/Alertas" class="menu-item alert">
        <span class="material-symbols-rounded">warning</span>
        <span class="text">Alertas</span>
      </RouterLink>

      <RouterLink to="/Estadisticas" class="menu-item">
        <span class="material-symbols-rounded">bar_chart</span>
        <span class="text">Estadísticas</span>
      </RouterLink>

      <RouterLink to="/Reportes" class="menu-item">
        <span class="material-symbols-rounded">description</span>
        <span class="text">Reportes</span>
      </RouterLink>
    </nav>

    <!-- CONFIGURACIÓN + SALIR -->
    <div class="menu-bottom">
      <RouterLink to="/Configuracion" class="menu-item">
        <span class="material-symbols-rounded">settings</span>
        <span class="text">Configuración</span>
      </RouterLink>

      <!-- SALIR -->
      <div class="menu-item logout" @click="logout">
        <span class="material-symbols-rounded">logout</span>
        <span class="text">Salir</span>
      </div>
    </div>

  </aside>
</template>


<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const isSidebarCollapsed = ref(false);
const router = useRouter();

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

async function logout() {
  try {
    await axios.post('http://localhost:5000/api/auth/logout', {}, {
      withCredentials: true,
    });
    router.push('/'); // redirige al inicio
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;

  width: 72px;
  height: 100vh;

  background: linear-gradient(
    180deg,
    #064e3b,
    #022c22
  );

  color: white;
  display: flex;
  flex-direction: column;

  transition: width 0.3s ease;
  box-shadow: 4px 0 20px rgba(0,0,0,0.25);
  z-index: 100;
}

.sidebar.expanded {
  width: 240px;
}

/* BOTÓN */
.menu-toggle {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: 1px solid rgba(255,255,255,0.15);
}

.menu-toggle span {
  font-size: 1.6rem;
}

/* MENÚ */
.menu {
  flex: 1;
  padding-top: 12px;
}

.menu-item {
  height: 52px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  cursor: pointer;
  transition: background 0.25s ease;
}

.menu-item:hover {
  background: rgba(255,255,255,0.08);
}

/* ICONOS */
.material-symbols-rounded {
  font-size: 1.5rem;
  min-width: 24px;
  color: #ffff;
}

/* TEXTO */
.text {
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.2s ease;
  color: #fff;
}

.sidebar.expanded .text {
  opacity: 1;
  transform: translateX(0);
}

/* ACTIVO */
.menu-item.active {
  background: rgba(255,255,255,0.15);
  border-left: 4px solid #22c55e;
}

/* ALERTAS */
.menu-item.alert {
  color: #fecaca;
}

/* ABAJO */
.menu-bottom {
  border-top: 1px solid rgba(255,255,255,0.15);
}
</style>
