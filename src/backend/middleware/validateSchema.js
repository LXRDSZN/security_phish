export default function validateSchema(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      // Formatea los errores para que tengan { field, message }
      const formattedErrors = err.errors?.map((e) => ({
        field: e.path[0],        // el nombre del campo con error (ej. "contrasena")
        message: e.message,      // mensaje personalizado desde zod
      }));

      return res.status(400).json({
        message: "Error de validación",
        errors: formattedErrors || [], // envia siempre un array
      });
    }
  };
}1