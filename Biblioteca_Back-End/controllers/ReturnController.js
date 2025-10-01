/**
 * Controlador para manejar las operaciones CRUD de las devoluciones
 *
 * Esta clase actúa como intermediario entre las rutas HTTP y la capa de datos,
 * manejando la lógica de negocio y coordinando las operaciones con MongoDB.
 * Implementa el patrón de controlador en la arquitectura MVC.
 *
 * @class ReturnController
 * @version 1.0.0
 */
const MongoConnection = require('../models/MongoConnection');
const Return = require('../models/Return');

class ReturnController {
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
     * Maneja la solicitud GET para obtener todas las devoluciones
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getAll(req, res, next) {
        try {
            // Obtener todas las devoluciones de la base de datos
            const returns = await this.mongo.getAllReturns();

            // Enviar respuesta JSON con todas las devoluciones
            res.json(returns);
        } catch (error) {
            // Pasar error al middleware de manejo de errores
            next(error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener una devolución específica por ID
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getById(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Obtener todas las devoluciones y buscar la específica
            const returns = await this.mongo.getAllReturns();
            const returnItem = returns.find(r => r.id === id);

            // Si no se encuentra la devolución, devolver error 404
            if (!returnItem) {
                return res.status(404).json({ error: 'Devolución no encontrada' });
            }

            // Enviar la devolución encontrada
            res.json(returnItem);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud POST para crear una nueva devolución
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async create(req, res, next) {
        try {
            // Extraer datos del cuerpo de la solicitud
            const { userName, bookTitle, borrowDate, returnDate, actualReturnDate, condition, notes, fine } = req.body;

            // Validar que los campos requeridos estén presentes
            if (!userName || !bookTitle || !actualReturnDate) {
                return res.status(400).json({ error: 'Los campos userName, bookTitle y actualReturnDate son requeridos' });
            }

            // Calcular si la devolución es tardía y los días de retraso
            const expectedDate = new Date(returnDate);
            const actualDate = new Date(actualReturnDate);
            const isLate = actualDate > expectedDate;
            const daysLate = isLate ? Math.ceil((actualDate - expectedDate) / (1000 * 60 * 60 * 24)) : 0;
            const calculatedFine = isLate ? daysLate * 1500 : (fine || 0); // $1,500 COP por día o usar el valor proporcionado

            // Obtener todas las devoluciones para calcular el nuevo ID
            const returns = await this.mongo.getAllReturns();
            const newId = returns.length > 0 ? Math.max(...returns.map(r => r.id)) + 1 : 1;

            // Crear nueva instancia de Return
            const newReturn = new Return(
                newId,
                userName,
                bookTitle,
                borrowDate,
                returnDate,
                actualReturnDate,
                condition || "Excelente",
                notes || "",
                calculatedFine,
                isLate,
                daysLate
            );

            // Insertar en la base de datos
            await this.mongo.insertReturn(newReturn);

            // Enviar respuesta con código 201 (Created)
            res.status(201).json(newReturn);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud PUT para actualizar una devolución existente
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
            const { userName, bookTitle, borrowDate, returnDate, actualReturnDate, condition, notes, fine } = req.body;

            // Construir objeto con solo los campos a actualizar
            const updateData = {};
            if (userName !== undefined) updateData.userName = userName;
            if (bookTitle !== undefined) updateData.bookTitle = bookTitle;
            if (borrowDate !== undefined) updateData.borrowDate = borrowDate;
            if (returnDate !== undefined) updateData.returnDate = returnDate;
            if (actualReturnDate !== undefined) updateData.actualReturnDate = actualReturnDate;
            if (condition !== undefined) updateData.condition = condition;
            if (notes !== undefined) updateData.notes = notes;
            if (fine !== undefined) updateData.fine = fine;

            // Recalcular campos derivados si se actualizan las fechas
            if (returnDate && actualReturnDate) {
                const expectedDate = new Date(returnDate);
                const actualDate = new Date(actualReturnDate);
                updateData.isLate = actualDate > expectedDate;
                updateData.daysLate = updateData.isLate ? Math.ceil((actualDate - expectedDate) / (1000 * 60 * 60 * 24)) : 0;
                if (updateData.isLate && !fine) {
                    updateData.fine = updateData.daysLate * 1500;
                }
            }

            // Actualizar en la base de datos
            const result = await this.mongo.updateReturn(id, updateData);

            // Verificar si se actualizó algún documento
            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Devolución no encontrada' });
            }

            // Obtener y devolver la devolución actualizada
            const returns = await this.mongo.getAllReturns();
            const updatedReturn = returns.find(r => r.id === id);
            res.json(updatedReturn);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud DELETE para eliminar una devolución
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async delete(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Eliminar la devolución de la base de datos
            const result = await this.mongo.deleteReturn(id);

            // Verificar si se eliminó algún documento
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Devolución no encontrada' });
            }

            // Enviar respuesta 204 (No Content) sin cuerpo
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ReturnController;