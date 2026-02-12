<script setup>
import navbar from '@/components/navbar.vue';
import ComponentZonasProtegidas from '@/components/Zonas_Protegidas/ComponentZonasProtegidas.vue';
</script>
<template>
  <div class="System-Panel">
    <navbar/>
    <ComponentZonasProtegidas/>
  </div>
</template>

<style scoped>
.System-Panel {
  display: flex;
}
</style>
  