import User from "../usuarios/user.js"; 
import bcrypt from "bcryptjs";

// Función para registrar o verificar login de usuario
export const signup = async (username, email, password) => {
  try {
    // Verificamos si ya existe un usuario con ese username o email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return { error: "El usuario o correo ya está registrado" };
    }

    // Encriptamos la contraseña
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creamos el nuevo usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Guardamos en la base de datos
    await newUser.save();

    return { message: "Usuario registrado correctamente", user: newUser };

  } catch (err) {
    console.error("Error al registrar usuario:", err);
    throw new Error("Error al registrar usuario");
  }
};
