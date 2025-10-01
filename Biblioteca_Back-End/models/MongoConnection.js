/**
 * Clase de conexión y operaciones con MongoDB Atlas
 *
 * Esta clase maneja toda la interacción con la base de datos MongoDB Atlas,
 * incluyendo conexión, desconexión y operaciones CRUD para las tareas ToDo.
 * Implementa el patrón Singleton para la gestión de la conexión.
 *
 * @class MongoConnection
 * @version 1.0.0
 */
const { MongoClient } = require('mongodb');

class MongoConnection {
    // Instancia singleton
    static instance = null;

    /**
     * Constructor de la clase MongoConnection
     * Inicializa la configuración de conexión a MongoDB Atlas
     */
    constructor() {
        // Si ya existe una instancia, devolverla
        if (MongoConnection.instance) {
            return MongoConnection.instance;
        }

        // URI de conexión a MongoDB Atlas (contiene credenciales)
        this.uri = 'mongodb+srv://sebasBD:sebas123@cluster0.afefukh.mongodb.net/ToDo?retryWrites=true&w=majority';

        // Cliente de MongoDB sin opciones SSL para testing básico
        this.client = new MongoClient(this.uri);

        // Configuración de base de datos
        this.dbName = 'ToDo';

        // Referencias a la base de datos y colección (inicializadas en connect())
        this.db = null;
        this.collections = {}; // Almacenar múltiples colecciones

        // Guardar la instancia
        MongoConnection.instance = this;
    }

    /**
     * Establece la conexión con MongoDB Atlas
     *
     * Este método debe ser llamado antes de realizar cualquier operación
     * con la base de datos. Inicializa las referencias a la base de datos
     * y colección específicas.
     *
     * @async
     * @throws {Error} Si falla la conexión a MongoDB
     * @returns {Promise<void>}
     */
    async connect() {
        try {
            // Si ya está conectado, no hacer nada
            if (this.db) {
                return;
            }

            // Establecer conexión con MongoDB Atlas
            await this.client.connect();
            console.log('Conectado a MongoDB Atlas');

            // Obtener referencia a la base de datos
            this.db = this.client.db(this.dbName);
        } catch (error) {
            console.error('Error conectando a MongoDB:', error);
            throw error;
        }
    }

    /**
     * Obtiene una colección específica
     * @param {string} collectionName - Nombre de la colección
     * @returns {Promise<Collection>} Referencia a la colección
     */
    async getCollection(collectionName) {
        // Si no hay conexión, establecerla
        if (!this.db) {
            await this.connect();
        }

        if (!this.collections[collectionName]) {
            this.collections[collectionName] = this.db.collection(collectionName);
        }

        return this.collections[collectionName];
    }

    /**
     * Inserta una nueva tarea ToDo en la base de datos
     *
     * @async
     * @param {ToDo} todo - Instancia de la clase ToDo a insertar
     * @throws {Error} Si falla la inserción
     * @returns {Promise<Object>} Resultado de la operación de inserción
     */
    async insertToDo(todo) {
        try {
            // Obtener la colección específica para ToDos
            const collection = await this.getCollection('todoList');

            // Crear documento para MongoDB usando los datos del objeto ToDo
            const doc = {
                id: todo.id,
                title: todo.title,
                completed: todo.completed
            };

            // Insertar documento en la colección
            const result = await collection.insertOne(doc);
            console.log('ToDo insertado:', result.insertedId);

            return result;
        } catch (error) {
            console.error('Error insertando ToDo:', error);
            throw error;
        }
    }

    /**
     * Obtiene todas las tareas ToDo de la base de datos
     *
     * @async
     * @throws {Error} Si falla la consulta
     * @returns {Promise<Array>} Array con todas las tareas ToDo
     */
    async getAllToDos() {
        try {
            // Obtener la colección específica para ToDos
            const collection = await this.getCollection('todoList');
            // Consultar todos los documentos de la colección
            const todos = await collection.find({}).toArray();
            console.log('ToDos obtenidos:', todos.length);

            return todos;
        } catch (error) {
            console.error('Error obteniendo ToDos:', error);
            throw error;
        }
    }

    /**
     * Actualiza una tarea ToDo existente en la base de datos
     *
     * @async
     * @param {number} id - ID de la tarea a actualizar
     * @param {Object} updateData - Objeto con los campos a actualizar
     * @throws {Error} Si falla la actualización
     * @returns {Promise<Object>} Resultado de la operación de actualización
     */
    async updateToDo(id, updateData) {
        try {
            // Obtener la colección específica para ToDos
            const collection = await this.getCollection('todoList');

            // Actualizar documento usando el operador $set
            const result = await collection.updateOne({ id: id }, { $set: updateData });
            console.log('ToDo actualizado:', result.modifiedCount);

            return result;
        } catch (error) {
            console.error('Error actualizando ToDo:', error);
            throw error;
        }
    }

