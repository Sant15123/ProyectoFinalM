/**
 * Controlador para manejar las operaciones CRUD de los libros
 *
 * Esta clase actúa como intermediario entre las rutas HTTP y la capa de datos,
 * manejando la lógica de negocio y coordinando las operaciones con MongoDB.
 * Implementa el patrón de controlador en la arquitectura MVC.
 *
 * @class BookController
 * @version 1.0.0
 */
const MongoConnection = require('../models/MongoConnection');
const Book = require('../models/Book');
const Activity = require('../models/Activity');
const ActivityController = require('./ActivityController');

class BookController {
    /**
     * Constructor del controlador
     * Inicializa la instancia de conexión a MongoDB
     */
    constructor() {
        this.mongo = new MongoConnection();
        this.collectionName = 'books';
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
        // Inicializar libros por defecto si la colección está vacía
        await this.initializeDefaultBooks();
    }

    /**
     * Inicializa libros por defecto si la colección está vacía
     *
     * @async
     * @returns {Promise<void>}
     */
    async initializeDefaultBooks() {
        try {
            const collection = await this.mongo.getCollection(this.collectionName);
            const bookCount = await collection.countDocuments();

            if (bookCount === 0) {
                const defaultBooks = [
                    {
                        id: 1,
                        title: "Cien años de soledad",
                        author: "Gabriel García Márquez",
                        year: 1967,
                        publisher: "Editorial Sudamericana",
                        isbn: "978-84-376-0494-7",
                        pages: 471,
                        language: "Español",
                        publicationDate: "1967-05-30",
                        category: "Novela",
                        description: "Una de las obras más importantes del realismo mágico latinoamericano",
                        availableCopies: 5,
                        image: "https://www.alianzalibros.com/wp-content/uploads/2024/11/cien-anos-de-soledad.webp"
                    },
                    {
                        id: 2,
                        title: "1984",
                        author: "George Orwell",
                        year: 1949,
                        publisher: "Secker & Warburg",
                        isbn: "978-0-452-28423-4",
                        pages: 328,
                        language: "Inglés",
                        publicationDate: "1949-06-08",
                        category: "Distopía",
                        description: "Novela distópica que describe un futuro totalitario",
                        availableCopies: 3,
                        image: "https://img.perlego.com/book-covers/3768359/9788446052661.jpg"
                    },
                    {
                        id: 3,
                        title: "El principito",
                        author: "Antoine de Saint-Exupéry",
                        year: 1943,
                        publisher: "Reynal & Hitchcock",
                        isbn: "978-84-204-0100-5",
                        pages: 96,
                        language: "Francés",
                        publicationDate: "1943-04-06",
                        category: "Literatura infantil",
                        description: "Historia filosófica para niños sobre la amistad y el amor",
                        availableCopies: 8,
                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR...  <p>{selectedBook.availableCopies}</p>"
                    },
                    {
                        id: 4,
                        title: "La casa de los espíritus",
                        author: "Isabel Allende",
                        year: 1982,
                        publisher: "Editorial Plaza & Janés",
                        isbn: "978-84-01-49050-8",
                        pages: 368,
                        language: "Español",
                        publicationDate: "1982-09-15",
                        category: "Novela",
                        description: "Saga familiar que mezcla realismo mágico con historia chilena",
                        availableCopies: 4,
                        image: "https://www.planetadelibros.com/usuaris/libros/fotos/4/3/0300040300043_1.jpg"
                    },
                    {
                        id: 5,
                        title: "La ciudad y los perros",
                        author: "Mario Vargas Llosa",
                        year: 1963,
                        publisher: "Seix Barral",
                        isbn: "978-84-322-0696-9",
                        pages: 432,
                        language: "Español",
                        publicationDate: "1963-10-20",
                        category: "Novela",
                        description: "Primera novela del autor, ambientada en un colegio militar limeño",
                        availableCopies: 6,
                        image: "https://www.planetadelibros.com/usuaris/libros/fotos/4/3/0300040300043_2.jpg"
                    }
                ];

                await collection.insertMany(defaultBooks);
                console.log('Libros por defecto inicializados:', defaultBooks.length);
            }
        } catch (error) {
            console.error('Error inicializando libros por defecto:', error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener todos los libros
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getAll(req, res, next) {
        try {
            // Obtener la colección específica para libros
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las libros de la base de datos
            const books = await collection.find({}).toArray();

            // Enviar respuesta JSON con todas las libros
            res.json(books);
        } catch (error) {
            // Pasar error al middleware de manejo de errores
            next(error);
        }
    }

    /**
     * Maneja la solicitud GET para obtener un libro específico por ID
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async getById(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Obtener la colección específica para libros
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las libros y buscar la específica
            const books = await collection.find({}).toArray();
            const book = books.find(b => b.id === id);

            // Si no se encuentra el libro, devolver error 404
            if (!book) {
                return res.status(404).json({ error: 'Libro no encontrado' });
            }

            // Enviar el libro encontrado
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud POST para crear un nuevo libro
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async create(req, res, next) {
        try {
            // Extraer datos del cuerpo de la solicitud
            const { title, author, year, publisher, isbn, pages, language, publicationDate, category, description, availableCopies, image } = req.body;

            // Validar que el título y autor estén presentes
            if (!title || !author) {
                return res.status(400).json({ error: 'El título y autor son requeridos' });
            }

            // Obtener la colección específica para libros
            const collection = await this.mongo.getCollection(this.collectionName);

            // Obtener todas las libros para calcular el nuevo ID
            const books = await collection.find({}).toArray();
            const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;

            // Crear nueva instancia de Book
            const newBook = new Book(newId, title, author, year, publisher, isbn, pages, language, publicationDate, category, description, availableCopies, image);

            // Insertar en la base de datos
            await collection.insertOne({
                id: newBook.id,
                title: newBook.title,
                author: newBook.author,
                year: newBook.year,
                publisher: newBook.publisher,
                isbn: newBook.isbn,
                pages: newBook.pages,
                language: newBook.language,
                publicationDate: newBook.publicationDate,
                category: newBook.category,
                description: newBook.description,
                availableCopies: newBook.availableCopies,
                image: newBook.image
            });

            // Registrar actividad de libro agregado
            try {
                const userName = req.user ? req.user.name : 'Sistema';
                const userId = req.user ? req.user.id : null;
                const activity = Activity.bookAdded(newBook.title, newBook.author, userName, userId);
                await this.activityController.logActivity(activity);
            } catch (activityError) {
                console.error('Error registrando actividad:', activityError);
                // No fallar la creación por error en logging de actividad
            }

            // Enviar respuesta con código 201 (Created)
            res.status(201).json(newBook);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud PUT para actualizar un libro existente
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
            const { title, author, year, publisher, isbn, pages, language, publicationDate, category, description, availableCopies, image } = req.body;

            // Construir objeto con solo los campos a actualizar
            const updateData = {};
            if (title !== undefined) updateData.title = title;
            if (author !== undefined) updateData.author = author;
            if (year !== undefined) updateData.year = year;
            if (publisher !== undefined) updateData.publisher = publisher;
            if (isbn !== undefined) updateData.isbn = isbn;
            if (pages !== undefined) updateData.pages = pages;
            if (language !== undefined) updateData.language = language;
            if (publicationDate !== undefined) updateData.publicationDate = publicationDate;
            if (category !== undefined) updateData.category = category;
            if (description !== undefined) updateData.description = description;
            if (availableCopies !== undefined) updateData.availableCopies = availableCopies;
            if (image !== undefined) updateData.image = image;

            // Obtener la colección específica para libros
            const collection = await this.mongo.getCollection(this.collectionName);

            // Actualizar en la base de datos
            const result = await collection.updateOne({ id: id }, { $set: updateData });

            // Verificar si se actualizó algún documento
            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Libro no encontrado' });
            }

            // Obtener y devolver el libro actualizado
            const books = await collection.find({}).toArray();
            const updatedBook = books.find(b => b.id === id);
            res.json(updatedBook);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja la solicitud DELETE para eliminar un libro
     *
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @param {Function} next - Función para pasar al siguiente middleware
     */
    async delete(req, res, next) {
        try {
            // Convertir el parámetro de ruta a número
            const id = parseInt(req.params.id);

            // Obtener la colección específica para libros
            const collection = await this.mongo.getCollection(this.collectionName);

            // Eliminar el libro de la base de datos
            const result = await collection.deleteOne({ id: id });

            // Verificar si se eliminó algún documento
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Libro no encontrado' });
            }

            // Enviar respuesta 204 (No Content) sin cuerpo
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BookController;