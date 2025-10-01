// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = 'http://localhost:3001';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Enviar credenciales al backend
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el login');
      }

      const data = await response.json();

      // Guardar token JWT y datos del usuario
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      // Iniciar sesión exitosamente
      login(data.user);
      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
        <div className="card">
            <h1>Iniciar Sesión</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
                <p>
                    ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                </p>
                <p>
                    ¿Olvidaste tu contraseña? <Link to="/forgot-password">Recupera tu contraseña</Link>
                </p>
            </form>
        </div>
    </div>
  );
};

export default Login;