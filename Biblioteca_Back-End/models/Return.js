/**
 * Modelo de datos que representa una devolución de libro en la aplicación
 *
 * Esta clase implementa el patrón de encapsulación usando campos privados
 * (#) y proporciona getters/setters para acceder y modificar los datos.
 * Representa la estructura básica de una devolución con información
 * del usuario, libro, fechas y condición del libro devuelto.
 *
 * @class Return
 * @version 1.0.0
 */
class Return {
    /** @private Campo privado para el ID único de la devolución */
    #id;

    /** @private Campo privado para el nombre del usuario */
    #userName;

    /** @private Campo privado para el título del libro */
    #bookTitle;

    /** @private Campo privado para la fecha de préstamo */
    #borrowDate;

    /** @private Campo privado para la fecha esperada de devolución */
    #returnDate;

    /** @private Campo privado para la fecha real de devolución */
    #actualReturnDate;

    /** @private Campo privado para la condición del libro */
    #condition;

    /** @private Campo privado para las notas adicionales */
    #notes;

    /** @private Campo privado para la multa calculada */
    #fine;

    /** @private Campo privado para indicar si la devolución fue tardía */
    #isLate;

    /** @private Campo privado para los días de retraso */
    #daysLate;

    /**
     * Constructor de la clase Return
     *
     * @param {number} id - Identificador único de la devolución
     * @param {string} userName - Nombre completo del usuario
     * @param {string} bookTitle - Título del libro devuelto
     * @param {string} borrowDate - Fecha de préstamo (formato YYYY-MM-DD)
     * @param {string} returnDate - Fecha esperada de devolución (formato YYYY-MM-DD)
     * @param {string} actualReturnDate - Fecha real de devolución (formato YYYY-MM-DD)
     * @param {string} condition - Condición del libro (Excelente, Muy Bueno, Bueno, Regular, Malo, Dañado)
     * @param {string} notes - Notas adicionales sobre la devolución
     * @param {number} fine - Multa calculada por retraso
     * @param {boolean} isLate - Indica si la devolución fue tardía
     * @param {number} daysLate - Número de días de retraso
     */
    constructor(id, userName, bookTitle, borrowDate, returnDate, actualReturnDate,
                condition = "Excelente", notes = "", fine = 0, isLate = false, daysLate = 0) {
        this.#id = id;
        this.#userName = userName;
        this.#bookTitle = bookTitle;
        this.#borrowDate = borrowDate;
        this.#returnDate = returnDate;
        this.#actualReturnDate = actualReturnDate;
        this.#condition = condition;
        this.#notes = notes;
        this.#fine = fine;
        this.#isLate = isLate;
        this.#daysLate = daysLate;
    }

    /**
     * Getter para obtener el ID de la devolución
     * @returns {number} El ID único de la devolución
     */
    get id() {
        return this.#id;
    }

    /**
     * Setter para modificar el ID de la devolución
     * @param {number} value - Nuevo valor para el ID
     */
    set id(value) {
        this.#id = value;
    }

    /**
     * Getter para obtener el nombre del usuario
     * @returns {string} El nombre completo del usuario
     */
    get userName() {
        return this.#userName;
    }

    /**
     * Setter para modificar el nombre del usuario
     * @param {string} value - Nuevo nombre del usuario
     */
    set userName(value) {
        this.#userName = value;
    }

    /**
     * Getter para obtener el título del libro
     * @returns {string} El título del libro devuelto
     */
    get bookTitle() {
        return this.#bookTitle;
    }

    /**
     * Setter para modificar el título del libro
     * @param {string} value - Nuevo título del libro
     */
    set bookTitle(value) {
        this.#bookTitle = value;
    }

    /**
     * Getter para obtener la fecha de préstamo
     * @returns {string} La fecha de préstamo en formato YYYY-MM-DD
     */
    get borrowDate() {
        return this.#borrowDate;
    }

    /**
     * Setter para modificar la fecha de préstamo
     * @param {string} value - Nueva fecha de préstamo
     */
    set borrowDate(value) {
        this.#borrowDate = value;
    }

    /**
     * Getter para obtener la fecha esperada de devolución
     * @returns {string} La fecha esperada de devolución en formato YYYY-MM-DD
     */
    get returnDate() {
        return this.#returnDate;
    }

    /**
     * Setter para modificar la fecha esperada de devolución
     * @param {string} value - Nueva fecha esperada de devolución
     */
    set returnDate(value) {
        this.#returnDate = value;
    }

    /**
     * Getter para obtener la fecha real de devolución
     * @returns {string} La fecha real de devolución en formato YYYY-MM-DD
     */
    get actualReturnDate() {
        return this.#actualReturnDate;
    }

    /**
     * Setter para modificar la fecha real de devolución
     * @param {string} value - Nueva fecha real de devolución
     */
    set actualReturnDate(value) {
        this.#actualReturnDate = value;
    }

    /**
     * Getter para obtener la condición del libro
     * @returns {string} La condición del libro
     */
    get condition() {
        return this.#condition;
    }

    /**
     * Setter para modificar la condición del libro
     * @param {string} value - Nueva condición del libro
     */
    set condition(value) {
        this.#condition = value;
    }

    /**
     * Getter para obtener las notas adicionales
     * @returns {string} Las notas adicionales sobre la devolución
     */
    get notes() {
        return this.#notes;
    }

    /**
     * Setter para modificar las notas adicionales
     * @param {string} value - Nuevas notas adicionales
     */
    set notes(value) {
        this.#notes = value;
    }

    /**
     * Getter para obtener la multa calculada
     * @returns {number} La multa calculada por retraso
     */
    get fine() {
        return this.#fine;
    }

    /**
     * Setter para modificar la multa calculada
     * @param {number} value - Nueva multa calculada
     */
    set fine(value) {
        this.#fine = value;
    }

    /**
     * Getter para obtener si la devolución fue tardía
     * @returns {boolean} True si la devolución fue tardía, false en caso contrario
     */
    get isLate() {
        return this.#isLate;
    }

    /**
     * Setter para modificar si la devolución fue tardía
     * @param {boolean} value - Nuevo valor para indicar si fue tardía
     */
    set isLate(value) {
        this.#isLate = value;
    }

    /**
     * Getter para obtener los días de retraso
     * @returns {number} El número de días de retraso
     */
    get daysLate() {
        return this.#daysLate;
    }

    /**
     * Setter para modificar los días de retraso
     * @param {number} value - Nuevo número de días de retraso
     */
    set daysLate(value) {
        this.#daysLate = value;
    }
}

module.exports = Return;