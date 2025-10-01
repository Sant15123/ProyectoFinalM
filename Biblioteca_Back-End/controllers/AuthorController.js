/**
 * Controlador para manejar las operaciones CRUD de los autores
 *
 * Esta clase actúa como intermediario entre las rutas HTTP y la capa de datos,
 * manejando la lógica de negocio y coordinando las operaciones con MongoDB.
 * Implementa el patrón de controlador en la arquitectura MVC.
 *
 * @class AuthorController
 * @version 1.0.0
 */
const MongoConnection = require('../models/MongoConnection');
const Author = require('../models/Author');
const Activity = require('../models/Activity');
const ActivityController = require('./ActivityController');

class AuthorController {
    /**
     * Constructor del controlador
     * Inicializa la instancia de conexión a MongoDB
     */
    constructor() {
        this.mongo = new MongoConnection();
        this.collectionName = 'authors';
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
        // Inicializar autores por defecto si la colección está vacía
        await this.initializeDefaultAuthors();
    }

    /**
     * Inicializa autores por defecto si la colección está vacía
     *
     * @async
     * @returns {Promise<void>}
     */
    async initializeDefaultAuthors() {
        try {
            const collection = await this.mongo.getCollection(this.collectionName);
            const authorCount = await collection.countDocuments();

            if (authorCount === 0) {
                const defaultAuthors = [
                    {
                        id: 1,
                        name: "Gabriel García",
                        lastName: "Márquez",
                        bio: "Premio Nobel de Literatura, conocido por su realismo mágico",
                        birthDate: "1927-03-06",
                        nationality: "Colombiano",
                        awards: ["Premio Nobel de Literatura", "Premio Rómulo Gallegos", "Premio Cervantes"],
                        website: "https://gabrielgarciamarquez.com",
                        publishedBooks: 25,
                        image: "https://content-historia.nationalgeographic.com.es/medio/2021/03/05/captura-de-pantalla-2021-03-05-a-las-114744_ee7981da_550x696.png",
                        books: ["Cien años de soledad", "El amor en los tiempos del cólera", "Crónica de una muerte anunciada"],
                        genres: ["Realismo mágico", "Novela", "Ficción"]
                    },
                    {
                        id: 2,
                        name: "Isabel",
                        lastName: "Allende",
                        bio: "Escritora chilena, autora de bestsellers internacionales",
                        birthDate: "1942-08-02",
                        nationality: "Chilena",
                        awards: ["Premio Nacional de Literatura de Chile", "Premio Biblioteca Breve"],
                        website: "https://isabelallende.com",
                        publishedBooks: 23,
                        image: "https://www.biografiasyvidas.com/biografia/a/fotos/allende_isabel.jpg",
                        books: ["La casa de los espíritus", "Paula", "El cuaderno de Maya"],
                        genres: ["Ficción", "Realismo mágico", "Autobiografía"]
                    },
                    {
                        id: 3,
                        name: "Mario",
                        lastName: "Vargas Llosa",
                        bio: "Premio Nobel de Literatura, escritor peruano",
                        birthDate: "1936-03-28",
                        nationality: "Peruano",
                        awards: ["Premio Nobel de Literatura", "Premio Cervantes", "Premio Príncipe de Asturias"],
                        website: "https://mariovargasllosa.com",
                        publishedBooks: 35,
                        image: "https://cdn.semanariolacalle.com/2025/04/Mario_vargas_llosa.jpg",
                        books: ["La ciudad y los perros", "Conversación en La Catedral", "La fiesta del chivo"],
                        genres: ["Novela", "Ensayo", "Política"]
                    }
                ];

                await collection.insertMany(defaultAuthors);
                console.log('Autores por defecto inicializados:', defaultAuthors.length);
            }
        } catch (error) {
            console.error('Error inicializando autores por defecto:', error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener todos los autores
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getAll(req, res, next) {
        try {
            // Obtener la colección específica para autores
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las autores de la base de datos
            const authors = await collection.find({}).toArray();

            // Enviar respuesta JSON con todas las autores
            res.json(authors);
        } catch (error) {
            // Pasar error al middleware de manejo de errores
            next(error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener un autor específico por ID
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getById(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Obtener la colección específica para autores
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las autores y buscar la específica
            const authors = await collection.find({}).toArray();
            const author = authors.find(a => a.id === id);

            // Si no se encuentra el autor, devolver error 404
            if (!author) {
                return res.status(404).json({ error: 'Autor no encontrado' });
            }

            // Enviar el autor encontrado
            res.json(author);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud POST para crear un nuevo autor
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async create(req, res, next) {
        try {
            // Extraer datos del cuerpo de la solicitud
            const { name, lastName, bio, birthDate, nationality, awards, website, publishedBooks, image, books, genres } = req.body;

            // Validar que el nombre esté presente
            if (!name) {
                return res.status(400).json({ error: 'El nombre es requerido' });
            }

            // Obtener la colección específica para autores
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las autores para calcular el nuevo ID
            const authors = await collection.find({}).toArray();
            const newId = authors.length > 0 ? Math.max(...authors.map(a => a.id)) + 1 : 1;

            // Crear nueva instancia de Author
            const newAuthor = new Author(newId, name, lastName, bio, birthDate, nationality, awards, website, publishedBooks, image, books, genres);

            // Insertar en la base de datos
            await collection.insertOne({
                id: newAuthor.id,
                name: newAuthor.name,
                lastName: newAuthor.lastName,
                bio: newAuthor.bio,
                birthDate: newAuthor.birthDate,
                nationality: newAuthor.nationality,
                awards: newAuthor.awards,
                website: newAuthor.website,
                publishedBooks: newAuthor.publishedBooks,
                image: newAuthor.image,
                books: newAuthor.books,
                genres: newAuthor.genres
            });

            // Registrar actividad de autor agregado
            try {
                const userName = req.user ? req.user.name : 'Sistema';
                const userId = req.user ? req.user.id : null;
                const activity = Activity.authorAdded(`${newAuthor.name} ${newAuthor.lastName}`, userName, userId);
                await this.activityController.logActivity(activity);
            } catch (activityError) {
                console.error('Error registrando actividad:', activityError);
                // No fallar la creación por error en logging de actividad
            }

            // Enviar respuesta con código 201 (Created)
            res.status(201).json(newAuthor);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud PUT para actualizar un autor existente
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
            const { name, lastName, bio, birthDate, nationality, awards, website, publishedBooks, image, books, genres } = req.body;

            // Construir objeto con solo los campos a actualizar
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (lastName !== undefined) updateData.lastName = lastName;
            if (bio !== undefined) updateData.bio = bio;
            if (birthDate !== undefined) updateData.birthDate = birthDate;
            if (nationality !== undefined) updateData.nationality = nationality;
            if (awards !== undefined) updateData.awards = awards;
            if (website !== undefined) updateData.website = website;
            if (publishedBooks !== undefined) updateData.publishedBooks = publishedBooks;
            if (image !== undefined) updateData.image = image;
            if (books !== undefined) updateData.books = books;
            if (genres !== undefined) updateData.genres = genres;

            // Obtener la colección específica para autores
            const collection = await this.mongo.getCollection(this.collectionName);

            // Actualizar en la base de datos
            const result = await collection.updateOne({ id: id }, { $set: updateData });

            // Verificar si se actualizó algún documento
            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Autor no encontrado' });
            }

            // Obtener y devolver el autor actualizado
            const authors = await collection.find({}).toArray();
            const updatedAuthor = authors.find(a => a.id === id);
            res.json(updatedAuthor);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud DELETE para eliminar un autor
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async delete(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Obtener la colección específica para autores
            const collection = await this.mongo.getCollection(this.collectionName);

            // Eliminar el autor de la base de datos
            const result = await collection.deleteOne({ id: id });

            // Verificar si se eliminó algún documento
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Autor no encontrado' });
            }

            // Enviar respuesta 204 (No Content) sin cuerpo
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthorController;