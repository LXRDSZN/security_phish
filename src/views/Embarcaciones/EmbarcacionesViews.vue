<script setup>
import navbar from '@/components/navbar.vue';
import ComponentEmbarcaciones from '@/components/Embarcaciones/ComponentEmbarcaciones.vue';
</script>
<template>
  <div class="System-Panel">
    <navbar/>
    <ComponentEmbarcaciones/>
  </div>
</template>

<style scoped>
.System-Panel {
  display: flex;
}
</style>
  