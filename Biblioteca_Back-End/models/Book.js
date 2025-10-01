/**
 * Clase modelo que representa un libro en la aplicación de biblioteca
 *
 * Esta clase implementa el patrón de encapsulación usando campos privados
 * (#) y proporciona getters/setters para acceder y modificar los datos.
 * Representa la estructura básica de un libro con sus propiedades.
 *
 * @class Book
 * @version 1.0.0
 */
class Book {
    /** @private Campo privado para el ID único del libro */
    #id;

    /** @private Campo privado para el título del libro */
    #title;

    /** @private Campo privado para el autor del libro */
    #author;

    /** @private Campo privado para el año de publicación */
    #year;

    /** @private Campo privado para la editorial */
    #publisher;

    /** @private Campo privado para el ISBN */
    #isbn;

    /** @private Campo privado para el número de páginas */
    #pages;

    /** @private Campo privado para el idioma */
    #language;

    /** @private Campo privado para la fecha de publicación */
    #publicationDate;

    /** @private Campo privado para la categoría */
    #category;

    /** @private Campo privado para la descripción */
    #description;

    /** @private Campo privado para las copias disponibles */
    #availableCopies;

    /** @private Campo privado para la URL de la imagen */
    #image;

    /**
     * Constructor de la clase Book
     *
     * @param {number} id - Identificador único del libro
     * @param {string} title - Título del libro
     * @param {string} author - Autor del libro
     * @param {number} year - Año de publicación
     * @param {string} publisher - Editorial
     * @param {string} isbn - ISBN del libro
     * @param {number} pages - Número de páginas
     * @param {string} language - Idioma del libro
     * @param {string} publicationDate - Fecha de publicación (formato YYYY-MM-DD)
     * @param {string} category - Categoría del libro
     * @param {string} description - Descripción del libro
     * @param {number} availableCopies - Número de copias disponibles
     * @param {string} image - URL de la portada del libro
     */
    constructor(id, title, author, year = null, publisher = '', isbn = '', pages = 0, language = '', publicationDate = '', category = '', description = '', availableCopies = 0, image = '') {
        this.#id = id;
        this.#title = title;
        this.#author = author;
        this.#year = year;
        this.#publisher = publisher;
        this.#isbn = isbn;
        this.#pages = pages;
        this.#language = language;
        this.#publicationDate = publicationDate;
        this.#category = category;
        this.#description = description;
        this.#availableCopies = availableCopies;
        this.#image = image;
    }

    // Getters
    get id() { return this.#id; }
    get title() { return this.#title; }
    get author() { return this.#author; }
    get year() { return this.#year; }
    get publisher() { return this.#publisher; }
    get isbn() { return this.#isbn; }
    get pages() { return this.#pages; }
    get language() { return this.#language; }
    get publicationDate() { return this.#publicationDate; }
    get category() { return this.#category; }
    get description() { return this.#description; }
    get availableCopies() { return this.#availableCopies; }
    get image() { return this.#image; }

    // Setters
    set id(value) { this.#id = value; }
    set title(value) { this.#title = value; }
    set author(value) { this.#author = value; }
    set year(value) { this.#year = value; }
    set publisher(value) { this.#publisher = value; }
    set isbn(value) { this.#isbn = value; }
    set pages(value) { this.#pages = value; }
    set language(value) { this.#language = value; }
    set publicationDate(value) { this.#publicationDate = value; }
    set category(value) { this.#category = value; }
    set description(value) { this.#description = value; }
    set availableCopies(value) { this.#availableCopies = value; }
    set image(value) { this.#image = value; }
}

module.exports = Book;