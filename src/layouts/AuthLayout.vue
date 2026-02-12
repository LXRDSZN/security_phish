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
  background: linear-gradient(135deg, #0f766e 0%, #064e3b 100%);
  padding: 1rem;
}
</style>
