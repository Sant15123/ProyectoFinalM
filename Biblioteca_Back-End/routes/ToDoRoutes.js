/**
 * Definición de rutas para las operaciones CRUD de tareas ToDo
 *
 * Este archivo configura todas las rutas HTTP relacionadas con las tareas,
 * aplicando middlewares de validación y conectando las rutas con los
 * métodos correspondientes del controlador.
 *
 * Todas las rutas están bajo el prefijo /todos cuando se montan en la app principal.
 *
 * @module routes/ToDoRoutes
 */

// Importaciones necesarias
const express = require('express');                                    // Framework Express
const ToDoController = require('../controllers/ToDoController');     // Controlador de ToDo
const { validateToDo, validateId } = require('../middlewares/validation'); // Middlewares de validación

// Crear instancia del router de Express
const router = express.Router();

// Crear instancia del controlador
const controller = new ToDoController();

// Conectar a MongoDB al inicializar las rutas
// Esto asegura que la conexión esté disponible antes de procesar requests
(async () => {
    await controller.connect();
})();

// ===== DEFINICIÓN DE RUTAS CRUD =====

// GET /todos - Obtener todas las tareas
// No requiere validación adicional
router.get('/', controller.getAll.bind(controller));

// GET /todos/:id - Obtener una tarea específica por ID
// Valida que el ID sea un número válido
router.get('/:id', validateId, controller.getById.bind(controller));

// POST /todos - Crear una nueva tarea
// Valida los datos del cuerpo de la solicitud
router.post('/', validateToDo, controller.create.bind(controller));

// PUT /todos/:id - Actualizar una tarea existente
// Valida ID y datos del cuerpo
router.put('/:id', validateId, validateToDo, controller.update.bind(controller));

// DELETE /todos/:id - Eliminar una tarea
// Solo valida que el ID sea un número válido
router.delete('/:id', validateId, controller.delete.bind(controller));

// Exportar el router para ser usado en la aplicación principal
module.exports = router;