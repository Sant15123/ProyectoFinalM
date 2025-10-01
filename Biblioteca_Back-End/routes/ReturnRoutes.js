/**
 * Definición de rutas para las operaciones CRUD de devoluciones
 *
 * Este archivo configura todas las rutas HTTP relacionadas con las devoluciones,
 * aplicando middlewares de validación y conectando las rutas con los
 * métodos correspondientes del controlador.
 *
 * Todas las rutas están bajo el prefijo /returns cuando se montan en la app principal.
 *
 * @module routes/ReturnRoutes
 */

// Importaciones necesarias
const express = require('express');                                    // Framework Express
const ReturnController = require('../controllers/ReturnController');     // Controlador de Return
const { validateReturn, validateId } = require('../middlewares/validation'); // Middlewares de validación

// Crear instancia del router de Express
const router = express.Router();

// Crear instancia del controlador
const controller = new ReturnController();

// Conectar a MongoDB al inicializar las rutas
// Esto asegura que la conexión esté disponible antes de procesar requests
(async () => {
    await controller.connect();
})();

// ===== DEFINICIÓN DE RUTAS CRUD =====

// GET /returns - Obtener todas las devoluciones
// No requiere validación adicional
router.get('/', controller.getAll.bind(controller));

// GET /returns/:id - Obtener una devolución específica por ID
// Valida que el ID sea un número válido
router.get('/:id', validateId, controller.getById.bind(controller));

// POST /returns - Crear una nueva devolución
// Valida los datos del cuerpo de la solicitud
router.post('/', validateReturn, controller.create.bind(controller));

// PUT /returns/:id - Actualizar una devolución existente
// Valida ID y datos del cuerpo
router.put('/:id', validateId, validateReturn, controller.update.bind(controller));

// DELETE /returns/:id - Eliminar una devolución
// Solo valida que el ID sea un número válido
router.delete('/:id', validateId, controller.delete.bind(controller));

// Exportar el router para ser usado en la aplicación principal
module.exports = router;