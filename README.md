# Sistema de Gestión de Biblioteca

Un sistema completo de gestión de biblioteca desarrollado con tecnologías modernas de full-stack. Incluye autenticación de usuarios, gestión de libros, autores, préstamos y devoluciones, con interfaces separadas para administradores y lectores.

## 🎯 Características Principales

- **Autenticación y Autorización**: Sistema de login/registro con roles (admin/lector)
- **Gestión de Usuarios**: CRUD completo para usuarios del sistema
- **Catálogo de Libros**: Administración de libros y autores
- **Sistema de Préstamos**: Registro y seguimiento de préstamos de libros
- **Gestión de Devoluciones**: Proceso simplificado con auto-completado de datos
- **Dashboard Interactivo**: Interfaces diferenciadas para administradores y lectores
- **Tema Oscuro/Claro**: Soporte para cambio de tema
- **API RESTful**: Backend robusto con validación y manejo de errores

## 🏗️ Arquitectura del Proyecto

```
ProyectoFinalM/
├── Biblioteca_Back-End/          # API REST (Node.js + Express + MongoDB)
│   ├── controllers/              # Lógica de negocio
│   ├── models/                   # Modelos de datos y conexión MongoDB
│   ├── routes/                   # Definición de rutas API
│   ├── middlewares/              # Validaciones y manejo de errores
│   └── index.js                  # Punto de entrada del servidor
├── Biblioteca_Front-End/         # Aplicación React
│   └── rutas-auth/               # App principal con Vite
│       ├── src/
│       │   ├── components/       # Componentes reutilizables
│       │   ├── context/          # Contextos React (Auth, Theme)
│       │   ├── pages/            # Páginas de la aplicación
│       │   ├── routes/           # Configuración de rutas protegidas
│       │   └── services/         # Servicios de API
│       └── package.json
└── README.md                     # Esta documentación
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución JavaScript del lado del servidor
- **Express.js**: Framework web minimalista para APIs REST
- **MongoDB Atlas**: Base de datos NoSQL en la nube
- **bcryptjs**: Encriptación de contraseñas
- **jsonwebtoken**: Autenticación basada en tokens JWT
- **CORS**: Manejo de solicitudes cross-origin

### Frontend
- **React 19**: Biblioteca para interfaces de usuario
- **Vite**: Herramienta de construcción rápida para desarrollo moderno
- **React Router**: Navegación y enrutamiento
- **CSS Modules**: Estilos modulares y responsivos
- **Context API**: Gestión de estado global (autenticación, tema)

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta en MongoDB Atlas (para la base de datos)

### Instalación del Backend

1. **Navega al directorio del backend**
   ```bash
   cd Biblioteca_Back-End
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura MongoDB Atlas**
   - Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Crea un cluster gratuito
   - Obtén la cadena de conexión (connection string)
   - Actualiza la URI en `models/MongoConnection.js`

4. **Ejecuta el servidor backend**
   ```bash
   node index.js
   ```

   El servidor estará disponible en `http://localhost:3001`

### Instalación del Frontend

1. **Navega al directorio del frontend**
   ```bash
   cd Biblioteca_Front-End/rutas-auth
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Ejecuta la aplicación frontend**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 📖 Uso de la Aplicación

### Roles de Usuario

- **Administrador**: Acceso completo a todas las funcionalidades
  - Gestión de usuarios, autores y libros
  - Visualización de estadísticas y reportes
  - Administración de préstamos y devoluciones

- **Lector**: Acceso limitado a funcionalidades de lectura
  - Visualización del catálogo de libros
  - Consulta de préstamos personales
  - Perfil de usuario

### Funcionalidades Clave

#### Gestión de Préstamos
- Registro de nuevos préstamos con selección de usuario y libro
- Validación automática de disponibilidad de libros
- Seguimiento de fechas de préstamo y devolución esperada

#### Gestión de Devoluciones
- Interfaz inteligente que filtra libros por usuario seleccionado
- Auto-completado automático de fechas de préstamo desde el registro de préstamo
- Registro de condición del libro al devolver
- Cálculo automático de días de retraso

#### Autenticación
- Registro de nuevos usuarios
- Login seguro con JWT
- Recuperación de contraseña
- Protección de rutas según roles

## 📋 API Endpoints

### Base URL: `http://localhost:3001`

