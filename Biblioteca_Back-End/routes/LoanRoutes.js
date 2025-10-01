/**
 * Definición de rutas para las operaciones CRUD de préstamos
 *
 * Este archivo configura todas las rutas HTTP relacionadas con los préstamos,
 * aplicando middlewares de validación y conectando las rutas con los
 * métodos correspondientes del controlador.
 *
 * Todas las rutas están bajo el prefijo /loans cuando se montan en la app principal.
 *
 * @module routes/LoanRoutes
 */

// Importaciones necesarias
const express = require('express');                                    // Framework Express
const LoanController = require('../controllers/LoanController');     // Controlador de Loan
const { validateLoan, validateId } = require('../middlewares/validation'); // Middlewares de validación

// Crear instancia del router de Express
const router = express.Router();

// Crear instancia del controlador
const controller = new LoanController();

// Conectar a MongoDB al inicializar las rutas
// Esto asegura que la conexión esté disponible antes de procesar requests
(async () => {
    await controller.connect();
})();

// ===== DEFINICIÓN DE RUTAS CRUD =====

// GET /loans - Obtener todos los préstamos
// No requiere validación adicional
router.get('/', controller.getAll.bind(controller));

// GET /loans/:id - Obtener un préstamo específico por ID
// Valida que el ID sea un número válido
router.get('/:id', validateId, controller.getById.bind(controller));

// POST /loans - Crear un nuevo préstamo
// Valida los datos del cuerpo de la solicitud
router.post('/', validateLoan, controller.create.bind(controller));

// PUT /loans/:id - Actualizar un préstamo existente
// Valida ID y datos del cuerpo
router.put('/:id', validateId, validateLoan, controller.update.bind(controller));

// DELETE /loans/:id - Eliminar un préstamo
// Solo valida que el ID sea un número válido
router.delete('/:id', validateId, controller.delete.bind(controller));

// Exportar el router para ser usado en la aplicación principal
module.exports = router;