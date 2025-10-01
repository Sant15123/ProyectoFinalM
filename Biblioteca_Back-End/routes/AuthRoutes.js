/**
 * Definición de rutas para la autenticación de usuarios
 *
 * Este archivo configura las rutas HTTP relacionadas con registro, login
 * y gestión de sesiones usando JWT para autenticación segura.
 *
 * @module routes/AuthRoutes
 */

// Importaciones necesarias
const express = require('express');                                    // Framework Express
const AuthController = require('../controllers/AuthController');     // Controlador de Auth

// Crear instancia del router de Express
const router = express.Router();

// Crear instancia del controlador
const authController = new AuthController();

// Conectar a MongoDB al inicializar las rutas
(async () => {
    await authController.connect();
})();

// ===== DEFINICIÓN DE RUTAS DE AUTENTICACIÓN =====

// POST /auth/register - Registrar un nuevo usuario
router.post('/register', authController.register.bind(authController));

// POST /auth/login - Iniciar sesión
router.post('/login', authController.login.bind(authController));

// GET /auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', authController.authenticateToken.bind(authController), authController.getProfile.bind(authController));

// Middleware de autenticación para rutas protegidas
const authenticateToken = authController.authenticateToken.bind(authController);

// Exportar el router y el middleware
module.exports = {
    router,
    authenticateToken
};