import { z } from 'zod';

export const signupSchema = z.object({
  usuario: z.string().min(3, 'Usuario muy corto'),
  email: z.string().email('Email inválido'),
  contrasena: z.string().min(6, 'Contraseña muy corta'),
});

export const loginSchema = z.object({
  usuario: z.string(),
  contrasena: z.string().min(6, 'Contraseña muy corta'),
});

export const registrerMateria = z.object({
  key: z.string().min(6,'Key muy corta'),
  subjectname:z.string().min(6,'Nombre muy corto')
})