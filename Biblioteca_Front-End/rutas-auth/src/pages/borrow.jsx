// src/pages/Borrow.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import DynamicFormModal from "../components/DynamicFormModal";

const API_BASE_URL = 'http://localhost:3001';

function Borrow() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLoan, setNewLoan] = useState({ userName: "", bookTitle: "", borrowDate: "", returnDate: "" });
  const [editingId, setEditingId] = useState(null);
  const [editLoan, setEditLoan] = useState({ userName: "", bookTitle: "", borrowDate: "", returnDate: "", status: "borrowed" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  // Configuración de campos para el formulario dinámico
  const loanFields = useMemo(() => [
    {
      name: 'userName',
      label: 'Usuario',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Seleccionar Usuario' },
        ...users.map(user => ({
          value: `${user.name} ${user.lastName}`,
          label: `${user.name} ${user.lastName}`
        }))
      ],
      placeholder: 'Selecciona un usuario'
    },
    {
      name: 'bookTitle',
      label: 'Libro',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Seleccionar Libro' },
        ...books.map(book => ({
          value: book.title,
          label: book.title
        }))
      ],
      placeholder: 'Selecciona un libro'
    },
    { name: 'borrowDate', label: 'Fecha de Préstamo', type: 'date', required: true, placeholder: 'Fecha cuando el usuario recibe el libro', title: 'Selecciona la fecha exacta en que el libro es entregado al usuario' },
    { name: 'returnDate', label: 'Fecha de Devolución Esperada', type: 'date', placeholder: 'Fecha límite acordada para devolver el libro', title: 'Fecha máxima en que el usuario debe devolver el libro a la biblioteca' },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: 'borrowed', label: 'Prestado' },
        { value: 'returned', label: 'Devuelto' }
      ]
    }
  ], [users, books]);

  // Load loans, users and books from API on component mount
  useEffect(() => {
    fetchLoans();
    fetchUsers();
    fetchBooks();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/loans`);
      if (!response.ok) {
        throw new Error('Error al cargar préstamos');
      }
      const data = await response.json();
      setLoans(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) {
        throw new Error('Error al cargar libros');
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const addLoan = async () => {
    if (newLoan.userName && newLoan.bookTitle && newLoan.borrowDate) {
      try {
        const loanData = {
          userName: newLoan.userName,
          bookTitle: newLoan.bookTitle,
          borrowDate: newLoan.borrowDate,
          returnDate: newLoan.returnDate || '',
          status: 'borrowed' // Los préstamos nuevos siempre son activos
        };

        const response = await fetch(`${API_BASE_URL}/loans`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loanData),
        });

        if (!response.ok) {
          throw new Error('Error al crear préstamo');
        }

        await response.json();
        // Refrescar la lista de préstamos desde el servidor
        await fetchLoans();
        setNewLoan({ userName: "", bookTitle: "", borrowDate: "", returnDate: "" });
      } catch (err) {
        setError(err.message);
        console.error('Error creating loan:', err);
      }
    }
  };

  const startEdit = (loan) => {
    setEditingId(loan.id);
    setEditLoan({ ...loan });
    setShowEditModal(true);
  };

  const saveEdit = async (formData) => {
    try {
      setError(null); // Limpiar errores previos
      const loanData = {
        userName: formData.userName,
        bookTitle: formData.bookTitle,
        borrowDate: formData.borrowDate,
        returnDate: formData.returnDate || '',
        status: formData.status
      };

      const response = await fetch(`${API_BASE_URL}/loans/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al actualizar préstamo: ${response.status}`);
      }

      const updatedLoan = await response.json();

      // Refrescar la lista completa de préstamos desde el servidor
      await fetchLoans();

      // Cerrar modal y limpiar estado
      setEditingId(null);
      setShowEditModal(false);

      console.log('Préstamo actualizado exitosamente:', updatedLoan);

    } catch (err) {
      console.error('Error updating loan:', err);
      setError(err.message || 'Error desconocido al actualizar el préstamo');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowEditModal(false);
  };

  // Filter loans based on search term
  const filteredLoans = useMemo(() => {
    return loans.filter(loan =>
      loan.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [loans, searchTerm]);


  return (
    <div className="container borrow-page">
      <div className="card">
        <h1>Préstamo</h1>
        <p>Gestión de préstamos de libros.</p>
        <p>Solicitado por: {user?.name}</p>

        {loading && <p>Cargando préstamos...</p>}
        {error && <p className="error">Error: {error}</p>}

        <h2>Agregar Nuevo Préstamo</h2>
        <div className="crud-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
              Usuario
            </label>
            <select
              value={newLoan.userName}
              onChange={(e) => setNewLoan({ ...newLoan, userName: e.target.value })}
              style={{
                padding: '0.75rem',
                border: '2px solid #bcaaa4',
                borderRadius: '6px',
                backgroundColor: '#fff8e1',
                fontSize: '1rem'
              }}
            >
              <option value="">Seleccionar Usuario</option>
              {users.map((user) => (
                <option key={user.id} value={`${user.name} ${user.lastName}`}>
                  {user.name} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
              Libro
            </label>
            <select
              value={newLoan.bookTitle}
              onChange={(e) => setNewLoan({ ...newLoan, bookTitle: e.target.value })}
              style={{
                padding: '0.75rem',
                border: '2px solid #bcaaa4',
                borderRadius: '6px',
                backgroundColor: '#fff8e1',
                fontSize: '1rem'
              }}
            >
              <option value="">Seleccionar Libro</option>
              {books.map((book) => (
                <option key={book.id} value={book.title}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
              Fecha de Préstamo
            </label>
            <input
              type="date"
              placeholder="Selecciona la fecha cuando el usuario recibe el libro"
              value={newLoan.borrowDate}
              onChange={(e) => setNewLoan({ ...newLoan, borrowDate: e.target.value })}
              title="Fecha exacta en que el libro es entregado al usuario"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
              Fecha de Devolución Esperada
            </label>
            <input
              type="date"
              placeholder="Selecciona la fecha límite acordada para devolver el libro"
              value={newLoan.returnDate}
              onChange={(e) => setNewLoan({ ...newLoan, returnDate: e.target.value })}
              title="Fecha máxima en que el usuario debe devolver el libro a la biblioteca"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gridColumn: 'span 2', marginTop: '1rem' }}>
            <button
              onClick={addLoan}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#7b1fa2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#4a148c';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#7b1fa2';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📚 Agregar Préstamo
            </button>
          </div>
        </div>

        <h2>Lista de Préstamos</h2>

        {/* Search Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Buscar préstamos por usuario, libro o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #bcaaa4',
              borderRadius: '6px',
              fontSize: '1rem',
              backgroundColor: '#fff8e1'
            }}
          />
        </div>

        {/* Loans Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#7b1fa2', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a148c' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a148c' }}>Usuario</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a148c' }}>Libro</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a148c' }}>Fecha Préstamo</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a148c' }}>Fecha Devolución</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a148c' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #4a148c' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => (
                <tr key={loan.id} style={{ borderBottom: '1px solid #d7ccc8' }}>
                  <td style={{ padding: '1rem' }}>{loan.id}</td>
                  <td style={{ padding: '1rem' }}>{loan.userName}</td>
                  <td style={{ padding: '1rem' }}>{loan.bookTitle}</td>
                  <td style={{ padding: '1rem' }}>{loan.borrowDate ? new Date(loan.borrowDate).toLocaleDateString() : ''}</td>
                  <td style={{ padding: '1rem' }}>{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : ''}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: loan.status === 'returned' ? '#4caf50' : '#ff9800'
                    }}>
                      {loan.status === 'returned' ? 'Devuelto' : 'Prestado'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button onClick={() => startEdit(loan)}>Editar</button>
                  </td>
                </tr>
              ))}
              {filteredLoans.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#7b1fa2' }}>
                    No se encontraron préstamos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Loan Modal */}
        <DynamicFormModal
          isOpen={showEditModal}
          onClose={cancelEdit}
          onSave={saveEdit}
          title="Editar Préstamo"
          subtitle="Modificar información del préstamo"
          fields={loanFields}
          initialData={editLoan}
        />
      </div>
    </div>
  );
}

export default Borrow;
