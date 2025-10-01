/**
 * Middleware global para el manejo de errores en la aplicación
 *
 * Este middleware centraliza el manejo de todos los errores que ocurren
 * en la aplicación, proporcionando respuestas de error consistentes
 * y registrando los errores para debugging.
 *
 * Debe ser el último middleware registrado en la aplicación.
 *
 * @module middlewares/errorHandler
 */

/**
 * Función middleware para manejar errores globales
 *
 * Procesa diferentes tipos de errores y devuelve respuestas HTTP
 * apropiadas con mensajes de error consistentes.
 *
 * @param {Error} err - Objeto de error capturado
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const errorHandler = (err, req, res, next) => {
    // Registrar el error en la consola para debugging
    console.error('Error:', err);

    // Manejar errores de validación de Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Error de validación',
            details: err.message
        });
    }

    // Manejar errores de conversión de tipos en Mongoose
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'ID inválido' });
    }

    // Manejar errores de duplicados en MongoDB (índices únicos)
    if (err.code === 11000) {
        return res.status(409).json({ error: 'Duplicado detectado' });
    }

    // Error genérico del servidor para errores no manejados
    res.status(500).json({ error: 'Error interno del servidor' });
};

// Exportar el middleware de manejo de errores
module.exports = errorHandler;