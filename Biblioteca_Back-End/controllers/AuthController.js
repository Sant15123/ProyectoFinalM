/**
 * Controlador para manejar la autenticación de usuarios
 *
 * Esta clase maneja el registro y login de usuarios, generando tokens JWT
 * para mantener sesiones seguras. Implementa hash de contraseñas con bcrypt.
 *
 * @class AuthController
 * @version 1.0.0
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const MongoConnection = require('../models/MongoConnection');
const Activity = require('../models/Activity');
const ActivityController = require('./ActivityController');

class AuthController {
    /**
     * Constructor del controlador
     * Inicializa la conexión a MongoDB y configura JWT
     */
    constructor() {
        this.mongo = new MongoConnection();
        this.collectionName = 'users';
        this.jwtSecret = process.env.JWT_SECRET || 'tu_clave_secreta_jwt';
        this.jwtExpiresIn = '24h'; // Token válido por 24 horas
        this.activityController = new ActivityController();
    }

    /**
     * Establece la conexión con la base de datos
     */
    async connect() {
        await this.mongo.connect();
    }

    /**
     * Maneja el registro de nuevos usuarios
     */
    async register(req, res, next) {
        try {
            const { name, lastName, phone, email, birthDate, gender, password, role } = req.body;

            // Validaciones
            if (!name || !email || !password) {
                return res.status(400).json({
                    error: 'Nombre, email y contraseña son requeridos'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    error: 'La contraseña debe tener al menos 6 caracteres'
                });
            }

            // Verificar si el email ya existe
            const collection = await this.mongo.getCollection(this.collectionName);
            const existingUser = await collection.findOne({ email });

            if (existingUser) {
                return res.status(409).json({
                    error: 'Ya existe un usuario con este email'
                });
            }

            // Generar ID único
            const users = await collection.find({}).toArray();
            const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

            // Hash de la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Crear usuario
            const newUser = {
                id: newId,
                name,
                lastName: lastName || '',
                phone: phone || '',
                email,
                birthDate: birthDate || '',
                gender: gender || '',
                role: role || 'reader',
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };

            // Guardar en base de datos
            await collection.insertOne(newUser);

            // Registrar actividad de usuario registrado
            try {
                const activity = Activity.userRegistered(`${newUser.name} ${newUser.lastName}`, newUser.email);
                await this.activityController.logActivity(activity);
            } catch (activityError) {
                console.error('Error registrando actividad:', activityError);
                // No fallar el registro por error en logging de actividad
            }

            // Generar token JWT (sin incluir contraseña)
            const token = jwt.sign(
                {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                },
                this.jwtSecret,
                { expiresIn: this.jwtExpiresIn }
            );

            // Responder con usuario (sin contraseña) y token
            const { password: _, ...userWithoutPassword } = newUser;
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: userWithoutPassword,
                token
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * Maneja el login de usuarios
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Validaciones
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email y contraseña son requeridos'
                });
            }

            // Buscar usuario por email
            const collection = await this.mongo.getCollection(this.collectionName);
            const user = await collection.findOne({ email });

            if (!user) {
                return res.status(401).json({
                    error: 'Credenciales incorrectas'
                });
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Credenciales incorrectas'
                });
            }

            // Generar token JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                this.jwtSecret,
                { expiresIn: this.jwtExpiresIn }
            );

            // Responder con usuario (sin contraseña) y token
            const { password: _, ...userWithoutPassword } = user;
            res.json({
                message: 'Login exitoso',
                user: userWithoutPassword,
                token
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * Middleware para verificar tokens JWT
     */
    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Token de acceso requerido' });
        }

        jwt.verify(token, this.jwtSecret, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Token inválido o expirado' });
            }

            req.user = user; // Guardar información del usuario en la request
            next();
        });
    }

    /**
     * Obtiene el perfil del usuario autenticado
     */
    async getProfile(req, res, next) {
        try {
            // req.user viene del middleware authenticateToken
            const collection = await this.mongo.getCollection(this.collectionName);
            const user = await collection.findOne({ id: req.user.id });

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Remover contraseña de la respuesta
            const { password: _, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;