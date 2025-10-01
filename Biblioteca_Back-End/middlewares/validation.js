/**
 * Middleware de validación para las operaciones con tareas ToDo
 *
 * Este archivo contiene funciones middleware que validan los datos
 * de entrada antes de que lleguen a los controladores, asegurando
 * la integridad de los datos y proporcionando respuestas de error
 * consistentes.
 *
 * @module middlewares/validation
 */

/**
 * Middleware para validar los datos de una tarea ToDo
 *
 * Valida el título y el estado de completitud en las solicitudes
 * POST y PUT. Para POST, el título es obligatorio.
 *
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const validateToDo = (req, res, next) => {
    // Extraer campos del cuerpo de la solicitud
    const { title, completed } = req.body;

    // Validar que el título esté presente en POST
    if (req.method === 'POST' && !title) {
        return res.status(400).json({ error: 'El campo "title" es requerido' });
    }

    // Validar tipo de dato del título si está presente
    if (title && typeof title !== 'string') {
        return res.status(400).json({ error: 'El campo "title" debe ser una cadena de texto' });
    }

    // Validar tipo de dato del estado de completitud si está presente
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'El campo "completed" debe ser un booleano' });
    }

    // Si todas las validaciones pasan, continuar
    next();
};

/**
 * Middleware para validar los datos de un préstamo
 *
 * Valida los campos userName, bookTitle y borrowDate en las solicitudes
 * POST y PUT. Para POST, todos los campos son obligatorios.
 *
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const validateLoan = (req, res, next) => {
    // Extraer campos del cuerpo de la solicitud
    const { userName, bookTitle, borrowDate, returnDate, status } = req.body;

    // Validar que los campos requeridos estén presentes en POST
    if (req.method === 'POST') {
        if (!userName) {
            return res.status(400).json({ error: 'El campo "userName" es requerido' });
        }
        if (!bookTitle) {
            return res.status(400).json({ error: 'El campo "bookTitle" es requerido' });
        }
        if (!borrowDate) {
            return res.status(400).json({ error: 'El campo "borrowDate" es requerido' });
        }
    }

    // Validar tipos de datos
    if (userName && typeof userName !== 'string') {
        return res.status(400).json({ error: 'El campo "userName" debe ser una cadena de texto' });
    }
    if (bookTitle && typeof bookTitle !== 'string') {
        return res.status(400).json({ error: 'El campo "bookTitle" debe ser una cadena de texto' });
    }
    if (borrowDate && typeof borrowDate !== 'string') {
        return res.status(400).json({ error: 'El campo "borrowDate" debe ser una cadena de texto' });
    }
    if (returnDate && typeof returnDate !== 'string') {
        return res.status(400).json({ error: 'El campo "returnDate" debe ser una cadena de texto' });
    }
    if (status && !['borrowed', 'returned'].includes(status)) {
        return res.status(400).json({ error: 'El campo "status" debe ser "borrowed" o "returned"' });
    }

    // Si todas las validaciones pasan, continuar
    next();
};

/**
 * Middleware para validar los datos de un usuario
 *
 * Valida los campos name, email y role en las solicitudes
 * POST y PUT. Para POST, name y email son obligatorios.
 *
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const validateUser = (req, res, next) => {
    // Extraer campos del cuerpo de la solicitud
    const { name, email, role } = req.body;

    // Validar que los campos requeridos estén presentes en POST
    if (req.method === 'POST') {
        if (!name) {
            return res.status(400).json({ error: 'El campo "name" es requerido' });
        }
        if (!email) {
            return res.status(400).json({ error: 'El campo "email" es requerido' });
        }
    }

    // Validar tipos de datos
    if (name && typeof name !== 'string') {
        return res.status(400).json({ error: 'El campo "name" debe ser una cadena de texto' });
    }
    if (email && typeof email !== 'string') {
        return res.status(400).json({ error: 'El campo "email" debe ser una cadena de texto' });
    }
    if (role && !['admin', 'reader'].includes(role)) {
        return res.status(400).json({ error: 'El campo "role" debe ser "admin" o "reader"' });
    }

    // Si todas las validaciones pasan, continuar
    next();
};

/**
 * Middleware para validar el parámetro ID en las rutas
 *
 * Convierte el ID de string a número y valida que sea un número válido.
 *
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const validateId = (req, res, next) => {
    // Convertir el parámetro de ruta a número
    const id = parseInt(req.params.id);

    // Validar que sea un número válido
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }

    // Actualizar el parámetro con el valor convertido
    req.params.id = id;

    // Continuar al siguiente middleware
    next();
};

/**
 * Middleware para validar los datos de una devolución
 *
 * Valida los campos userName, bookTitle, actualReturnDate y otros campos
 * relacionados con las devoluciones. Para POST, userName, bookTitle y
 * actualReturnDate son obligatorios.
 *
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const validateReturn = (req, res, next) => {
    // Extraer campos del cuerpo de la solicitud
    const { userName, bookTitle, borrowDate, returnDate, actualReturnDate, condition, notes, fine } = req.body;

    // Validar que los campos requeridos estén presentes en POST
    if (req.method === 'POST') {
        if (!userName) {
            return res.status(400).json({ error: 'El campo "userName" es requerido' });
        }
        if (!bookTitle) {
            return res.status(400).json({ error: 'El campo "bookTitle" es requerido' });
        }
        if (!actualReturnDate) {
            return res.status(400).json({ error: 'El campo "actualReturnDate" es requerido' });
        }
    }

    // Validar tipos de datos
    if (userName && (typeof userName !== 'string' || userName.trim().length === 0)) {
        return res.status(400).json({ error: 'El campo "userName" debe ser una cadena de texto no vacía' });
    }
    if (bookTitle && (typeof bookTitle !== 'string' || bookTitle.trim().length === 0)) {
        return res.status(400).json({ error: 'El campo "bookTitle" debe ser una cadena de texto no vacía' });
    }

    // Validar fechas si están presentes
    const dateFields = { borrowDate, returnDate, actualReturnDate };
    for (const [fieldName, fieldValue] of Object.entries(dateFields)) {
        if (fieldValue && isNaN(Date.parse(fieldValue))) {
            return res.status(400).json({ error: `El campo "${fieldName}" debe ser una fecha válida` });
        }
    }

    // Validar condición si está presente
    const validConditions = ['Excelente', 'Muy Bueno', 'Bueno', 'Regular', 'Malo', 'Dañado'];
    if (condition && !validConditions.includes(condition)) {
        return res.status(400).json({
            error: 'La condición debe ser uno de los valores válidos: Excelente, Muy Bueno, Bueno, Regular, Malo, Dañado'
        });
    }

    // Validar multa si está presente
    if (fine !== undefined && (typeof fine !== 'number' || fine < 0)) {
        return res.status(400).json({ error: 'El campo "fine" debe ser un número positivo o cero' });
    }

    // Validar notas si están presentes
    if (notes && typeof notes !== 'string') {
        return res.status(400).json({ error: 'El campo "notes" debe ser una cadena de texto' });
    }

    // Si todas las validaciones pasan, continuar
    next();
};

// Exportar las funciones de validación
module.exports = {
    validateToDo,
    validateLoan,
    validateUser,
    validateReturn,
    validateId
};