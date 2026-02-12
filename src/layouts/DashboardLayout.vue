<template>
  <div class="dashboard-layout">
    <navbar />
    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import navbar from '@/components/navbar.vue';
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width, 72px);
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
}

/* Desktop: margen dinámico */
@media (min-width: 769px) {
  .main-content {
    margin-left: var(--sidebar-width, 72px);
  }
}

/* Mobile: margen fijo (sidebar es overlay) */
@media (max-width: 768px) {
  .main-content {
    margin-left: 72px;
  }
}
</style>
