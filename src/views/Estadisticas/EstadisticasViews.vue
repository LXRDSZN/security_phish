<script setup>
import navbar from '@/components/navbar.vue';
import ComponentEstadisticas from '@/components/Estadisticas/ComponentEstadisticas.vue';
</script>
<template>
  <div class="System-Panel">
    <navbar/>
    <ComponentEstadisticas/>
  </div>
</template>

<style scoped>
.System-Panel {
  display: flex;
}
</style>
  