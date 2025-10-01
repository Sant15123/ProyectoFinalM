/**
 * Clase modelo que representa un usuario en la aplicación de biblioteca
 *
 * Esta clase implementa el patrón de encapsulación usando campos privados
 * (#) y proporciona getters/setters para acceder y modificar los datos.
 * Representa la estructura básica de un usuario con sus propiedades.
 *
 * @class User
 * @version 1.0.0
 */
class User {
    /** @private Campo privado para el ID único del usuario */
    #id;

    /** @private Campo privado para el nombre del usuario */
    #name;

    /** @private Campo privado para el apellido del usuario */
    #lastName;

    /** @private Campo privado para el teléfono */
    #phone;

    /** @private Campo privado para el email */
    #email;

    /** @private Campo privado para la fecha de nacimiento */
    #birthDate;

    /** @private Campo privado para el género */
    #gender;

    /** @private Campo privado para la fecha de creación */
    #createdAt;

    /** @private Campo privado para el rol del usuario */
    #role;

    /** @private Campo privado para la contraseña hasheada */
    #password;

    /**
     * Constructor de la clase User
     *
     * @param {number} id - Identificador único del usuario
     * @param {string} name - Nombre del usuario
     * @param {string} lastName - Apellido del usuario
     * @param {string} phone - Número de teléfono
     * @param {string} email - Email del usuario
     * @param {string} birthDate - Fecha de nacimiento (formato YYYY-MM-DD)
     * @param {string} gender - Género del usuario
     * @param {string} role - Rol del usuario (admin, reader)
     * @param {string} password - Contraseña hasheada (opcional)
     * @param {string} createdAt - Fecha de creación (ISO string)
     */
    constructor(id, name, lastName = '', phone = '', email = '', birthDate = '', gender = '', role = 'reader', password = '', createdAt = new Date().toISOString()) {
        this.#id = id;
        this.#name = name;
        this.#lastName = lastName;
        this.#phone = phone;
        this.#email = email;
        this.#birthDate = birthDate;
        this.#gender = gender;
        this.#role = role;
        this.#password = password;
        this.#createdAt = createdAt;
    }

    // Getters
    get id() { return this.#id; }
    get name() { return this.#name; }
    get lastName() { return this.#lastName; }
    get phone() { return this.#phone; }
    get email() { return this.#email; }
    get birthDate() { return this.#birthDate; }
    get gender() { return this.#gender; }
    get role() { return this.#role; }
    get password() { return this.#password; }
    get createdAt() { return this.#createdAt; }

    // Setters
    set id(value) { this.#id = value; }
    set name(value) { this.#name = value; }
    set lastName(value) { this.#lastName = value; }
    set phone(value) { this.#phone = value; }
    set email(value) { this.#email = value; }
    set birthDate(value) { this.#birthDate = value; }
    set gender(value) { this.#gender = value; }
    set role(value) { this.#role = value; }
    set password(value) { this.#password = value; }
    set createdAt(value) { this.#createdAt = value; }
}

module.exports = User;