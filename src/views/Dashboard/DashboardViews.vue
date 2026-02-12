<script setup>
import navbar from '@/components/navbar.vue';
import ComponentDashboard from '@/components/Dashboard/ComponentDashboard.vue';
</script>
<template>
  <div class="System-Panel">
    <navbar/>
    <ComponentDashboard/>
  </div>
</template>

<style scoped>
.System-Panel {
  display: flex;
}
</style>
  