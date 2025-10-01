/**
 * Definición de rutas para las operaciones CRUD de usuarios
 *
 * Este archivo configura todas las rutas HTTP relacionadas con los usuarios,
 * aplicando middlewares de validación y conectando las rutas con los
 * métodos correspondientes del controlador.
 *
 * Todas las rutas están bajo el prefijo /users cuando se montan en la app principal.
 *
 * @module routes/UserRoutes
 */

// Importaciones necesarias
const express = require('express');                                    // Framework Express
const UserController = require('../controllers/UserController');     // Controlador de User
const { validateUser, validateId } = require('../middlewares/validation'); // Middlewares de validación

// Crear instancia del router de Express
const router = express.Router();

// Crear instancia del controlador
const controller = new UserController();

// Conectar a MongoDB al inicializar las rutas
// Esto asegura que la conexión esté disponible antes de procesar requests
(async () => {
    await controller.connect();
})();

// ===== DEFINICIÓN DE RUTAS CRUD =====

// GET /users - Obtener todos los usuarios
// No requiere validación adicional
router.get('/', controller.getAll.bind(controller));

// GET /users/:id - Obtener un usuario específico por ID
// Valida que el ID sea un número válido
router.get('/:id', validateId, controller.getById.bind(controller));

// POST /users - Crear un nuevo usuario
// Valida los datos del cuerpo de la solicitud
router.post('/', validateUser, controller.create.bind(controller));

// PUT /users/:id - Actualizar un usuario existente
// Valida ID y datos del cuerpo
router.put('/:id', validateId, validateUser, controller.update.bind(controller));

// DELETE /users/:id - Eliminar un usuario
// Solo valida que el ID sea un número válido
router.delete('/:id', validateId, controller.delete.bind(controller));

// Exportar el router para ser usado en la aplicación principal
module.exports = router;