<script setup>
import { obtenermateria } from '@/backend/services/api';
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification'; // Notificaciones
import 'vue-toast-notification/dist/theme-sugar.css'; // Estilo de notificaciones
// Variables reactivas para la consulta
const criterioBusqueda = ref(''); // Almacena el criterio de búsqueda
const resultados = ref([]); // Almacena los resultados de la búsqueda
const busquedaRealizada = ref(false); // Indica si se ha realizado una búsqueda

// Inicializa el toast para notificaciones
const toast = useToast();


// Función para buscar alumnos
const buscarAlumno = async () => {
    if (!criterioBusqueda.value.trim()) {
      toast.error('Por favor, ingrese un criterio de búsqueda.', {
        position: 'top-right',
        duration: 5000,
        dismissible: true,
      });
      return;
    }
  
    try {
      const materias = await obtenermateria(); // Obtener todos los alumnos
      resultados.value = materias.filter((materia) => {
        return (
          materia.key.includes(criterioBusqueda.value) ||
          materia.subjectname.toLowerCase().includes(criterioBusqueda.value.toLowerCase())
        );
      });
      busquedaRealizada.value = true;
    } catch (err) {
      console.error('Error al buscar alumnos:', err);
      toast.error('No se pudo realizar la búsqueda. Intente más tarde.', {
        position: 'top-right',
        duration: 5000,
        dismissible: true,
      });
    }
  };

// Función para cancelar la consulta
const cancelar = () => {
  criterioBusqueda.value = '';
  resultados.value = [];
  busquedaRealizada.value = false;

};
</script>

<template>
    <div class="alta-alumno-container">
      <h1>Consultar Materias</h1>
      <form @submit.prevent="buscarAlumno">
        <div class="form-group">
          <label for="noControl">Key de la materia:</label>
          <input
            type="text"
            id="noControl"
            v-model="criterioBusqueda"
            placeholder="Ingrese La key O ID"
          />
        </div>
  
        <button type="submit" class="btn-submit">Buscar Materia</button>
      </form>
  
      <!-- Mostrar resultados de la búsqueda -->
      <div v-if="resultados.length > 0" class="resultados">
        <table class="alumnos-table">
          <thead>
            <tr>
              <th>Id_Materia</th>
              <th>Nombre</th>            
            </tr>
          </thead>
          <tbody>
            <tr v-for="materia in resultados" :key="materia.key">
              <td>{{ materia.key }}</td>
              <td>{{ materia.subjectname }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Mensaje si no hay resultados -->
      <div v-if="resultados.length === 0 && busquedaRealizada" class="no-resultados">
        No se encontraron resultados.
      </div>
  
      <!-- Botón para cancelar la consulta -->
      <button @click="cancelar" class="btn-submit btn-cancelar">Cancelar</button>
    </div>
  </template>
  
 
  <style scoped>
  .alta-alumno-container {
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
  
  input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  
  .btn-submit {
    width: 100%;
    padding: 0.8rem;
    font-size: 1.2rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .btn-submit:hover {
    background-color: #45a049;
  }
  
  .btn-cancelar {
    background-color: #f44336;
    margin-top: 1rem;
  }
  
  .btn-cancelar:hover {
    background-color: #d32f2f;
  }
  
  .resultados {
    margin-top: 2rem;
  }
  
  .alumnos-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .alumnos-table th,
  .alumnos-table td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
  }
  
  .alumnos-table th {
    background-color: #041d38;
    color: #ffff;
  }
  
  .no-resultados {
    margin-top: 1rem;
    color: #888;
    font-style: italic;
    text-align: center;
  }
  </style>