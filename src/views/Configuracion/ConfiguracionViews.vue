<script setup>
import navbar from '@/components/navbar.vue';
import ComponentConfiguracion from '@/components/Configuracion/ComponentConfiguracion.vue';
</script>
<template>
  <div class="System-Panel">
    <navbar/>
    <ComponentConfiguracion/>
  </div>
</template>

<style scoped>
.System-Panel {
  display: flex;
}
</style>
  