// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:3001';

const Dashboard = () => {
  const { user, logout, isAdmin, isReader } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    activeLoans: 0,
    totalUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Redirect based on user role
  useEffect(() => {
    if (isReader()) {
      navigate('/reader-dashboard');
    }
  }, [user, navigate, isReader]);

  // Load statistics and activities from API
  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [booksRes, authorsRes, usersRes, loansRes] = await Promise.all([
        fetch(`${API_BASE_URL}/books`),
        fetch(`${API_BASE_URL}/authors`),
        fetch(`${API_BASE_URL}/users`),
        fetch(`${API_BASE_URL}/loans`)
      ]);

      if (!booksRes.ok || !authorsRes.ok || !usersRes.ok || !loansRes.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const [books, authors, users, loans] = await Promise.all([
        booksRes.json(),
        authorsRes.json(),
        usersRes.json(),
        loansRes.json()
      ]);

      // Calculate active loans (loans without return date)
      const activeLoans = loans.filter(loan => !loan.returnDate || loan.status === 'borrowed').length;

      setStats({
        totalBooks: books.length,
        totalAuthors: authors.length,
        activeLoans: activeLoans,
        totalUsers: users.length
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: "Agregar Libro", icon: "📚", path: "/books", color: "#f57c00" },
    { title: "Ver Préstamos", icon: "📖", path: "/borrow", color: "#7b1fa2" },
    { title: "Gestionar Autores", icon: "✍️", path: "/authors", color: "#689f38" },
    { title: "Administrar Usuarios", icon: "👥", path: "/users", color: "#8d6e63" }
  ];

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/recent?limit=10`);
      if (!response.ok) {
        throw new Error('Error al cargar actividades recientes');
      }
      const activities = await response.json();

      // Transform activities to display format
      const formattedActivities = activities.map(activity => ({
        action: getActivityActionText(activity.type),
        details: activity.description,
        time: formatTimeAgo(activity.timestamp)
      }));

      setRecentActivity(formattedActivities);
    } catch (err) {
      console.error('Error fetching recent activities:', err);
      // Fallback to empty array if API fails
      setRecentActivity([]);
    }
  };

  const getActivityActionText = (type) => {
    const actionMap = {
      'user_registered': 'Usuario registrado',
      'book_added': 'Libro agregado',
      'loan_created': 'Nuevo préstamo',
      'loan_returned': 'Libro devuelto',
      'author_added': 'Autor agregado'
    };
    return actionMap[type] || type;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMs = now - activityTime;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Hace menos de un minuto';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;

    return activityTime.toLocaleDateString();
  };

  return (
    <div className="container">
      <div className="card">
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Dashboard de Biblioteca</h1>
          <p style={{ fontSize: '1.1rem', color: '#5d4037' }}>
            Bienvenido de vuelta, <strong>{user?.name || user?.username}</strong>!
          </p>
          <p style={{ fontSize: '0.9rem', color: '#8d6e63' }}>
            Miembro desde: {new Date(user?.createdAt).toLocaleDateString()}
          </p>
          {loading && <p>Cargando estadísticas...</p>}
          {error && <p className="error">Error: {error}</p>}
        </header>

        {/* Statistics Cards */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Estadísticas Generales</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#fff8e1', borderRadius: '8px', border: '2px solid #f57c00' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f57c00' }}>{stats.totalBooks}</div>
              <div style={{ color: '#5d4037' }}>Libros Totales</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#fff8e1', borderRadius: '8px', border: '2px solid #689f38' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✍️</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#689f38' }}>{stats.totalAuthors}</div>
              <div style={{ color: '#5d4037' }}>Autores</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#fff8e1', borderRadius: '8px', border: '2px solid #7b1fa2' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7b1fa2' }}>{stats.activeLoans}</div>
              <div style={{ color: '#5d4037' }}>Préstamos Activos</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#fff8e1', borderRadius: '8px', border: '2px solid #8d6e63' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8d6e63' }}>{stats.totalUsers}</div>
              <div style={{ color: '#5d4037' }}>Usuarios</div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Acciones Rápidas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                style={{
                  padding: '1.5rem',
                  backgroundColor: action.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>{action.icon}</div>
                <div>{action.title}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Actividad Reciente</h2>
          <div style={{ backgroundColor: '#f5f5dc', padding: '1rem', borderRadius: '8px', border: '1px solid #d7ccc8' }}>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} style={{
                  padding: '0.75rem',
                  borderBottom: index < recentActivity.length - 1 ? '1px solid #d7ccc8' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{activity.action}:</strong> {activity.details}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#8d6e63' }}>{activity.time}</div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#8d6e63',
                fontStyle: 'italic'
              }}>
                No hay actividad reciente para mostrar
              </div>
            )}
          </div>
        </section>

        {/* User Actions */}
        <section style={{ textAlign: 'center' }}>
          <h2>Opciones de Usuario</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/profile')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#a1887f',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Ver Perfil
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;