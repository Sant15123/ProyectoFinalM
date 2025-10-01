/**
 * Controlador para manejar las operaciones CRUD de los préstamos
 *
 * Esta clase actúa como intermediario entre las rutas HTTP y la capa de datos,
 * manejando la lógica de negocio y coordinando las operaciones con MongoDB.
 * Implementa el patrón de controlador en la arquitectura MVC.
 *
 * @class LoanController
 * @version 1.0.0
 */
const MongoConnection = require('../models/MongoConnection');
const Loan = require('../models/Loan');
const Activity = require('../models/Activity');
const ActivityController = require('./ActivityController');

class LoanController {
    /**
     * Constructor del controlador
     * Inicializa la instancia de conexión a MongoDB
     */
    constructor() {
        this.mongo = new MongoConnection();
        this.collectionName = 'loans';
        this.activityController = new ActivityController();
    }

    /**
     * Establece la conexión con la base de datos
     *
     * @async
     * @returns {Promise<void>}
     */
    async connect() {
        await this.mongo.connect();
        // Inicializar préstamos por defecto si la colección está vacía
        await this.initializeDefaultLoans();
    }

    /**
     * Inicializa préstamos por defecto si la colección está vacía
     *
     * @async
     * @returns {Promise<void>}
     */
    async initializeDefaultLoans() {
        try {
            const collection = await this.mongo.getCollection(this.collectionName);
            const loanCount = await collection.countDocuments();

            if (loanCount === 0) {
                const defaultLoans = [
                    {
                        id: 1,
                        userName: "Juan Pérez",
                        bookTitle: "Cien años de soledad",
                        borrowDate: "2025-09-15",
                        returnDate: "2025-09-30",
                        status: "returned"
                    },
                    {
                        id: 2,
                        userName: "María García",
                        bookTitle: "1984",
                        borrowDate: "2025-09-10",
                        returnDate: "",
                        status: "borrowed"
                    },
                    {
                        id: 3,
                        userName: "Carlos Rodríguez",
                        bookTitle: "El principito",
                        borrowDate: "2025-09-20",
                        returnDate: "",
                        status: "borrowed"
                    }
                ];

                await collection.insertMany(defaultLoans);
                console.log('Préstamos por defecto inicializados:', defaultLoans.length);
            }
        } catch (error) {
            console.error('Error inicializando préstamos por defecto:', error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener todos los préstamos
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getAll(req, res, next) {
        try {
            // Obtener la colección específica para préstamos
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las préstamos de la base de datos
            const loans = await collection.find({}).toArray();

            // Enviar respuesta JSON con todas las préstamos
            res.json(loans);
        } catch (error) {
            // Pasar error al middleware de manejo de errores
            next(error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener un préstamo específico por ID
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getById(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Obtener la colección específica para préstamos
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las préstamos y buscar la específica
            const loans = await collection.find({}).toArray();
            const loan = loans.find(l => l.id === id);

            // Si no se encuentra el préstamo, devolver error 404
            if (!loan) {
                return res.status(404).json({ error: 'Préstamo no encontrado' });
            }

            // Enviar el préstamo encontrado
            res.json(loan);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud POST para crear un nuevo préstamo
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async create(req, res, next) {
        try {
            // Extraer datos del cuerpo de la solicitud
            const { userName, bookTitle, borrowDate, returnDate, status = 'borrowed' } = req.body;

            // Validar que los campos requeridos estén presentes
            if (!userName || !bookTitle || !borrowDate) {
                return res.status(400).json({ error: 'El nombre de usuario, título del libro y fecha de préstamo son requeridos' });
            }

            // Obtener la colección específica para préstamos
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las préstamos para calcular el nuevo ID
            const loans = await collection.find({}).toArray();
            const newId = loans.length > 0 ? Math.max(...loans.map(l => l.id)) + 1 : 1;

            // Crear nueva instancia de Loan
            const newLoan = new Loan(newId, userName, bookTitle, borrowDate, returnDate, status);

            // Insertar en la base de datos
            await collection.insertOne({
                id: newLoan.id,
                userName: newLoan.userName,
                bookTitle: newLoan.bookTitle,
                borrowDate: newLoan.borrowDate,
                returnDate: newLoan.returnDate,
                status: newLoan.status
            });

            // Registrar actividad de préstamo creado
            try {
                const userName = req.user ? req.user.name : 'Sistema';
                const userId = req.user ? req.user.id : null;
                const activity = Activity.loanCreated(newLoan.bookTitle, newLoan.userName, userName, userId);
                await this.activityController.logActivity(activity);
            } catch (activityError) {
                console.error('Error registrando actividad:', activityError);
                // No fallar la creación por error en logging de actividad
            }

            // Enviar respuesta con código 201 (Created)
            res.status(201).json(newLoan);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud PUT para actualizar un préstamo existente
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
            const { userName, bookTitle, borrowDate, returnDate, status } = req.body;

            // Construir objeto con solo los campos a actualizar
            const updateData = {};
            if (userName !== undefined) updateData.userName = userName;
            if (bookTitle !== undefined) updateData.bookTitle = bookTitle;
            if (borrowDate !== undefined) updateData.borrowDate = borrowDate;
            if (returnDate !== undefined) updateData.returnDate = returnDate;
            if (status !== undefined) updateData.status = status;

            // Obtener la colección específica para préstamos
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener el préstamo actual antes de actualizar
            const currentLoans = await collection.find({}).toArray();
            const currentLoan = currentLoans.find(l => l.id === id);

            if (!currentLoan) {
                return res.status(404).json({ error: 'Préstamo no encontrado' });
            }

            // Actualizar en la base de datos
            const result = await collection.updateOne({ id: id }, { $set: updateData });

            // Verificar si se actualizó algún documento
            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Préstamo no encontrado' });
            }

            // Obtener y devolver el préstamo actualizado
            const loans = await collection.find({}).toArray();
            const updatedLoan = loans.find(l => l.id === id);

            // Registrar actividad si el préstamo fue devuelto
            try {
                const wasBorrowed = currentLoan.status === 'borrowed' || !currentLoan.returnDate;
                const isNowReturned = (returnDate && returnDate !== currentLoan.returnDate) ||
                                    (status === 'returned' && currentLoan.status !== 'returned');

                if (wasBorrowed && isNowReturned) {
                    const userName = req.user ? req.user.name : 'Sistema';
                    const userId = req.user ? req.user.id : null;
                    const activity = Activity.loanReturned(updatedLoan.bookTitle, updatedLoan.userName, userName, userId);
                    await this.activityController.logActivity(activity);
                }
            } catch (activityError) {
                console.error('Error registrando actividad:', activityError);
                // No fallar la actualización por error en logging de actividad
            }

            res.json(updatedLoan);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud DELETE para eliminar un préstamo
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async delete(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Obtener la colección específica para préstamos
            const collection = await this.mongo.getCollection(this.collectionName);

            // Eliminar el préstamo de la base de datos
            const result = await collection.deleteOne({ id: id });

            // Verificar si se eliminó algún documento
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Préstamo no encontrado' });
            }

            // Enviar respuesta 204 (No Content) sin cuerpo
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = LoanController;