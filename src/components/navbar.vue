<template>
    <aside class="sidebar" :class="{ expanded: isOpen }">

  <!-- BOTÓN MENÚ -->
  <div class="menu-toggle" @click="toggleMenu">
    ☰
  </div>

  <!-- MENÚ -->
  <nav class="menu">
    <a class="menu-item active">
      <span class="icon">🏠</span>
      <span class="text">Dashboard</span>
    </a>

    <a class="menu-item">
      <span class="icon">🛰</span>
      <span class="text">Radar</span>
    </a>

    <a class="menu-item">
      <span class="icon">🚢</span>
      <span class="text">Embarcaciones</span>
    </a>

    <a class="menu-item">
      <span class="icon">🗺</span>
      <span class="text">Zonas protegidas</span>
    </a>

    <a class="menu-item alert">
      <span class="icon">🚨</span>
      <span class="text">Alertas</span>
    </a>

    <a class="menu-item">
      <span class="icon">📊</span>
      <span class="text">Estadísticas</span>
    </a>

    <a class="menu-item">
      <span class="icon">📁</span>
      <span class="text">Reportes</span>
    </a>
  </nav>

  <!-- CONFIGURACIÓN -->
  <div class="menu-bottom">
    <a class="menu-item">
      <span class="icon">⚙</span>
      <span class="text">Configuración</span>
    </a>
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
</script>


<style scoped>
/* SIDEBAR BASE */
.sidebar {
  width: 70px;
  height: 100vh;

  background: linear-gradient(180deg, #16a34a, #15803d);
  color: white;

  display: flex;
  flex-direction: column;

  transition: width 0.3s ease;
}

/* EXPANDIDO */
.sidebar.expanded {
  width: 240px;
}

/* BOTÓN MENÚ */
.menu-toggle {
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1.4rem;
  cursor: pointer;

  border-bottom: 1px solid rgba(255,255,255,0.2);
}

/* MENÚ */
.menu {
  flex: 1;
  padding-top: 10px;
}

/* ITEM */
.menu-item {
  height: 52px;

  display: flex;
  align-items: center;

  padding: 0 20px;
  gap: 16px;

  color: white;
  text-decoration: none;
  cursor: pointer;

  transition: background 0.2s ease;
}

.menu-item:hover {
  background: rgba(0,0,0,0.15);
}

/* ICONO */
.menu-item .icon {
  font-size: 1.3rem;
  min-width: 24px;
  text-align: center;
}

/* TEXTO */
.menu-item .text {
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* MOSTRAR TEXTO SOLO EXPANDIDO */
.sidebar.expanded .menu-item .text {
  opacity: 1;
}

/* ACTIVO */
.menu-item.active {
  background: rgba(0,0,0,0.25);
  border-left: 4px solid white;
}

/* ALERTAS */
.menu-item.alert {
  color: #ffe4e6;
}

/* CONFIG ABAJO */
.menu-bottom {
  border-top: 1px solid rgba(255,255,255,0.2);
}

</style>
