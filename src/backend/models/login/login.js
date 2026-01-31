import User from "../usuarios/user.js";
import bcrypt from "bcrypt";

// Función para verificar las credenciales del usuario
export const checkUserCredentials = async (username, password) => {
  try {
    // Consultamos el usuario en la base de datos
    const user = await User.findOne({ username });

    if (!user) {
      return null;
    }

    // Comparamos la contraseña ingresada con la almacenada en la base de datos (encriptada)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    // Si las credenciales son correctas, devolvemos el usuario
    return user;
  } catch (err) {
    console.error('Error al verificar credenciales:', err);
    throw new Error('Error al verificar las credenciales');
  }
};
