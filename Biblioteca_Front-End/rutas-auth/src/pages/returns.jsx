// src/pages/Returns.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import DynamicFormModal from "../components/DynamicFormModal";

const API_BASE_URL = 'http://localhost:3001';

function Returns() {
  const { user } = useAuth();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReturn, setNewReturn] = useState({
    userName: "",
    bookTitle: "",
    borrowDate: "",
    returnDate: "",
    actualReturnDate: "",
    condition: "Excelente",
    notes: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [editReturn, setEditReturn] = useState({
    userName: "",
    bookTitle: "",
    borrowDate: "",
    returnDate: "",
    actualReturnDate: "",
    condition: "Excelente",
    notes: ""
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [filterLate, setFilterLate] = useState("");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBook, setSelectedBook] = useState("");

  // Filter users and books that have active loans
  const activeBorrowUsers = useMemo(() => {
    const activeBorrows = borrows.filter(borrow => borrow.status === 'borrowed');
    const userNames = [...new Set(activeBorrows.map(borrow => borrow.userName))];
    return users.filter(user =>
      userNames.includes(`${user.name} ${user.lastName}`) ||
      userNames.includes(user.name)
    );
  }, [borrows, users]);

  const activeBorrowBooks = useMemo(() => {
    const activeBorrows = borrows.filter(borrow => borrow.status === 'borrowed');
    const bookTitles = [...new Set(activeBorrows.map(borrow => borrow.bookTitle))];
    return books.filter(book => bookTitles.includes(book.title));
  }, [borrows, books]);

  const userBooks = useMemo(() => {
    if (!selectedUser) return [];
    const userBorrows = borrows.filter(borrow => borrow.userName === selectedUser && borrow.status === 'borrowed');
    const bookTitles = [...new Set(userBorrows.map(b => b.bookTitle))];
    return books.filter(book => bookTitles.includes(book.title));
  }, [selectedUser, borrows, books]);

  // Configuración de campos para el formulario dinámico
  const returnFields = useMemo(() => [
    {
      name: 'userName',
      label: 'Usuario',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Seleccionar Usuario' },
        ...activeBorrowUsers.map(user => ({
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
        ...activeBorrowBooks.map(book => ({
          value: book.title,
          label: book.title
        }))
      ],
      placeholder: 'Selecciona un libro'
    },
    {
      name: 'borrowDate',
      label: 'Fecha de Préstamo',
      type: 'date',
      required: true,
      placeholder: 'Fecha cuando se prestó el libro',
      title: 'Fecha en que el usuario recibió el libro'
    },
    {
      name: 'returnDate',
      label: 'Fecha de Devolución Esperada',
      type: 'date',
      required: true,
      placeholder: 'Fecha límite para devolver el libro',
      title: 'Fecha límite acordada para la devolución del libro'
    },
    {
      name: 'actualReturnDate',
      label: 'Fecha de Devolución Real',
      type: 'date',
      required: true,
      placeholder: 'Fecha cuando se devolvió el libro',
      title: 'Fecha real en que el usuario devolvió el libro a la biblioteca'
    },
    {
      name: 'condition',
      label: 'Condición del Libro',
      type: 'select',
      required: true,
      options: [
        { value: 'Excelente', label: 'Excelente' },
        { value: 'Muy Bueno', label: 'Muy Bueno' },
        { value: 'Bueno', label: 'Bueno' },
        { value: 'Regular', label: 'Regular' },
        { value: 'Malo', label: 'Malo' },
        { value: 'Dañado', label: 'Dañado' }
      ]
    },
    { name: 'notes', label: 'Notas', type: 'textarea', placeholder: 'Observaciones sobre la devolución' }
  ], [activeBorrowUsers, activeBorrowBooks]);

  // Load returns, users, books and borrows from API on component mount
  useEffect(() => {
    fetchReturns();
    fetchUsers();
    fetchBooks();
    fetchBorrows();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/returns`);
      if (!response.ok) {
        throw new Error('Error al cargar devoluciones');
      }
      const data = await response.json();
      setReturns(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching returns:', err);
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

  const fetchBorrows = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/loans`);
      if (!response.ok) {
        throw new Error('Error al cargar préstamos');
      }
      const data = await response.json();
      setBorrows(data);
    } catch (err) {
      console.error('Error fetching borrows:', err);
    }
  };

  const addReturn = async () => {
    if (newReturn.userName && newReturn.bookTitle && newReturn.actualReturnDate) {
      try {
        const returnData = {
          ...newReturn
        };

        const response = await fetch(`${API_BASE_URL}/returns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(returnData),
        });

        if (!response.ok) {
          throw new Error('Error al crear devolución');
        }

        await response.json();
        await fetchReturns();
        setNewReturn({
          userName: "",
          bookTitle: "",
          borrowDate: "",
          returnDate: "",
          actualReturnDate: "",
          condition: "Excelente",
          notes: ""
        });
        setSelectedUser("");
        setSelectedBook("");
      } catch (err) {
        setError(err.message);
        console.error('Error creating return:', err);
      }
    } else {
      setError('Por favor complete todos los campos requeridos: Usuario, Libro y Fecha de Devolución Real');
    }
  };

  const startEdit = (returnItem) => {
    setEditingId(returnItem.id);
    setEditReturn({ ...returnItem });
    setShowEditModal(true);
  };

  const saveEdit = async (formData) => {
    try {
      const returnData = {
        ...formData
      };

      const response = await fetch(`${API_BASE_URL}/returns/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(returnData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar devolución');
      }

      await response.json();
      await fetchReturns();
      setEditingId(null);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
      console.error('Error updating return:', err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowEditModal(false);
  };

  const deleteReturn = async (id) => {
    const returnToDelete = returns.find(r => r.id === id);
    if (returnToDelete) {
      const confirmDelete = window.confirm(
        `¿Está seguro de que desea eliminar la devolución de "${returnToDelete.bookTitle}" por ${returnToDelete.userName}?\n\nEsta acción no se puede deshacer.`
      );

      if (confirmDelete) {
        try {
          const response = await fetch(`${API_BASE_URL}/returns/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Error al eliminar devolución');
          }

          setReturns(returns.filter(r => r.id !== id));
        } catch (err) {
          setError(err.message);
          console.error('Error deleting return:', err);
        }
      }
    }
  };

  // Filter returns based on search term and filters
  const filteredReturns = useMemo(() => {
    return returns.filter(returnItem => {
      const matchesSearch = returnItem.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           returnItem.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           returnItem.condition.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCondition = !filterCondition || returnItem.condition === filterCondition;
      const matchesLate = filterLate === "" ||
                         (filterLate === "late" && returnItem.isLate) ||
                         (filterLate === "onTime" && !returnItem.isLate);

      return matchesSearch && matchesCondition && matchesLate;
    });
  }, [returns, searchTerm, filterCondition, filterLate]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalReturns = returns.length;
    const lateReturns = returns.filter(r => r.isLate).length;
    const damagedBooks = returns.filter(r => r.condition === 'Dañado' || r.condition === 'Malo').length;

    return {
      totalReturns,
      lateReturns,
      damagedBooks
    };
  }, [returns]);

  return (
    <div className="container returns-page">
      <div className="card">
        <h1>Devoluciones</h1>
        <p>Gestión de devoluciones de libros.</p>
        <p>Administrado por: {user?.name}</p>

        {loading && <p>Cargando devoluciones...</p>}
        {error && <p className="error">Error: {error}</p>}

        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '2px solid #4caf50' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📚</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4caf50' }}>{stats.totalReturns}</div>
            <div>Total Devoluciones</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '2px solid #ff9800' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏰</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff9800' }}>{stats.lateReturns}</div>
            <div>Devoluciones Tardías</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '2px solid #9c27b0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔧</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#9c27b0' }}>{stats.damagedBooks}</div>
            <div>Libros Dañados</div>
          </div>
        </div>

        <h2>Registrar Nueva Devolución</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
          Registra la devolución de un libro. Solo se muestran usuarios y libros que tienen préstamos activos para facilitar el seguimiento de devoluciones.
        </p>
        <div className="crud-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <select
            value={newReturn.userName}
            onChange={(e) => {
              const user = e.target.value;
              setSelectedUser(user);
              setNewReturn({ ...newReturn, userName: user, bookTitle: "", borrowDate: "", returnDate: "" });
              setSelectedBook("");
            }}
            style={{
              padding: '0.75rem',
              border: '2px solid #bcaaa4',
              borderRadius: '6px',
              backgroundColor: '#fff8e1',
              fontSize: '1rem'
            }}
          >
            <option value="">Seleccionar Usuario</option>
            {activeBorrowUsers.map((user) => (
              <option key={user.id} value={`${user.name} ${user.lastName}`}>
                {user.name} {user.lastName}
              </option>
            ))}
          </select>
          <select
            value={newReturn.bookTitle}
            onChange={(e) => {
              const book = e.target.value;
              setSelectedBook(book);
              // Find the borrow
              const borrow = borrows.find(b => b.userName === selectedUser && b.bookTitle === book && b.status === 'borrowed');
              setNewReturn(prev => ({
                ...prev,
                bookTitle: book,
                borrowDate: borrow ? borrow.borrowDate : "",
                returnDate: borrow ? borrow.returnDate : ""
              }));
            }}
            style={{
              padding: '0.75rem',
              border: '2px solid #bcaaa4',
              borderRadius: '6px',
              backgroundColor: '#fff8e1',
              fontSize: '1rem'
            }}
          >
            <option value="">Seleccionar Libro</option>
            {userBooks.map((book) => (
              <option key={book.id} value={book.title}>
                {book.title}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
              Fecha de Préstamo
            </label>
            <input
              type="date"
              placeholder="Selecciona la fecha cuando se prestó el libro"
              value={newReturn.borrowDate}
              onChange={(e) => setNewReturn({ ...newReturn, borrowDate: e.target.value })}
              title="Fecha en que el usuario recibió el libro"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
              Fecha de Devolución Esperada
            </label>
            <input
              type="date"
              placeholder="Selecciona la fecha límite para devolver el libro"
              value={newReturn.returnDate}
              onChange={(e) => setNewReturn({ ...newReturn, returnDate: e.target.value })}
              title="Fecha límite acordada para la devolución del libro"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
              Fecha de Devolución Real
            </label>
            <input
              type="date"
              placeholder="Selecciona la fecha cuando el usuario devolvió el libro"
              value={newReturn.actualReturnDate}
              onChange={(e) => setNewReturn({ ...newReturn, actualReturnDate: e.target.value })}
              title="Fecha real en que el usuario devolvió el libro a la biblioteca"
            />
          </div>
          <select
            value={newReturn.condition}
            onChange={(e) => setNewReturn({ ...newReturn, condition: e.target.value })}
            style={{
              padding: '0.75rem',
              border: '2px solid #bcaaa4',
              borderRadius: '6px',
              backgroundColor: '#fff8e1',
              fontSize: '1rem'
            }}
          >
            <option value="Excelente">Excelente</option>
            <option value="Muy Bueno">Muy Bueno</option>
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
            <option value="Dañado">Dañado</option>
          </select>
          <textarea
            placeholder="Notas"
            value={newReturn.notes}
            onChange={(e) => setNewReturn({ ...newReturn, notes: e.target.value })}
            rows="2"
            style={{
              gridColumn: 'span 2',
              padding: '0.75rem',
              border: '2px solid #bcaaa4',
              borderRadius: '6px',
              backgroundColor: '#fff8e1',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
          <button onClick={addReturn} style={{ gridColumn: 'span 2' }}>Registrar Devolución</button>
        </div>

        <h2>Lista de Devoluciones</h2>

        {/* Filters and Search */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar por usuario, libro o condición..."
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
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            style={{
              padding: '0.75rem',
              marginLeft: '2rem',
              border: '2px solid #bcaaa4',
              borderRadius: '6px',
              backgroundColor: '#fff8e1',
              fontSize: '1rem'
            }}
          >
            <option value="">Todas las Condiciones</option>
            <option value="Excelente">Excelente</option>
            <option value="Muy Bueno">Muy Bueno</option>
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
            <option value="Dañado">Dañado</option>
          </select>
          <select
            value={filterLate}
            onChange={(e) => setFilterLate(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '2px solid #bcaaa4',
              borderRadius: '6px',
              backgroundColor: '#fff8e1',
              fontSize: '1rem'
            }}
          >
            <option value="">Todos</option>
            <option value="onTime">A Tiempo</option>
            <option value="late">Tardíos</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCondition("");
              setFilterLate("");
            }}
            style={{
              padding: '0.75rem',
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Limpiar Filtros
          </button>
        </div>

        {/* Returns Table */}
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
              <tr style={{ backgroundColor: '#2196f3', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #0d47a1' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #0d47a1' }}>Usuario</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #0d47a1' }}>Libro</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #0d47a1' }} title="Fecha real en que se devolvió el libro">Fecha Devolución</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #0d47a1' }}>Condición</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #0d47a1' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #0d47a1' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((returnItem) => (
                <tr key={returnItem.id} style={{ borderBottom: '1px solid #d7ccc8' }}>
                  <td style={{ padding: '1rem' }}>{returnItem.id}</td>
                  <td style={{ padding: '1rem' }}>{returnItem.userName}</td>
                  <td style={{ padding: '1rem' }}>{returnItem.bookTitle}</td>
                  <td style={{ padding: '1rem' }}>{returnItem.actualReturnDate ? new Date(returnItem.actualReturnDate).toLocaleDateString() : ''}</td>
                  <td style={{ padding: '1rem' }}>{returnItem.condition}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {returnItem.isLate ? `Tardío (${returnItem.daysLate}d)` : 'A Tiempo'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => startEdit(returnItem)}>Editar</button>
                      <button onClick={() => deleteReturn(returnItem.id)} className="delete-button">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReturns.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#2196f3' }}>
                    No se encontraron devoluciones que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Return Modal */}
        <DynamicFormModal
          isOpen={showEditModal}
          onClose={cancelEdit}
          onSave={saveEdit}
          title="Editar Devolución"
          subtitle="Modificar información de la devolución"
          fields={returnFields}
          initialData={editReturn}
        />
      </div>
    </div>
  );
}

export default Returns;