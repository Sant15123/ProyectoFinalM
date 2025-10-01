// src/pages/ReaderDashboard.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:3001';

const ReaderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [userLoans, setUserLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Load books and user loans
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch books and loans in parallel
      const [booksRes, loansRes] = await Promise.all([
        fetch(`${API_BASE_URL}/books`),
        fetch(`${API_BASE_URL}/loans`)
      ]);

      if (!booksRes.ok || !loansRes.ok) {
        throw new Error('Error al cargar datos');
      }

      const [booksData, loansData] = await Promise.all([
        booksRes.json(),
        loansRes.json()
      ]);

      setBooks(booksData);

      // Filter loans for current user
      const currentUserLoans = loansData.filter(loan =>
        loan.userName === `${user.name} ${user.lastName}` ||
        loan.userName === user.name
      );
      setUserLoans(currentUserLoans);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if book is available for loan
  const isBookAvailable = (book) => {
    // Check if user already has this book on loan
    const userHasBook = userLoans.some(loan =>
      loan.bookTitle === book.title &&
      (!loan.returnDate || loan.status === 'borrowed')
    );

    // Check if book has available copies (simplified - assuming availableCopies > 0)
    return !userHasBook && book.availableCopies > 0;
  };

  // Request book loan
  const requestLoan = async (book) => {
    if (!isBookAvailable(book)) {
      alert('Este libro no está disponible para préstamo');
      return;
    }

    try {
      const loanData = {
        userName: `${user.name} ${user.lastName}`,
        bookTitle: book.title,
        borrowDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        returnDate: "",
        status: "borrowed"
      };

      const response = await fetch(`${API_BASE_URL}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanData),
      });

      if (!response.ok) {
        throw new Error('Error al solicitar préstamo');
      }

      alert(`¡Préstamo solicitado exitosamente!\n\nLibro: ${book.title}\nFecha de préstamo: ${loanData.borrowDate}\n\nRecuerda devolver el libro en 15 días.`);

      // Refresh data
      fetchData();

    } catch (err) {
      alert('Error al solicitar préstamo: ' + err.message);
      console.error('Error requesting loan:', err);
    }
  };

  // Filter books based on search term
  const filteredBooks = useMemo(() => {
    return books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  return (
    <div className="container reader-dashboard">
      <div className="card">
        <header className="dashboard-header" style={{ marginBottom: '3rem' }}>
          <h1 className="dashboard-title">📚 Biblioteca Digital</h1>
          <p className="dashboard-subtitle">
            Bienvenido/a, <strong>{user?.name} {user?.lastName}</strong>!
          </p>
          <span className="user-role">Lector Registrado</span>
          {loading && <p style={{ textAlign: 'center', marginTop: '1rem' }}>Cargando libros...</p>}
          {error && <p className="error" style={{ textAlign: 'center', marginTop: '1rem' }}>Error: {error}</p>}
        </header>

        {/* User Loans Summary */}
        <section style={{ marginTop: '1rem', marginBottom: '3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#3e2723' }}>📊 Mis Préstamos</h2>
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-card-icon">📖</div>
              <div className="stats-card-value">
                {userLoans.filter(loan => !loan.returnDate || loan.status === 'borrowed').length}
              </div>
              <div className="stats-card-label">Libros Prestados</div>
            </div>
            <div className="stats-card" style={{
              background: 'linear-gradient(145deg, #fff3e0 0%, #fce4ec 100%)',
              borderColor: '#ff9800'
            }}>
              <div className="stats-card-icon">✅</div>
              <div className="stats-card-value" style={{ color: '#e65100' }}>
                {userLoans.filter(loan => loan.returnDate && loan.status === 'returned').length}
              </div>
              <div className="stats-card-label" style={{ color: '#bf360c' }}>Libros Devueltos</div>
            </div>
          </div>
        </section>

        {/* Books Section */}
        <section style={{ marginTop: '1rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#3e2723' }}>📚 Libros Disponibles</h2>

          {/* Search Bar */}
          <div className="search-section">
            <input
              type="text"
              placeholder="🔍 Buscar libros por título, autor o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Books Grid */}
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                {/* Book Image */}
                <div className="book-card-image">
                  <img
                    src={book.image || 'https://via.placeholder.com/150x200?text=Sin+Imagen'}
                    alt={book.title}
                  />
                </div>

                {/* Book Info */}
                <div className="book-card-content">
                  <h3 className="book-card-title">{book.title}</h3>
                  <p className="book-card-author">
                    <strong>Autor:</strong> {book.author}
                  </p>
                  <p className="book-card-year">
                    <strong>Año:</strong> {book.year}
                  </p>
                  <p className="book-card-category">
                    <strong>Categoría:</strong> {book.category}
                  </p>
                  <p className="book-card-copies">
                    📚 {book.availableCopies} copias disponibles
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="book-card-actions">
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="btn-details"
                  >
                    📖 Ver Detalles
                  </button>
                  <button
                    onClick={() => requestLoan(book)}
                    disabled={!isBookAvailable(book)}
                    className="btn-loan"
                  >
                    {isBookAvailable(book) ? '📚 Solicitar Préstamo' : '❌ No Disponible'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && !loading && (
            <div className="no-results">
              No se encontraron libros que coincidan con la búsqueda.
            </div>
          )}
        </section>


        {/* Logout Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Book Details Modal - Moved outside container for proper overlay */}
      {selectedBook && (
        <div className="detail-modal-overlay">
          <div className="detail-modal-content">
            <div className="detail-modal-header">
              <img
                src={selectedBook.image || 'https://via.placeholder.com/150x200?text=Sin+Imagen'}
                alt={selectedBook.title}
                style={{
                  width: '150px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  marginBottom: '1rem'
                }}
              />
              <h2 className="detail-modal-title">
                {selectedBook.title}
              </h2>
              <p className="detail-modal-subtitle">por {selectedBook.author}</p>
            </div>

            <div className="detail-modal-body">
              <div className="detail-modal-grid">
                <div className="detail-modal-field">
                  <strong>Año de Publicación</strong>
                  <p>{selectedBook.year}</p>
                </div>
                <div className="detail-modal-field">
                  <strong>Categoría</strong>
                  <p>{selectedBook.category}</p>
                </div>
                <div className="detail-modal-field">
                  <strong>Copias Disponibles</strong>
                  <p>{selectedBook.availableCopies}</p>
                </div>
                <div className="detail-modal-field">
                  <strong>Editorial</strong>
                  <p>{selectedBook.publisher || 'No especificada'}</p>
                </div>
                <div className="detail-modal-field">
                  <strong>ISBN</strong>
                  <p>{selectedBook.isbn || 'No especificado'}</p>
                </div>
                <div className="detail-modal-field">
                  <strong>Páginas</strong>
                  <p>{selectedBook.pages || 'No especificado'}</p>
                </div>
              </div>

              <div className="detail-modal-description">
                <strong>Descripción</strong>
                <p>{selectedBook.description}</p>
              </div>
            </div>

            <div className="detail-modal-actions">
              <button
                onClick={() => requestLoan(selectedBook)}
                disabled={!isBookAvailable(selectedBook)}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: isBookAvailable(selectedBook) ? '#4caf50' : '#cccccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isBookAvailable(selectedBook) ? 'pointer' : 'not-allowed',
                  fontSize: '1rem',
                  fontWeight: '500',
                  marginRight: '1rem'
                }}
              >
                {isBookAvailable(selectedBook) ? '📚 Solicitar Préstamo' : '❌ No Disponible'}
              </button>
              <button
                onClick={() => setSelectedBook(null)}
                className="detail-modal-close-btn"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderDashboard;