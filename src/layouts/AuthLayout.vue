<template>
  <div class="auth-layout">
    <slot></slot>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
  padding: 1rem;
}
</style>
