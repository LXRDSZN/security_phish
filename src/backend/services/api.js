import axios from 'axios';

// Crear instancia de Axios con la configuración básica
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL del backend
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
##################################################################################################
#                          api para login                                                         #
##################################################################################################
*/
export const login = async (username,password) => {
  try {
    const response = await api.post('http://localhost:5000/api/auth/login', {
      username,
      password
    });

    // Devuelve la respuesta de la API, que puede incluir un mensaje de éxito
    return response.data;
  } catch (error) {
    console.error('Error al hacer iniciar sesion:', error);
    // Lanza el error para ser manejado en el componente Vue
    throw error;
  }
};

/*
##################################################################################################
#                          api para registrar                                                     #
##################################################################################################
*/

export const signup = async (username, email, password) => {
  try {
    const response = await api.post('http://localhost:5000/api/auth/signup', {
      username,
      email,
      password
    });

    // Devuelve los datos del servidor (token, mensaje, etc.)
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    // Reenvía el error al componente que lo llamó
    throw error;
  }
};

/*
##################################################################################################
#                          api para cerrar sesión                                                 #
##################################################################################################
*/

export const logout = async () => {
  try {
    const response = await api.post('http://localhost:5000/api/auth/logout', {}, {
      withCredentials: true, //cookie HttpOnly
    });
    return response.data;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

/*
##################################################################################################
#                          api para obtener la cookie                                             #
##################################################################################################
*/

export const obtenerPerfil = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/perfil', {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};


