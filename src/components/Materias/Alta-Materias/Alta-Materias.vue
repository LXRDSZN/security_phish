<script setup>
import { ref } from 'vue'; // Variables reactivas
import axios from 'axios'; // Solicitudes HTTP
import { useToast } from 'vue-toast-notification'; // Notificaciones
import 'vue-toast-notification/dist/theme-sugar.css'; // Estilo de notificaciones

// Variables reactivas para los campos del formulario
const key = ref('');
const nombre = ref('');


// Inicializa el toast para notificaciones
const toast = useToast();

const registrarMateria = async () => {
  // Validaciones
  if (
    !key.value || !nombre.value
  ) {
    toast.error('Por favor, completa todos los campos del formulario.', {
      position: 'top-right',
      duration: 5000,
      dismissible: true,
    });
    return;
  }

  // Validar ID Materia (máximo 10 caracteres)
  if (key.value.length < 6) {
    toast.error('El ID de la materia no puede tener menos de  de 6 caracteres.', {
      position: 'top-right',
      duration: 5000,
      dismissible: true,
    });


    return;
  }

   // Validar ID Materia (máximo 10 caracteres)
   if (nombre.value.length < 6 ) {
    toast.error('El nombre  de la materia no puede tener menos de 6 caracteres.', {
      position: 'top-right',
      duration: 5000,
      dismissible: true,
    });


    return;
  }



  try {
    const response = await axios.post('http://localhost:5000/api/auth/materias', {
      key: key.value,
      subjectname: nombre.value,  
    }, {
        withCredentials: true, 
    });

    if (response.status === 200 || response.status === 201) {
      toast.success('Materia registrada exitosamente', {
      position: 'top-right',
      duration: 2000,
      dismissible: true,
    });
    limpiarFormulario();
    setTimeout(() => {
        window.location.href = `/Materias`;
      }, 750);
    }

  } catch (error) {
    console.error('Error al registrar:', error);
    if (error.response?.status === 400) {
      toast.error(error.response.data.message || 'Error en los datos enviados', {
        position: 'top-right',
        duration: 5000,
        dismissible: true,
      });
    } else {
      toast.error('Hubo un problema con el servidor. Intenta nuevamente.', {
        position: 'top-right',
        duration: 5000,
        dismissible: true,
      });
    }
  }
};

// Función para limpiar el formulario después de registrar
const limpiarFormulario = () => {
  key.value = '';
  nombre.value = '';

};
</script>

<template>
  <div class="alta-materia-container">
    <h1>Registrar Nueva Materia</h1>
    <form @submit.prevent="registrarMateria">
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