<script setup>
import { ref } from 'vue'; // Variables reactivas
import { useToast } from 'vue-toast-notification'; // Notificaciones
import 'vue-toast-notification/dist/theme-sugar.css'; // Estilo de notificaciones
import { actualizarMateria } from '@/backend/services/api';

// Props: Recibe la materia que se está editando
const props = defineProps({
  materia: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['guardar', 'cancelar']);
// variables reactivas que guardan los parametros tridos de la  api mostrando su contenido
const key = ref (props.materia.key || '');
const nombre = ref (props.materia.subjectname || '');
// Inicializa el toast para notificaciones
const toast = useToast();



const modificarMateria = async () => {
  if (!key.value || !nombre.value) {
    toast.error('Por favor, completa todos los campos del formulario.', {
      position: 'top-right',
      duration: 5000,
      dismissible: true,
    });
    return;
  }
  try {
    const response = await actualizarMateria(
      key.value,
      nombre.value,
      {
        withCredentials: true, 
      }
    );
  console.log("Respuesta de la API:", response);

  if (response.message?.includes("actualizada correctamente")) {
      toast.success('Datos de la Materia actualizados correctamente.', {
        position: 'top-right',
        duration: 5000,
        dismissible: true,
      });
    setTimeout(() => {
      window.location.href = "/Materias";
    }, 750);
      emit('guardar', response.data || {}); // fallback si no hay data
  } else {
      toast.error(response.message || 'Hubo un error al actualizar los datos de la Materia.', {
      position: 'top-right',
      duration: 5000,
      dismissible: true,
    });
  }
  } catch (error) {
    toast.error('No se encontro la materia, Verifica que la key de la materia exista.', {
    position: 'top-right',
    duration: 5000,
    dismissible: true,
    });
    console.error('Error al modificar la Materia:', error);
  }
};


</script>

<template>
  <div class="alta-materia-container">
    <h1>Actualizar Materias</h1>
    <form @submit.prevent="modificarMateria">
      <div class="form-group">
        <label for="key">ID Materia:</label>
        <input type="text" id="key" v-model="key" placeholder="ID Materia" />
      </div>

      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="nombre" placeholder="Nombre" />
      </div>
      <button type="submit" class="btn-submit">Registrar Materia</button>
    </form>
  </div>
</template>

<style scoped>
.alta-materia-container {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  width: 100%;
  padding: 0.8rem;
  font-size: 1.2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>