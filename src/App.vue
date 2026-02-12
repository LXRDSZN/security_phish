<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

const route = useRoute();

const currentLayout = computed(() => {
  const layout = route.meta.layout || 'default';
  if (layout === 'auth') return AuthLayout;
  if (layout === 'dashboard') return DashboardLayout;
  return 'div'; // default sin layout
});
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>

<style scoped>

</style>
