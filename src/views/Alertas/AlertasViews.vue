<script setup>
import navbar from '@/components/navbar.vue';
import ComponentAlertas from '@/components/Alertas/ComponentAlertas.vue';
</script>
<template>
  <div class="System-Panel">
    <navbar/>
    <ComponentAlertas/>
  </div>
</template>
<style scoped>
.System-Panel {
  display: flex;
}
</style>
  