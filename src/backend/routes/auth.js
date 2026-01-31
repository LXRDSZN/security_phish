import { Router } from "express";
import { login, register } from "../controllers/user.controllers.js";

import { checkUserCredentials } from "../models/login/login.js";
import { signup } from "../models/signup/signup.js";
import jwt from 'jsonwebtoken';
import validateSchema from "../middleware/validateSchema.js";
import { verificarToken } from '../middleware/authMiddleware.js';
import { loginSchema, signupSchema } from "../middleware/authSchemas.js";


const router = Router();
router.post("/register", register);
router.post("/login", login);



/*
##################################################################################################
#                          Endpoint para inicio de  sesion                                       #
##################################################################################################
*/

// Función de login
router.post('/auth/login', validateSchema(loginSchema), async (req, res) => {
  const { usuario: username, contrasena: password } = req.body;

  const user = await checkUserCredentials(username, password);

  if (!user) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, 'secretKey', { expiresIn: '1h' });

  // Enviar el token como una cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,       // ⚠️ solo en desarrollo
    sameSite: 'Lax',     // ✅ compatible con HTTP
    maxAge: 3600000,
  });
  

  return res.json({ message: 'Login exitoso' });
});

/*
##################################################################################################
#                          Endpoint para registrarse                                             #
##################################################################################################
*/

//Ruta  de endpoint para registrar un usuario

router.post('/auth/signup', validateSchema(signupSchema), async (req, res) => {
  const { usuario, email, contrasena } = req.body;

  try {
    const nuevousuario = await signup(usuario, email, contrasena);
    return res.status(201).json({ message: 'Usuario registrado exitosamente', data: nuevousuario });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});


/*
##################################################################################################
#                          Endpoint para borrar cookie                                            #
##################################################################################################
*/

//Ruta  de endpoint para borrar cookie
router.post('/auth/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax' 
  });
  res.json({ message: 'Sesión cerrada' });
});


/*
##################################################################################################
#                          Endpoint para verificar la  cookie                                     #
##################################################################################################
*/
router.get('/auth/perfil', verificarToken, (req, res) => {
  res.json({ message: 'Acceso autorizado', usuario: req.usuario });
});

export default router;


