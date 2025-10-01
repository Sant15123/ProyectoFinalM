/**
 * Clase modelo que representa una tarea (ToDo) en la aplicación
 *
 * Esta clase implementa el patrón de encapsulación usando campos privados
 * (#) y proporciona getters/setters para acceder y modificar los datos.
 * Representa la estructura básica de una tarea con ID, título y estado.
 *
 * @class ToDo
 * @version 1.0.0
 */
class ToDo {
    /** @private Campo privado para el ID único de la tarea */
    #id;

    /** @private Campo privado para el título de la tarea */
    #title;

    /** @private Campo privado para el estado de completitud */
    #completed;

    /**
     * Constructor de la clase ToDo
     *
     * @param {number} id - Identificador único de la tarea
     * @param {string} title - Título descriptivo de la tarea
     * @param {boolean} [completed=false] - Estado de completitud (opcional, default: false)
     */
    constructor(id, title, completed = false) {
        this.#id = id;
        this.#title = title;
        this.#completed = completed;
    }

    /**
     * Getter para obtener el ID de la tarea
     *
     * @returns {number} El ID único de la tarea
     */
    get id() {
        return this.#id;
    }

    /**
     * Setter para modificar el ID de la tarea
     *
     * @param {number} value - Nuevo valor para el ID
     */
    set id(value) {
        this.#id = value;
    }

    /**
     * Getter para obtener el título de la tarea
     *
     * @returns {string} El título de la tarea
     */
    get title() {
        return this.#title;
    }

    /**
     * Setter para modificar el título de la tarea
     *
     * @param {string} value - Nuevo título para la tarea
     */
    set title(value) {
        this.#title = value;
    }

    /**
     * Getter para obtener el estado de completitud
     *
     * @returns {boolean} True si la tarea está completada, false en caso contrario
     */
    get completed() {
        return this.#completed;
    }

    /**
     * Setter para modificar el estado de completitud
     *
     * @param {boolean} value - Nuevo estado de completitud
     */
    set completed(value) {
        this.#completed = value;
    }
}

module.exports = ToDo;