| Recurso | Método | Endpoint | Descripción | Rol Requerido |
|---------|--------|----------|-------------|---------------|
| **Autenticación** | POST | `/auth/login` | Inicio de sesión | Público |
| | POST | `/auth/register` | Registro de usuario | Público |
| | POST | `/auth/forgot-password` | Recuperar contraseña | Público |
| **Usuarios** | GET | `/users` | Obtener todos los usuarios | Admin |
| | POST | `/users` | Crear usuario | Admin |
| | PUT | `/users/:id` | Actualizar usuario | Admin |
| | DELETE | `/users/:id` | Eliminar usuario | Admin |
| **Autores** | GET | `/authors` | Obtener autores | Autenticado |
| | POST | `/authors` | Crear autor | Admin |
| | PUT | `/authors/:id` | Actualizar autor | Admin |
| | DELETE | `/authors/:id` | Eliminar autor | Admin |
| **Libros** | GET | `/books` | Obtener libros | Autenticado |
| | POST | `/books` | Crear libro | Autenticado |
| | PUT | `/books/:id` | Actualizar libro | Autenticado |
| | DELETE | `/books/:id` | Eliminar libro | Autenticado |
| **Préstamos** | GET | `/loans` | Obtener préstamos | Autenticado |
| | POST | `/loans` | Crear préstamo | Autenticado |
| | PUT | `/loans/:id` | Actualizar préstamo | Autenticado |
| | DELETE | `/loans/:id` | Eliminar préstamo | Autenticado |
| **Devoluciones** | GET | `/returns` | Obtener devoluciones | Autenticado |
| | POST | `/returns` | Crear devolución | Autenticado |
| | PUT | `/returns/:id` | Actualizar devolución | Autenticado |
| | DELETE | `/returns/:id` | Eliminar devolución | Autenticado |

## 🎨 Interfaz de Usuario

### Páginas Principales

- **Home**: Página de bienvenida con navegación
- **Login/Register**: Autenticación de usuarios
- **Dashboard**: Panel principal según rol
- **Usuarios**: Gestión de usuarios del sistema
- **Autores**: Catálogo de autores
- **Libros**: Inventario de libros disponibles
- **Préstamos**: Gestión de préstamos activos
- **Devoluciones**: Registro de devoluciones
- **Perfil**: Información del usuario actual

### Características de UI/UX

- **Responsive Design**: Adaptable a diferentes tamaños de pantalla
- **Tema Dinámico**: Cambio entre modo claro y oscuro
- **Navegación Intuitiva**: Menú lateral con acceso rápido
- **Formularios Inteligentes**: Validación en tiempo real y auto-completado
- **Feedback Visual**: Indicadores de carga, mensajes de éxito/error

## 🔧 Configuración Avanzada

### Variables de Entorno

Crea archivos `.env` en los directorios correspondientes:

**Backend (.env)**
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/biblioteca
JWT_SECRET=tu_clave_secreta_jwt
PORT=3001
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3001
```

### Personalización de Temas

Los temas se gestionan a través de variables CSS en `src/index.css`. Modifica los valores para personalizar colores, fuentes y espaciado.

## 🧪 Testing

### Ejecutar Tests

```bash
# Backend
cd Biblioteca_Back-End
npm test

# Frontend
cd Biblioteca_Front-End/rutas-auth
npm test
```

## 🚀 Despliegue

### Backend (Railway, Heroku, etc.)
1. Configura las variables de entorno en el servicio de hosting
2. Despliega el código desde el directorio `Biblioteca_Back-End`
3. Actualiza la URL de la API en el frontend

### Frontend (Vercel, Netlify, etc.)
1. Construye la aplicación: `npm run build`
2. Despliega el contenido del directorio `dist`
3. Configura la URL de la API en las variables de entorno

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- Revisa la documentación en los archivos README de cada módulo
- Consulta los comentarios en el código fuente
- Abre un issue en el repositorio

---

**¡Gracias por usar nuestro Sistema de Gestión de Biblioteca!** 📚

Este proyecto demuestra las mejores prácticas en desarrollo full-stack moderno, incluyendo arquitectura limpia, seguridad, y experiencia de usuario intuitiva.