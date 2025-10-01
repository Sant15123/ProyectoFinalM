/**
 * Controlador para manejar las operaciones CRUD de las tareas ToDo
 *
 * Esta clase actúa como intermediario entre las rutas HTTP y la capa de datos,
 * manejando la lógica de negocio y coordinando las operaciones con MongoDB.
 * Implementa el patrón de controlador en la arquitectura MVC.
 *
 * @class ToDoController
 * @version 1.0.0
 */
const MongoConnection = require('../models/MongoConnection');
const ToDo = require('../models/ToDo');

class ToDoController {
    /**
     * Constructor del controlador
     * Inicializa la instancia de conexión a MongoDB
     */
    constructor() {
        this.mongo = new MongoConnection();
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
     * Maneja la solicitud GET para obtener todas las tareas
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getAll(req, res, next) {
        try {
            // Obtener todas las tareas de la base de datos
            const todos = await this.mongo.getAllToDos();

            // Enviar respuesta JSON con todas las tareas
            res.json(todos);
        } catch (error) {
            // Pasar error al middleware de manejo de errores
            next(error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener una tarea específica por ID
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getById(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Obtener todas las tareas y buscar la específica
            const todos = await this.mongo.getAllToDos();
            const todo = todos.find(t => t.id === id);

            // Si no se encuentra la tarea, devolver error 404
            if (!todo) {
                return res.status(404).json({ error: 'ToDo no encontrado' });
            }

            // Enviar la tarea encontrada
            res.json(todo);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud POST para crear una nueva tarea
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async create(req, res, next) {
        try {
            // Extraer datos del cuerpo de la solicitud
            const { title, completed = false } = req.body;

            // Validar que el título esté presente
            if (!title) {
                return res.status(400).json({ error: 'El título es requerido' });
            }

            // Obtener todas las tareas para calcular el nuevo ID
            const todos = await this.mongo.getAllToDos();
            const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;

            // Crear nueva instancia de ToDo
            const newToDo = new ToDo(newId, title, completed);

            // Insertar en la base de datos
            await this.mongo.insertToDo(newToDo);

            // Enviar respuesta con código 201 (Created)
            res.status(201).json(newToDo);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud PUT para actualizar una tarea existente
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async update(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Extraer datos del cuerpo de la solicitud
            const { title, completed } = req.body;

            // Construir objeto con solo los campos a actualizar
            const updateData = {};
            if (title !== undefined) updateData.title = title;
            if (completed !== undefined) updateData.completed = completed;

            // Actualizar en la base de datos
            const result = await this.mongo.updateToDo(id, updateData);

            // Verificar si se actualizó algún documento
            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'ToDo no encontrado' });
            }

            // Obtener y devolver la tarea actualizada
            const todos = await this.mongo.getAllToDos();
            const updatedTodo = todos.find(t => t.id === id);
            res.json(updatedTodo);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud DELETE para eliminar una tarea
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async delete(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Eliminar la tarea de la base de datos
            const result = await this.mongo.deleteToDo(id);

            // Verificar si se eliminó algún documento
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'ToDo no encontrado' });
            }

            // Enviar respuesta 204 (No Content) sin cuerpo
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ToDoController;