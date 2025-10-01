/**
 * Clase modelo que representa un préstamo en la aplicación de biblioteca
 *
 * Esta clase implementa el patrón de encapsulación usando campos privados
 * (#) y proporciona getters/setters para acceder y modificar los datos.
 * Representa la estructura básica de un préstamo con sus propiedades.
 *
 * @class Loan
 * @version 1.0.0
 */
class Loan {
    /** @private Campo privado para el ID único del préstamo */
    #id;

    /** @private Campo privado para el nombre del usuario */
    #userName;

    /** @private Campo privado para el título del libro */
    #bookTitle;

    /** @private Campo privado para la fecha de préstamo */
    #borrowDate;

    /** @private Campo privado para la fecha de devolución */
    #returnDate;

    /** @private Campo privado para el estado del préstamo */
    #status;

    /**
     * Constructor de la clase Loan
     *
     * @param {number} id - Identificador único del préstamo
     * @param {string} userName - Nombre del usuario que realiza el préstamo
     * @param {string} bookTitle - Título del libro prestado
     * @param {string} borrowDate - Fecha de préstamo (formato YYYY-MM-DD)
     * @param {string} returnDate - Fecha de devolución (formato YYYY-MM-DD)
     * @param {string} status - Estado del préstamo ('borrowed' o 'returned')
     */
    constructor(id, userName, bookTitle, borrowDate, returnDate = '', status = 'borrowed') {
        this.#id = id;
        this.#userName = userName;
        this.#bookTitle = bookTitle;
        this.#borrowDate = borrowDate;
        this.#returnDate = returnDate;
        this.#status = status;
    }

    // Getters
    get id() { return this.#id; }
    get userName() { return this.#userName; }
    get bookTitle() { return this.#bookTitle; }
    get borrowDate() { return this.#borrowDate; }
    get returnDate() { return this.#returnDate; }
    get status() { return this.#status; }

    // Setters
    set id(value) { this.#id = value; }
    set userName(value) { this.#userName = value; }
    set bookTitle(value) { this.#bookTitle = value; }
    set borrowDate(value) { this.#borrowDate = value; }
    set returnDate(value) { this.#returnDate = value; }
    set status(value) { this.#status = value; }
}

module.exports = Loan;