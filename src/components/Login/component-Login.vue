<template>
  <div class="login-wrapper">

    <div class="login-card">
      <!-- PANEL VISUAL -->
      <div class="login-visual">
        <div class="overlay">
          <h2>Monitoreo inteligente</h2>
          <p>de actividades marítimas</p>
        </div>
      </div>

      <!-- FORMULARIO -->
      <div class="login-form">
        <h1>Iniciar sesión</h1>
        <p class="subtitle">
          Sistema Inteligente de Rastreo y Detección de Pesca Ilegal
        </p>

        <div class="field">
          <input type="text" v-model="username" placeholder="Usuario" />
        </div>

        <div class="field">
          <input type="password" v-model="password" placeholder="Contraseña" />
        </div>

        <button class="login-button" @click="login">
          Iniciar sesión
        </button>
      </div>
    </div>

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
  const password = ref('');
  
  // Inicializa el toast
  const toast = useToast();
  const router = useRouter(); // Router para redirigir
  
  const login = async () => {
  if (!username.value || !password.value) {
    toast.error('Por favor, ingresa ambos campos', {
      position: 'top-right',
      duration: 5000,
      dismissible: true,
    });
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      usuario: username.value,
      contrasena: password.value,
    }, {
      withCredentials: true, // Permite enviar y recibir cookies
    });

    if (response.data.message === 'Login exitoso') {
      // Muestra un mensaje de éxito
      toast.success('Inicio de sesión exitoso. Bienvenido!', {
        position: 'top-right',
        duration: 2000, //duracion de la animacion
        dismissible: true,
      });

      // Redirige a la página de Dashboard
      setTimeout(() => {
        router.push('/Dashboard'); // Redirigir al panel
      }, 750);
    }
  } catch (error) {
    const message =
      error.response?.data?.message || 'Hubo un problema con la conexión';
    toast.error(message, {
      position: 'top-right',
      duration: 5000,
      dismissible: true,
    });
  }
};

</script>
  <style scoped>
/* PANTALLA COMPLETA */


/* CARD PRINCIPAL */
.login-card {
  width: 900px;
  height: 480px;
  background: #ffffff;
  display: flex;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  margin-left: 15%;
  
}


/* PANEL VISUAL IZQUIERDO */
.login-visual {
  width: 45%;
  background-image: url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e");
  background-size: cover;
  background-position: center;
  position: relative;
}

.login-visual::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    rgba(0, 80, 70, 0.75),
    rgba(0, 30, 50, 0.85)
  );
}

/* TEXTO SOBRE LA IMAGEN */
.overlay {
  position: absolute;
  bottom: 40px;
  left: 40px;
  color: white;
  z-index: 1;
}

.overlay h2 {
  font-size: 1.8rem;
  margin: 0;
}

.overlay p {
  font-size: 1rem;
  opacity: 0.9;
}

/* FORMULARIO */
.login-form {
  width: 55%;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-form h1 {
  margin-bottom: 10px;
  color: #1e293b;
}

.subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 30px;
}

/* CAMPOS */
.field {
  margin-bottom: 18px;
}

.field input {
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  transition: all 0.3s ease;
}

.field input:focus {
  border-color: #16a34a;
  outline: none;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
}

/* BOTÓN */
.login-button {
  margin-top: 10px;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .login-card {
    flex-direction: column;
    height: auto;
    width: 95%;
  }

  .login-visual {
    width: 100%;
    height: 200px;
  }

  .login-form {
    width: 100%;
  }
}
</style>
