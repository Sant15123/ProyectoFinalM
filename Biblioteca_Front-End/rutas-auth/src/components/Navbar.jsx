// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout, isAdmin, isReader } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Inicio</Link>
      </div>
      <div className="nav-links">
        {!user ? (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <ThemeToggle />
          </>
        ) : (
          <>
            {isAdmin() && (
              <>
                <Link to="/users">Usuarios</Link>
                <Link to="/authors">Autores</Link>
                <Link to="/books">Libros</Link>
                <Link to="/borrow">Préstamos</Link>
                <Link to="/returns">Devoluciones</Link>
                <Link to="/dashboard">Dashboard Admin</Link>
              </>
            )}
            {isReader() && (
              <>
                <Link to="/reader-dashboard">Mis Libros</Link>
              </>
            )}
            <Link to="/profile">Perfil</Link>

            <span className="user-name">{user.name} ({user.role})</span>
            <ThemeToggle />
            <button onClick={logout}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}