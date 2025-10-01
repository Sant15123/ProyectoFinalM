/**
 * Archivo principal de la aplicación API REST Biblioteca
 *
 * Este archivo configura el servidor Express.js, integra las rutas de la API
 * y configura los middlewares globales para el manejo de errores.
 *
 * Arquitectura: MVC (Model-View-Controller) con middlewares
 * Tecnologías: Node.js, Express.js, MongoDB Atlas
 *
 * @author Estudiante de Programación Web
 * @version 1.0.0
 */

// Importaciones de módulos
const express = require('express');                    // Framework web para Node.js
const cors = require('cors');                          // Middleware CORS
const { router: authRoutes } = require('./routes/AuthRoutes'); // Rutas de autenticación
const authorRoutes = require('./routes/AuthorRoutes'); // Rutas de la API Authors
const bookRoutes = require('./routes/BookRoutes');     // Rutas de la API Books
const userRoutes = require('./routes/UserRoutes');     // Rutas de la API Users
const loanRoutes = require('./routes/LoanRoutes');     // Rutas de la API Loans
const returnRoutes = require('./routes/ReturnRoutes'); // Rutas de la API Returns
const activityRoutes = require('./routes/ActivityRoutes'); // Rutas de la API Activities
const todoRoutes = require('./routes/ToDoRoutes');     // Rutas de la API ToDo (legacy)
const errorHandler = require('./middlewares/errorHandler'); // Middleware de errores

// Configuración de la aplicación Express
const app = express();     // Instancia principal de Express
const port = 3001;         // Puerto del servidor

// Middlewares globales
app.use(cors());           // Middleware CORS para permitir requests desde el front-end
app.use(express.json());   // Middleware para parsear JSON en requests

// Configuración de rutas
// Todas las rutas relacionadas con autenticación estarán bajo /auth
app.use('/auth', authRoutes);

// Todas las rutas relacionadas con Authors estarán bajo /authors
app.use('/authors', authorRoutes);

// Todas las rutas relacionadas con Books estarán bajo /books
app.use('/books', bookRoutes);

// Todas las rutas relacionadas con Users estarán bajo /users
app.use('/users', userRoutes);

// Todas las rutas relacionadas con Loans estarán bajo /loans
app.use('/loans', loanRoutes);

// Todas las rutas relacionadas con Returns estarán bajo /returns
app.use('/returns', returnRoutes);

// Todas las rutas relacionadas con Activities estarán bajo /activities
app.use('/activities', activityRoutes);

// Todas las rutas relacionadas con ToDos estarán bajo /todos (legacy)
app.use('/todos', todoRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    console.log(`API Biblioteca disponible en:`);
    console.log(`- Auth: http://localhost:${port}/auth`);
    console.log(`- Authors: http://localhost:${port}/authors`);
    console.log(`- Books: http://localhost:${port}/books`);
    console.log(`- Users: http://localhost:${port}/users`);
    console.log(`- Loans: http://localhost:${port}/loans`);
    console.log(`- Returns: http://localhost:${port}/returns`);
    console.log(`- Activities: http://localhost:${port}/activities`);
    console.log(`- ToDos (legacy): http://localhost:${port}/todos`);
});
