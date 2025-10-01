/**
 * Definición de rutas para las operaciones CRUD de autores
 *
 * Este archivo configura todas las rutas HTTP relacionadas con los autores,
 * aplicando middlewares de validación y conectando las rutas con los
 * métodos correspondientes del controlador.
 *
 * Todas las rutas están bajo el prefijo /authors cuando se montan en la app principal.
 *
 * @module routes/AuthorRoutes
 */

// Importaciones necesarias
const express = require('express');                                    // Framework Express
const AuthorController = require('../controllers/AuthorController');     // Controlador de Author
const { validateToDo, validateId } = require('../middlewares/validation'); // Middlewares de validación

// Crear instancia del router de Express
const router = express.Router();

// Crear instancia del controlador
const controller = new AuthorController();

// Conectar a MongoDB al inicializar las rutas
// Esto asegura que la conexión esté disponible antes de procesar requests
(async () => {
    await controller.connect();
})();

// ===== DEFINICIÓN DE RUTAS CRUD =====

// GET /authors - Obtener todos los autores
// No requiere validación adicional
router.get('/', controller.getAll.bind(controller));

// GET /authors/:id - Obtener un autor específico por ID
// Valida que el ID sea un número válido
router.get('/:id', validateId, controller.getById.bind(controller));

// POST /authors - Crear un nuevo autor
// Valida los datos del cuerpo de la solicitud
router.post('/', controller.create.bind(controller));

// PUT /authors/:id - Actualizar un autor existente
// Valida ID y datos del cuerpo
router.put('/:id', validateId, controller.update.bind(controller));

// DELETE /authors/:id - Eliminar un autor
// Solo valida que el ID sea un número válido
router.delete('/:id', validateId, controller.delete.bind(controller));

// Exportar el router para ser usado en la aplicación principal
module.exports = router;