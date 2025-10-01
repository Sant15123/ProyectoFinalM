/**
 * Clase modelo que representa un autor en la aplicación de biblioteca
 *
 * Esta clase implementa el patrón de encapsulación usando campos privados
 * (#) y proporciona getters/setters para acceder y modificar los datos.
 * Representa la estructura básica de un autor con sus propiedades.
 *
 * @class Author
 * @version 1.0.0
 */
class Author {
    /** @private Campo privado para el ID único del autor */
    #id;

    /** @private Campo privado para el nombre del autor */
    #name;

    /** @private Campo privado para el apellido del autor */
    #lastName;

    /** @private Campo privado para la biografía */
    #bio;

    /** @private Campo privado para la fecha de nacimiento */
    #birthDate;

    /** @private Campo privado para la nacionalidad */
    #nationality;

    /** @private Campo privado para los premios */
    #awards;

    /** @private Campo privado para el sitio web */
    #website;

    /** @private Campo privado para el número de libros publicados */
    #publishedBooks;

    /** @private Campo privado para la URL de la imagen */
    #image;

    /** @private Campo privado para los libros del autor */
    #books;

    /** @private Campo privado para los géneros literarios */
    #genres;

    /**
     * Constructor de la clase Author
     *
     * @param {number} id - Identificador único del autor
     * @param {string} name - Nombre del autor
     * @param {string} lastName - Apellido del autor
     * @param {string} bio - Biografía del autor
     * @param {string} birthDate - Fecha de nacimiento (formato YYYY-MM-DD)
     * @param {string} nationality - Nacionalidad del autor
     * @param {Array} awards - Array de premios
     * @param {string} website - Sitio web del autor
     * @param {number} publishedBooks - Número de libros publicados
     * @param {string} image - URL de la imagen del autor
     * @param {Array} books - Array de libros del autor
     * @param {Array} genres - Array de géneros literarios
     */
    constructor(id, name, lastName = '', bio = '', birthDate = '', nationality = '', awards = [], website = '', publishedBooks = 0, image = '', books = [], genres = []) {
        this.#id = id;
        this.#name = name;
        this.#lastName = lastName;
        this.#bio = bio;
        this.#birthDate = birthDate;
        this.#nationality = nationality;
        this.#awards = awards;
        this.#website = website;
        this.#publishedBooks = publishedBooks;
        this.#image = image;
        this.#books = books;
        this.#genres = genres;
    }

    // Getters
    get id() { return this.#id; }
    get name() { return this.#name; }
    get lastName() { return this.#lastName; }
    get bio() { return this.#bio; }
    get birthDate() { return this.#birthDate; }
    get nationality() { return this.#nationality; }
    get awards() { return this.#awards; }
    get website() { return this.#website; }
    get publishedBooks() { return this.#publishedBooks; }
    get image() { return this.#image; }
    get books() { return this.#books; }
    get genres() { return this.#genres; }

    // Setters
    set id(value) { this.#id = value; }
    set name(value) { this.#name = value; }
    set lastName(value) { this.#lastName = value; }
    set bio(value) { this.#bio = value; }
    set birthDate(value) { this.#birthDate = value; }
    set nationality(value) { this.#nationality = value; }
    set awards(value) { this.#awards = value; }
    set website(value) { this.#website = value; }
    set publishedBooks(value) { this.#publishedBooks = value; }
    set image(value) { this.#image = value; }
    set books(value) { this.#books = value; }
    set genres(value) { this.#genres = value; }
}

module.exports = Author;