<template>
  <div class="login-wrapper">

    <div class="login-card">
      <!-- PANEL VISUAL -->
      <div class="login-visual">
        <div class="overlay">
          <h2>Crear cuenta</h2>
          <p>Sistema de monitoreo marítimo</p>
        </div>
      </div>

      <!-- FORMULARIO -->
      <div class="login-form">
        <h1>Registro de usuario</h1>
        <p class="subtitle">
          Acceso al sistema de detección de pesca ilegal
        </p>

        <div class="field">
          <input
            type="text"
            v-model="username"
            placeholder="Usuario"
          />
        </div>

        <div class="field">
          <input
            type="email"
            v-model="email"
            placeholder="Correo electrónico"
          />
        </div>

        <div class="field">
          <input
            type="password"
            v-model="password"
            placeholder="Contraseña"
          />
        </div>

        <button class="login-button" @click="register">
          Registrar usuario
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

const username = ref('');
const email = ref('');
const password = ref('');

const toast = useToast();
const router = useRouter();

const register = async () => {
  if (!username.value || !email.value || !password.value) {
    toast.error('Por favor, ingresa todos los campos', {
      position: 'top-right',
      duration: 5000,
    });
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/signup',
      {
        usuario: username.value,
        email: email.value,
        contrasena: password.value,
      }
    );

    if (response.status === 201) {
      toast.success('Registro exitoso. Ahora puedes iniciar sesión', {
        position: 'top-right',
        duration: 2000,
      });

      setTimeout(() => {
        router.push('/');
      }, 750);
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach(err => {
        toast.error(`${err.field}: ${err.message}`, {
          position: 'top-right',
          duration: 5000,
        });
      });
    } else {
      toast.error(
        error.response?.data?.message || 'Error de conexión',
        { position: 'top-right' }
      );
    }
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.login-card {
  width: 900px;
  height: 520px;
  background: #ffffff;
  display: flex;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  margin-left: 15%;
}

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

.overlay {
  position: absolute;
  bottom: 40px;
  left: 40px;
  color: white;
  z-index: 1;
}

.login-form {
  width: 55%;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

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
}

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
