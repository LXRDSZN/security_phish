<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      Sistema Integral De Rastreo Y Deteccion De Pesca Ilegal
      
      <RouterLink to="/Registrate">Registrate </RouterLink>
      <RouterLink to="/">Inicia Sesion </RouterLink>
    </h3>
    
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

ul.additional-options {
  margin-top: auto;
}

li {
  margin: 0.5rem 0;
}
.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
