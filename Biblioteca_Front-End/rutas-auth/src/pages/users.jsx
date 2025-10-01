// src/pages/Users.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import DynamicFormModal from "../components/DynamicFormModal";

const API_BASE_URL = 'http://localhost:3001';

function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    role: "reader"
  });
  const [editingId, setEditingId] = useState(null);
  const [editUser, setEditUser] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    role: "reader"
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Configuración de campos para el formulario dinámico
  const userFields = [
    { name: 'name', label: 'Nombre', type: 'text', required: true, placeholder: 'Ingresa el nombre' },
    { name: 'lastName', label: 'Apellido', type: 'text', required: true, placeholder: 'Ingresa el apellido' },
    { name: 'phone', label: 'Teléfono', type: 'tel', placeholder: 'Ingresa el teléfono' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'usuario@email.com' },
    { name: 'birthDate', label: 'Fecha de Nacimiento', type: 'date', placeholder: 'Selecciona la fecha' },
    {
      name: 'gender',
      label: 'Género',
      type: 'select',
      options: [
        { value: '', label: 'Seleccionar Género' },
        { value: 'Masculino', label: 'Masculino' },
        { value: 'Femenino', label: 'Femenino' },
        { value: 'Otro', label: 'Otro' }
      ]
    },
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      options: [
        { value: 'reader', label: 'Lector' },
        { value: 'admin', label: 'Administrador' }
      ]
    }
  ];

  // Load users from API on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

        if (!response.ok) {
          throw new Error('Error al crear usuario');
        }

        const createdUser = await response.json();
        setUsers([...users, createdUser]);
        setNewUser({
          name: "",
          lastName: "",
          phone: "",
          email: "",
          birthDate: "",
          gender: "",
          role: "reader"
        });
      } catch (err) {
        setError(err.message);
        console.error('Error creating user:', err);
      }
    }
  };

  const startEdit = (usr) => {
    setEditingId(usr.id);
    setEditUser({ ...usr });
    setShowEditModal(true);
  };

  const saveEdit = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }

      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === editingId ? updatedUser : u));
      setEditingId(null);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
      console.error('Error updating user:', err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowEditModal(false);
  };

  const deleteUser = async (id) => {
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete) {
      const confirmDelete = window.confirm(
        `¿Está seguro de que desea eliminar al usuario "${userToDelete.name} ${userToDelete.lastName}"?\n\nEsta acción no se puede deshacer.`
      );

      if (confirmDelete) {
        try {
          const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Error al eliminar usuario');
          }

          setUsers(users.filter(u => u.id !== id));
        } catch (err) {
          setError(err.message);
          console.error('Error deleting user:', err);
        }
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    return users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        user.gender?.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower) ||
        (user.birthDate && new Date(user.birthDate).toLocaleDateString().toLowerCase().includes(searchLower))
      );
    });
  }, [users, searchTerm]);

  return (
    <div className="container users-page">
      <div className="card">
        <h1>Usuarios</h1>
        <p>Gestión de usuarios del sistema.</p>
        <p>Usuario actual: {user?.name}</p>

        {loading && <p>Cargando usuarios...</p>}
        {error && <p className="error">Error: {error}</p>}

        <h2>Agregar Nuevo Usuario</h2>
        <div className="crud-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <input
            type="text"
            placeholder="Nombre"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Apellido"
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha de Nacimiento"
            value={newUser.birthDate}
            onChange={(e) => setNewUser({ ...newUser, birthDate: e.target.value })}
          />
          <select
            value={newUser.gender}
            onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
            style={{ padding: '0.75rem', border: '2px solid #bcaaa4', borderRadius: '6px', backgroundColor: '#fff8e1', fontSize: '1rem' }}
          >
            <option value="">Seleccionar Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>

            
            <option value="Otro">Otro</option>
          </select>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            style={{ padding: '0.75rem', border: '2px solid #bcaaa4', borderRadius: '6px', backgroundColor: '#fff8e1', fontSize: '1rem' }}
          >
            <option value="reader">Lector</option>
            <option value="admin">Administrador</option>
          </select>
          <button onClick={addUser} style={{ gridColumn: 'span 2' }}>Agregar</button>
        </div>

        <h2>Lista de Usuarios</h2>

        {/* Search Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Buscar usuarios por nombre, apellido, email, teléfono, género o rol..."
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

        {/* Users Table */}
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
              <tr style={{ backgroundColor: '#8d6e63', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #5d4037' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #5d4037' }}>Nombre</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #5d4037' }}>Apellido</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #5d4037' }}>Teléfono</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #5d4037' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #5d4037' }}>Fecha Nacimiento</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #5d4037' }}>Género</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #5d4037' }}>Rol</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #5d4037' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((usr) => (
                <tr key={usr.id} style={{ borderBottom: '1px solid #d7ccc8' }}>
                  <td style={{ padding: '1rem' }}>{usr.id}</td>
                  <td style={{ padding: '1rem' }}>{usr.name}</td>
                  <td style={{ padding: '1rem' }}>{usr.lastName}</td>
                  <td style={{ padding: '1rem' }}>{usr.phone}</td>
                  <td style={{ padding: '1rem' }}>{usr.email}</td>
                  <td style={{ padding: '1rem' }}>{usr.birthDate ? new Date(usr.birthDate).toLocaleDateString() : ''}</td>
                  <td style={{ padding: '1rem' }}>{usr.gender}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: usr.role === 'admin' ? '#ff9800' : '#4caf50'
                    }}>
                      {usr.role === 'admin' ? 'Administrador' : 'Lector'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => startEdit(usr)}>Editar</button>
                      <button onClick={() => deleteUser(usr.id)} className="delete-button">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ padding: '2rem', textAlign: 'center', color: '#8d6e63' }}>
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit User Modal */}
        <DynamicFormModal
          isOpen={showEditModal}
          onClose={cancelEdit}
          onSave={saveEdit}
          title="Editar Usuario"
          subtitle="Modificar información del usuario"
          fields={userFields}
          initialData={editUser}
        />
      </div>
    </div>
  );
}

export default Users;