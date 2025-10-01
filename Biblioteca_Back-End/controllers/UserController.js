/**
 * Controlador para manejar las operaciones CRUD de los usuarios
 *
 * Esta clase actúa como intermediario entre las rutas HTTP y la capa de datos,
 * manejando la lógica de negocio y coordinando las operaciones con MongoDB.
 * Implementa el patrón de controlador en la arquitectura MVC.
 *
 * @class UserController
 * @version 1.0.0
 */
const MongoConnection = require('../models/MongoConnection');
const User = require('../models/User');

class UserController {
    /**
     * Constructor del controlador
     * Inicializa la instancia de conexión a MongoDB
     */
    constructor() {
        this.mongo = new MongoConnection();
        this.collectionName = 'users';
    }

    /**
     * Establece la conexión con la base de datos
     *
     * @async
     * @returns {Promise<void>}
     */
    async connect() {
        await this.mongo.connect();
        // Inicializar usuarios por defecto si la colección está vacía
        await this.initializeDefaultUsers();
    }

    /**
     * Inicializa usuarios por defecto si la colección está vacía
     *
     * @async
     * @returns {Promise<void>}
     */
    async initializeDefaultUsers() {
        try {
            const collection = await this.mongo.getCollection(this.collectionName);
            const userCount = await collection.countDocuments();

            if (userCount === 0) {
                const defaultUsers = [
                    {
                        id: 1,
                        name: "Admin",
                        lastName: "Sistema",
                        phone: "+57 300 123 4567",
                        email: "admin@biblioteca.com",
                        birthDate: "1985-01-01",
                        gender: "Masculino",
                        role: "admin",
                        createdAt: new Date()
                    },
                    {
                        id: 2,
                        name: "Juan",
                        lastName: "Pérez",
                        phone: "+57 301 987 6543",
                        email: "juan.perez@email.com",
                        birthDate: "1990-05-15",
                        gender: "Masculino",
                        role: "reader",
                        createdAt: new Date()
                    },
                    {
                        id: 3,
                        name: "María",
                        lastName: "García",
                        phone: "+57 302 555 7890",
                        email: "maria.garcia@email.com",
                        birthDate: "1985-08-22",
                        gender: "Femenino",
                        role: "reader",
                        createdAt: new Date()
                    },
                    {
                        id: 4,
                        name: "Carlos",
                        lastName: "Rodríguez",
                        phone: "+57 303 444 3333",
                        email: "carlos.rodriguez@email.com",
                        birthDate: "1992-12-10",
                        gender: "Masculino",
                        role: "reader",
                        createdAt: new Date()
                    },
                    {
                        id: 5,
                        name: "Ana",
                        lastName: "Martínez",
                        phone: "+57 304 777 8888",
                        email: "ana.martinez@email.com",
                        birthDate: "1988-03-28",
                        gender: "Femenino",
                        role: "reader",
                        createdAt: new Date()
                    },
                    {
                        id: 6,
                        name: "Luis",
                        lastName: "Sánchez",
                        phone: "+57 305 111 2222",
                        email: "luis.sanchez@email.com",
                        birthDate: "1995-07-14",
                        gender: "Masculino",
                        role: "reader",
                        createdAt: new Date()
                    }
                ];

                await collection.insertMany(defaultUsers);
                console.log('Usuarios por defecto inicializados:', defaultUsers.length);
            }
        } catch (error) {
            console.error('Error inicializando usuarios por defecto:', error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener todos los usuarios
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getAll(req, res, next) {
        try {
            // Obtener la colección específica para usuarios
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las usuarios de la base de datos
            const users = await collection.find({}).toArray();

            // Enviar respuesta JSON con todas las usuarios
            res.json(users);
        } catch (error) {
            // Pasar error al middleware de manejo de errores
            next(error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener un usuario específico por ID
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getById(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Obtener la colección específica para usuarios
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las usuarios y buscar la específica
            const users = await collection.find({}).toArray();
            const user = users.find(u => u.id === id);

            // Si no se encuentra el usuario, devolver error 404
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Enviar el usuario encontrado
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud POST para crear un nuevo usuario
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async create(req, res, next) {
        try {
            // Extraer datos del cuerpo de la solicitud
            const { name, lastName, phone, email, birthDate, gender, role } = req.body;

            // Validar que el nombre y email estén presentes
            if (!name || !email) {
                return res.status(400).json({ error: 'El nombre y email son requeridos' });
            }

            // Validar rol si está presente
            if (role && !['admin', 'reader'].includes(role)) {
                return res.status(400).json({ error: 'El rol debe ser "admin" o "reader"' });
            }

            // Obtener la colección específica para usuarios
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las usuarios para calcular el nuevo ID
            const users = await collection.find({}).toArray();
            const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

            // Crear nueva instancia de User
            const newUser = new User(newId, name, lastName, phone, email, birthDate, gender, role);

            // Insertar en la base de datos (sin contraseña - se maneja en AuthController)
            await collection.insertOne({
                id: newUser.id,
                name: newUser.name,
                lastName: newUser.lastName,
                phone: newUser.phone,
                email: newUser.email,
                birthDate: newUser.birthDate,
                gender: newUser.gender,
                role: newUser.role,
                createdAt: newUser.createdAt
            });

            // Enviar respuesta con código 201 (Created)
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud PUT para actualizar un usuario existente
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
            const { name, lastName, phone, email, birthDate, gender, role } = req.body;

            // Construir objeto con solo los campos a actualizar
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (lastName !== undefined) updateData.lastName = lastName;
            if (phone !== undefined) updateData.phone = phone;
            if (email !== undefined) updateData.email = email;
            if (birthDate !== undefined) updateData.birthDate = birthDate;
            if (gender !== undefined) updateData.gender = gender;
            if (role !== undefined) updateData.role = role;

            // Obtener la colección específica para usuarios
            const collection = await this.mongo.getCollection(this.collectionName);

            // Actualizar en la base de datos
            const result = await collection.updateOne({ id: id }, { $set: updateData });

            // Verificar si se actualizó algún documento
            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Obtener y devolver el usuario actualizado
            const users = await collection.find({}).toArray();
            const updatedUser = users.find(u => u.id === id);
            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud DELETE para eliminar un usuario
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async delete(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Obtener la colección específica para usuarios
            const collection = await this.mongo.getCollection(this.collectionName);

            // Eliminar el usuario de la base de datos
            const result = await collection.deleteOne({ id: id });

            // Verificar si se eliminó algún documento
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Enviar respuesta 204 (No Content) sin cuerpo
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;