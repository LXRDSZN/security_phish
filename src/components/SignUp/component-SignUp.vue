<template>
    <div class="login-container">
      <section class="user">
        <label for="username">Usuario:</label>
        <input type="text" id="username" v-model="username" placeholder="Ingrese su Usuario" />
      </section>
      <section class="email">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" placeholder="Ingrese su correo" />
      </section>
      <section class="password">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" placeholder="Ingrese su contraseña" />
      </section>
  
      <button class="login-button" @click="login">Registrar</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router'; 
  import axios from 'axios';
  import { useToast } from 'vue-toast-notification';
  import 'vue-toast-notification/dist/theme-sugar.css';
   
  
  // Variables reactivas
  const username = ref('');
  const email = ref('');
  const password = ref('');
  
  // Inicializa el toast
  const toast = useToast();
  const router = useRouter(); // Router para redirigir
  
  // Función de registro
const login = async () => {
  if (!username.value || !email.value || !password.value) {
    toast.error('Por favor, ingresa todos los campos', {
      position: 'top-right',
      duration: 5000,
      dismissible: true,
    });
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/auth/signup', {
      usuario: username.value,
      email: email.value,
      contrasena: password.value,
    });

    // Comprobamos si el registro fue exitoso usando el código de estado
    if (response.status === 201) {
      // Guarda el token en localStorage
      localStorage.setItem('token', response.data.token);

      // Muestra un mensaje de éxito
      toast.success('Registro exitoso. Bienvenido!', {
        position: 'top-right',
        duration: 2000, //duracion de la animacion
        dismissible: true,
      });

      // Añadimos un pequeño retraso para que el usuario vea el mensaje antes de la redirección
      setTimeout(() => {
        router.push('/'); // Redirigir al login
      }, 750); // tiempo de redireccion al login
    }
  } catch (error) {
      const message = error.response?.data?.message || 'Hubo un problema con la conexión';
      // Si hay errores de validación (de Zod), los mostramos todos
      if (error.response?.data?.errors) {
          error.response.data.errors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`, {
          position: 'top-right',
          duration: 5000,
          dismissible: true,
        });
      });
    } else {
      // Si es otro tipo de error
      toast.error(message, {
      position: 'top-right',
      duration: 5000,
      dismissible: true,
    });
  }
}
};

  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .user, 
  .email,
  .password {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: rgb(93, 95, 93);
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    transition: border-color 0.3s;
  }
  
  input:focus {
    border-color: #007bff;
    outline: none;
  }
  
  .login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: rgb(10, 149, 255);
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .login-button:hover {
    background-color: rgb(42, 124, 186);
  }
  
  .error {
    color: red;
    margin-top: 1rem;
    font-size: 0.9rem;
    text-align: center;
    
  }
  
  /* Aumentar el tamaño de los campos para pantallas que no sean celulares */
  @media (min-width: 769px) {
    .login-container {
      max-width: 900px; /* Hacemos más largo el contenedor */
    }
  
    input {
      padding: 1rem;
      font-size: 1.1rem;
    }
  
    .login-button {
      padding: 1rem;
      font-size: 1.1rem;
    }
  }
  
  @media (max-width: 768px) {
    .login-container {
      padding: 1rem;
    }
  
    input {
      padding: 0.5rem;
    }
  
    .login-button {
      padding: 0.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .login-container {
      padding: 1rem;
    }
  
    input {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  
    .login-button {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  }
  </style>
  