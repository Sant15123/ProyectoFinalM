/**
 * Modelo de datos para registrar actividades del sistema
 *
 * Esta clase representa una actividad o evento que ocurre en el sistema,
 * como registro de usuarios, préstamos de libros, etc.
 *
 * @class Activity
 * @version 1.0.0
 */
class Activity {
    /**
     * Constructor de la clase Activity
     *
     * @param {string} type - Tipo de actividad (user_registered, book_added, loan_created, loan_returned)
     * @param {string} description - Descripción detallada de la actividad
     * @param {Object} metadata - Datos adicionales relacionados con la actividad
     * @param {string} userId - ID del usuario que realizó la actividad (opcional)
     * @param {string} userName - Nombre del usuario que realizó la actividad
     * @param {Date} timestamp - Fecha y hora de la actividad
     */
    constructor(type, description, metadata = {}, userId = null, userName = 'Sistema') {
        this.type = type;
        this.description = description;
        this.metadata = metadata;
        this.userId = userId;
        this.userName = userName;
        this.timestamp = timestamp || new Date();
        this.id = null; // Se asignará cuando se guarde en la base de datos
    }

    /**
     * Convierte la actividad a un formato compatible con MongoDB
     *
     * @returns {Object} Objeto compatible con MongoDB
     */
    toDocument() {
        return {
            type: this.type,
            description: this.description,
            metadata: this.metadata,
            userId: this.userId,
            userName: this.userName,
            timestamp: this.timestamp,
            createdAt: new Date()
        };
    }

    /**
     * Crea una actividad de registro de usuario
     *
     * @param {string} userName - Nombre del usuario registrado
     * @param {string} userEmail - Email del usuario registrado
     * @returns {Activity} Nueva instancia de Activity
     */
    static userRegistered(userName, userEmail) {
        return new Activity(
            'user_registered',
            `Nuevo usuario registrado: ${userName}`,
            { email: userEmail },
            null,
            'Sistema'
        );
    }

    /**
     * Crea una actividad de libro agregado
     *
     * @param {string} bookTitle - Título del libro agregado
     * @param {string} bookAuthor - Autor del libro
     * @param {string} userName - Nombre del usuario que agregó el libro
     * @param {string} userId - ID del usuario que agregó el libro
     * @returns {Activity} Nueva instancia de Activity
     */
    static bookAdded(bookTitle, bookAuthor, userName, userId) {
        return new Activity(
            'book_added',
            `Libro agregado: "${bookTitle}" por ${bookAuthor}`,
            { bookTitle, bookAuthor },
            userId,
            userName
        );
    }

    /**
     * Crea una actividad de préstamo realizado
     *
     * @param {string} bookTitle - Título del libro prestado
     * @param {string} borrowerName - Nombre del usuario que recibió el préstamo
     * @param {string} userName - Nombre del usuario que realizó el préstamo
     * @param {string} userId - ID del usuario que realizó el préstamo
     * @returns {Activity} Nueva instancia de Activity
     */
    static loanCreated(bookTitle, borrowerName, userName, userId) {
        return new Activity(
            'loan_created',
            `Préstamo realizado: "${bookTitle}" a ${borrowerName}`,
            { bookTitle, borrowerName },
            userId,
            userName
        );
    }

    /**
     * Crea una actividad de libro devuelto
     *
     * @param {string} bookTitle - Título del libro devuelto
     * @param {string} borrowerName - Nombre del usuario que devolvió el libro
     * @param {string} userName - Nombre del usuario que registró la devolución
     * @param {string} userId - ID del usuario que registró la devolución
     * @returns {Activity} Nueva instancia de Activity
     */
    static loanReturned(bookTitle, borrowerName, userName, userId) {
        return new Activity(
            'loan_returned',
            `Libro devuelto: "${bookTitle}" por ${borrowerName}`,
            { bookTitle, borrowerName },
            userId,
            userName
        );
    }

    /**
     * Crea una actividad de autor agregado
     *
     * @param {string} authorName - Nombre del autor agregado
     * @param {string} userName - Nombre del usuario que agregó el autor
     * @param {string} userId - ID del usuario que agregó el autor
     * @returns {Activity} Nueva instancia de Activity
     */
    static authorAdded(authorName, userName, userId) {
        return new Activity(
            'author_added',
            `Autor agregado: ${authorName}`,
            { authorName },
            userId,
            userName
        );
    }
}

module.exports = Activity;