// src/pages/Profile.jsx
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const API_BASE_URL = 'http://localhost:3001';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userActivities, setUserActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });

  // Real user statistics
  const [userStats, setUserStats] = useState({
    booksBorrowed: 0,
    booksReturned: 0,
    currentLoans: 0,
    favoriteGenre: "No disponible",
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "No disponible",
    lastLogin: new Date().toLocaleDateString()
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          lastName: editForm.lastName,
          email: editForm.email
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      const updatedUser = await response.json();

      // Update the auth context with the new user data
      updateUser(updatedUser);

      // Update the edit form with the new data
      setEditForm({
        name: updatedUser.name || '',
        lastName: updatedUser.lastName || '',
        email: updatedUser.email || ''
      });

      console.log('Perfil actualizado:', updatedUser);

      setIsEditing(false);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil. Inténtalo de nuevo.');
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  // Load user activities and statistics on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserActivities();
      fetchUserStatistics();
    }
  }, [user]);

  const fetchUserActivities = async () => {
    try {
      setLoadingActivities(true);
      const response = await fetch(`${API_BASE_URL}/activities/user/${user.id}?limit=10`);
      if (!response.ok) {
        throw new Error('Error al cargar actividades del usuario');
      }
      const activities = await response.json();

      // Transform activities to display format
      const formattedActivities = activities.map(activity => ({
        action: getActivityActionText(activity.type),
        details: activity.description,
        time: formatTimeAgo(activity.timestamp)
      }));

      setUserActivities(formattedActivities);
    } catch (err) {
      console.error('Error fetching user activities:', err);
      setUserActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  const getActivityActionText = (type) => {
    const actionMap = {
      'user_registered': 'Registro',
      'book_added': 'Libro agregado',
      'loan_created': 'Préstamo solicitado',
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

  const fetchUserStatistics = async () => {
    try {
      setLoadingStats(true);

      // Fetch all data in parallel
      const [loansResponse, booksResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/loans`),
        fetch(`${API_BASE_URL}/books`)
      ]);

      if (!loansResponse.ok || !booksResponse.ok) {
        throw new Error('Error al cargar datos');
      }

      const [allLoans, allBooks] = await Promise.all([
        loansResponse.json(),
        booksResponse.json()
      ]);

      // Filter loans for current user (using full name)
      const fullName = `${user.name} ${user.lastName}`.trim();
      const userLoans = allLoans.filter(loan => loan.userName === fullName || loan.userName === user.name);

      // Calculate basic statistics
      const booksBorrowed = userLoans.length;
      const booksReturned = userLoans.filter(loan => loan.status === 'returned').length;
      const currentLoans = userLoans.filter(loan => loan.status === 'borrowed').length;

      // Calculate favorite genre based on borrowed books
      let favoriteGenre = "No disponible";
      if (userLoans.length > 0) {
        const genreCount = {};

        // Count genres from borrowed books
        userLoans.forEach(loan => {
          const book = allBooks.find(b => b.title === loan.bookTitle);
          if (book && book.category) {
            genreCount[book.category] = (genreCount[book.category] || 0) + 1;
          }
        });

        // Find the most common genre
        if (Object.keys(genreCount).length > 0) {
          favoriteGenre = Object.entries(genreCount).reduce((a, b) =>
            genreCount[a[0]] > genreCount[b[0]] ? a : b
          )[0];
        }
      }

      setUserStats({
        booksBorrowed,
        booksReturned,
        currentLoans,
        favoriteGenre,
        memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "No disponible",
        lastLogin: new Date().toLocaleDateString()
      });
    } catch (err) {
      console.error('Error fetching user statistics:', err);
      // Keep default values on error
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#8d6e63',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '3rem',
            color: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            👤
          </div>
          <h1 style={{ marginBottom: '0.5rem' }}>Perfil de Usuario</h1>
          <p style={{ color: '#5d4037', fontStyle: 'italic' }}>
            Miembro desde {userStats.memberSince}
          </p>
          {loadingStats && <p style={{ textAlign: 'center', marginTop: '1rem' }}>Cargando estadísticas...</p>}
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* User Information */}
          <section>
            <h2 style={{ borderBottom: '2px solid #8d6e63', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Información Personal
            </h2>
            <div style={{ backgroundColor: '#f5f5dc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #d7ccc8' }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nombre:</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #bcaaa4',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Apellido:</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #bcaaa4',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email:</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #bcaaa4',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleSave}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#689f38',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancel}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>Nombre:</strong> {user?.name} {user?.lastName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>Email:</strong> {user?.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>Último acceso:</strong> {userStats.lastLogin}</span>
                  </div>
                  <button
                    onClick={handleEdit}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#8d6e63',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      alignSelf: 'flex-start'
                    }}
                  >
                    Editar Perfil
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* User Statistics */}
          <section>
            <h2 style={{ borderBottom: '2px solid #8d6e63', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Estadísticas de Lectura
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#fff8e1',
                borderRadius: '8px',
                border: '2px solid #f57c00'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f57c00' }}>{userStats.booksBorrowed}</div>
                <div style={{ fontSize: '0.9rem', color: '#5d4037' }}>Libros Prestados</div>
              </div>
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#fff8e1',
                borderRadius: '8px',
                border: '2px solid #689f38'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#689f38' }}>{userStats.booksReturned}</div>
                <div style={{ fontSize: '0.9rem', color: '#5d4037' }}>Libros Devueltos</div>
              </div>
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#fff8e1',
                borderRadius: '8px',
                border: '2px solid #7b1fa2'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7b1fa2' }}>{userStats.currentLoans}</div>
                <div style={{ fontSize: '0.9rem', color: '#5d4037' }}>Préstamos Activos</div>
              </div>
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#fff8e1',
                borderRadius: '8px',
                border: '2px solid #8d6e63'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❤️</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#8d6e63' }}>{userStats.favoriteGenre}</div>
                <div style={{ fontSize: '0.9rem', color: '#5d4037' }}>Género Favorito</div>
              </div>
            </div>
          </section>
        </div>

        {/* Recent Activity */}
        <section>
          <h2 style={{ borderBottom: '2px solid #8d6e63', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Actividad Reciente
          </h2>
          <div style={{ backgroundColor: '#f5f5dc', padding: '1rem', borderRadius: '8px', border: '1px solid #d7ccc8' }}>
            {loadingActivities ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#8d6e63' }}>
                Cargando actividad...
              </div>
            ) : userActivities.length > 0 ? (
              userActivities.map((activity, index) => (
                <div key={index} style={{
                  padding: '0.75rem',
                  borderBottom: index < userActivities.length - 1 ? '1px solid #d7ccc8' : 'none',
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
              <div style={{ textAlign: 'center', padding: '1rem', color: '#8d6e63', fontStyle: 'italic' }}>
                No hay actividad reciente para mostrar
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}