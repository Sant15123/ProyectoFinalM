/**
 * Definición de rutas para las operaciones de actividades del sistema
 *
 * Este archivo configura todas las rutas HTTP relacionadas con las actividades,
 * permitiendo consultar el historial de actividades del sistema.
 *
 * @module routes/ActivityRoutes
 */

const express = require('express');
const ActivityController = require('../controllers/ActivityController');

const router = express.Router();
const controller = new ActivityController();

// Conectar a MongoDB al inicializar las rutas
(async () => {
    await controller.connect();
})();

// ===== DEFINICIÓN DE RUTAS =====

// GET /activities/recent - Obtener actividades recientes
// Query params: limit (opcional, default: 10)
router.get('/recent', controller.getRecent.bind(controller));

// GET /activities/type/:type - Obtener actividades por tipo
// Query params: limit (opcional, default: 20)
router.get('/type/:type', controller.getByType.bind(controller));

// GET /activities/user/:userId - Obtener actividades de un usuario
// Query params: limit (opcional, default: 20)
router.get('/user/:userId', controller.getUserActivity.bind(controller));

// GET /activities - Alias para actividades recientes
router.get('/', controller.getRecent.bind(controller));

module.exports = router;