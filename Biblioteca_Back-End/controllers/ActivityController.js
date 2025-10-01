/**
 * Controlador para manejar las operaciones de actividades del sistema
 *
 * Este controlador maneja el registro y consulta de actividades del sistema,
 * permitiendo auditar las operaciones realizadas por los usuarios.
 *
 * @class ActivityController
 * @version 1.0.0
 */
const MongoConnection = require('../models/MongoConnection');
const Activity = require('../models/Activity');

class ActivityController {
    /**
     * Constructor del controlador
     * Inicializa la instancia de conexión a MongoDB
     */
    constructor() {
        this.mongo = new MongoConnection();
        this.collectionName = 'activities';
    }

    /**
     * Establece la conexión con la base de datos
     *
     * @async
     * @returns {Promise<void>}
     */
    async connect() {
        await this.mongo.connect();
    }

    /**
     * Registra una nueva actividad en el sistema
     *
     * @async
     * @param {Activity} activity - Instancia de Activity a registrar
     * @returns {Promise<Object>} Resultado de la operación de inserción
     */
    async logActivity(activity) {
        try {
            const doc = activity.toDocument();
            const result = await this.mongo.collection.insertOne(doc);
            console.log('Actividad registrada:', result.insertedId);
            return result;
        } catch (error) {
            console.error('Error registrando actividad:', error);
            throw error;
        }
    }

    /**
     * Obtiene las actividades recientes del sistema
     *
     * @async
     * @param {number} limit - Número máximo de actividades a obtener (default: 10)
     * @returns {Promise<Array>} Array con las actividades recientes
     */
    async getRecentActivities(limit = 10) {
        try {
            const activities = await this.mongo.collection
                .find({})
                .sort({ timestamp: -1 })
                .limit(limit)
                .toArray();

            console.log(`${activities.length} actividades obtenidas`);
            return activities;
        } catch (error) {
            console.error('Error obteniendo actividades:', error);
            throw error;
        }
    }

    /**
     * Obtiene actividades filtradas por tipo
     *
     * @async
     * @param {string} type - Tipo de actividad a filtrar
     * @param {number} limit - Número máximo de actividades a obtener
     * @returns {Promise<Array>} Array con las actividades filtradas
     */
    async getActivitiesByType(type, limit = 20) {
        try {
            const activities = await this.mongo.collection
                .find({ type })
                .sort({ timestamp: -1 })
                .limit(limit)
                .toArray();

            return activities;
        } catch (error) {
            console.error('Error obteniendo actividades por tipo:', error);
            throw error;
        }
    }

    /**
     * Obtiene actividades de un usuario específico
     *
     * @async
     * @param {string} userId - ID del usuario
     * @param {number} limit - Número máximo de actividades a obtener
     * @returns {Promise<Array>} Array con las actividades del usuario
     */
    async getUserActivities(userId, limit = 20) {
        try {
            const activities = await this.mongo.collection
                .find({ userId })
                .sort({ timestamp: -1 })
                .limit(limit)
                .toArray();

            return activities;
        } catch (error) {
            console.error('Error obteniendo actividades del usuario:', error);
            throw error;
        }
    }

    /**
     * Maneja la solicitud GET para obtener actividades recientes
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getRecent(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const activities = await this.getRecentActivities(limit);

            res.json(activities);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener actividades por tipo
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getByType(req, res, next) {
        try {
            const { type } = req.params;
            const limit = parseInt(req.query.limit) || 20;
            const activities = await this.getActivitiesByType(type, limit);

            res.json(activities);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener actividades de un usuario
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getUserActivity(req, res, next) {
        try {
            const { userId } = req.params;
            const limit = parseInt(req.query.limit) || 20;
            const activities = await this.getUserActivities(userId, limit);

            res.json(activities);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ActivityController;