
// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = 'http://localhost:3001';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validaciones
      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      if (formData.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      if (!formData.name || !formData.email) {
        setError("El nombre y email son requeridos");
        return;
      }

      // Preparar datos para enviar al backend
      const userData = {
        name: formData.name,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        birthDate: formData.birthDate,
        gender: formData.gender,
        role: "reader" // Por defecto, todos los registros son lectores
      };

      // Enviar datos al backend de autenticación
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          password: formData.password // Incluir contraseña para registro
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar usuario');
      }

      const data = await response.json();

      // Guardar token JWT y datos del usuario
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      }

      setSuccess("¡Registro exitoso! Has sido autenticado automáticamente.");

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.message);
      console.error('Error en registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card register-card">
        <h1>Crear Cuenta</h1>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lastName">Apellido</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="birthDate">Fecha de Nacimiento</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="gender">Género</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{ padding: '0.75rem', border: '2px solid #bcaaa4', borderRadius: '6px', backgroundColor: '#fff8e1', fontSize: '1rem' }}
              >
                <option value="">Seleccionar Género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;