    /**
     * Elimina una tarea ToDo de la base de datos
     *
     * @async
     * @param {number} id - ID de la tarea a eliminar
     * @throws {Error} Si falla la eliminación
     * @returns {Promise<Object>} Resultado de la operación de eliminación
     */
    async deleteToDo(id) {
        try {
            // Obtener la colección específica para ToDos
            const collection = await this.getCollection('todoList');

            // Eliminar documento por ID
            const result = await collection.deleteOne({ id: id });
            console.log('ToDo eliminado:', result.deletedCount);

            return result;
        } catch (error) {
            console.error('Error eliminando ToDo:', error);
            throw error;
        }
    }

    /**
     * Inserta una nueva devolución en la base de datos
     *
     * @async
     * @param {Return} returnItem - Instancia de la clase Return a insertar
     * @throws {Error} Si falla la inserción
     * @returns {Promise<Object>} Resultado de la operación de inserción
     */
    async insertReturn(returnItem) {
        try {
            // Obtener la colección específica para Returns
            const collection = await this.getCollection('returns');

            // Crear documento para MongoDB usando los datos del objeto Return
            const doc = {
                id: returnItem.id,
                userName: returnItem.userName,
                bookTitle: returnItem.bookTitle,
                borrowDate: returnItem.borrowDate,
                returnDate: returnItem.returnDate,
                actualReturnDate: returnItem.actualReturnDate,
                condition: returnItem.condition,
                notes: returnItem.notes,
                fine: returnItem.fine,
                isLate: returnItem.isLate,
                daysLate: returnItem.daysLate
            };

            // Insertar documento en la colección
            const result = await collection.insertOne(doc);
            console.log('Return insertado:', result.insertedId);

            return result;
        } catch (error) {
            console.error('Error insertando Return:', error);
            throw error;
        }
    }

    /**
     * Obtiene todas las devoluciones de la base de datos
     *
     * @async
     * @throws {Error} Si falla la consulta
     * @returns {Promise<Array>} Array con todas las devoluciones
     */
    async getAllReturns() {
        try {
            // Obtener la colección específica para Returns
            const collection = await this.getCollection('returns');
            // Consultar todos los documentos de la colección
            const returns = await collection.find({}).toArray();
            console.log('Returns obtenidos:', returns.length);

            return returns;
        } catch (error) {
            console.error('Error obteniendo Returns:', error);
            throw error;
        }
    }

    /**
     * Actualiza una devolución existente en la base de datos
     *
     * @async
     * @param {number} id - ID de la devolución a actualizar
     * @param {Object} updateData - Objeto con los campos a actualizar
     * @throws {Error} Si falla la actualización
     * @returns {Promise<Object>} Resultado de la operación de actualización
     */
    async updateReturn(id, updateData) {
        try {
            // Obtener la colección específica para Returns
            const collection = await this.getCollection('returns');

            // Actualizar documento usando el operador $set
            const result = await collection.updateOne({ id: id }, { $set: updateData });
            console.log('Return actualizado:', result.modifiedCount);

            return result;
        } catch (error) {
            console.error('Error actualizando Return:', error);
            throw error;
        }
    }

    /**
     * Elimina una devolución de la base de datos
     *
     * @async
     * @param {number} id - ID de la devolución a eliminar
     * @throws {Error} Si falla la eliminación
     * @returns {Promise<Object>} Resultado de la operación de eliminación
     */
    async deleteReturn(id) {
        try {
            // Obtener la colección específica para Returns
            const collection = await this.getCollection('returns');

            // Eliminar documento por ID
            const result = await collection.deleteOne({ id: id });
            console.log('Return eliminado:', result.deletedCount);

            return result;
        } catch (error) {
            console.error('Error eliminando Return:', error);
            throw error;
        }
    }

    /**
     * Cierra la conexión con MongoDB Atlas
     *
     * Este método debe ser llamado al finalizar la aplicación
     * para liberar recursos correctamente.
     *
     * @async
     * @returns {Promise<void>}
     */
    async close() {
        try {
            // Cerrar conexión con MongoDB
            await this.client.close();
            console.log('Conexión a MongoDB cerrada');
        } catch (error) {
            console.error('Error cerrando conexión:', error);
        }
    }
}

module.exports = MongoConnection;