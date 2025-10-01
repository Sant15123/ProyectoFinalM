/**
 * Definición de rutas para las operaciones CRUD de libros
 *
 * Este archivo configura todas las rutas HTTP relacionadas con los libros,
 * aplicando middlewares de validación y conectando las rutas con los
 * métodos correspondientes del controlador.
 *
 * Todas las rutas están bajo el prefijo /books cuando se montan en la app principal.
 *
 * @module routes/BookRoutes
 */

// Importaciones necesarias
const express = require('express');                                    // Framework Express
const BookController = require('../controllers/BookController');     // Controlador de Book
const { validateToDo, validateId } = require('../middlewares/validation'); // Middlewares de validación

// Crear instancia del router de Express
const router = express.Router();

// Crear instancia del controlador
const controller = new BookController();

// Conectar a MongoDB al inicializar las rutas
// Esto asegura que la conexión esté disponible antes de procesar requests
(async () => {
    await controller.connect();
})();

// ===== DEFINICIÓN DE RUTAS CRUD =====

// GET /books - Obtener todos los libros
// No requiere validación adicional
router.get('/', controller.getAll.bind(controller));

// GET /books/:id - Obtener un libro específico por ID
// Valida que el ID sea un número válido
router.get('/:id', validateId, controller.getById.bind(controller));

// POST /books - Crear un nuevo libro
// Valida los datos del cuerpo de la solicitud
router.post('/', validateToDo, controller.create.bind(controller));

// PUT /books/:id - Actualizar un libro existente
// Valida ID y datos del cuerpo
router.put('/:id', validateId, validateToDo, controller.update.bind(controller));

// DELETE /books/:id - Eliminar un libro
// Solo valida que el ID sea un número válido
router.delete('/:id', validateId, controller.delete.bind(controller));

// Exportar el router para ser usado en la aplicación principal
module.exports = router;