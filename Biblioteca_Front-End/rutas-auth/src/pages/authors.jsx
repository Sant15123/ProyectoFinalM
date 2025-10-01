// src/pages/Authors.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import DynamicFormModal from "../components/DynamicFormModal";

const API_BASE_URL = 'http://localhost:3001';

function Authors() {
  const { user } = useAuth();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    lastName: "",
    bio: "",
    birthDate: "",
    nationality: "",
    awards: [],
    website: "",
    publishedBooks: "",
    image: "",
    books: [],
    genres: []
  });
  const [editingId, setEditingId] = useState(null);
  const [editAuthor, setEditAuthor] = useState({
    name: "",
    lastName: "",
    bio: "",
    birthDate: "",
    nationality: "",
    awards: [],
    website: "",
    publishedBooks: "",
    image: "",
    books: [],
    genres: []
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // Configuración de campos para el formulario dinámico
  const authorFields = [
    { name: 'name', label: 'Nombre', type: 'text', required: true, placeholder: 'Ingresa el nombre' },
    { name: 'lastName', label: 'Apellido', type: 'text', required: true, placeholder: 'Ingresa el apellido' },
    { name: 'birthDate', label: 'Fecha de Nacimiento', type: 'date', placeholder: 'Selecciona la fecha' },
    { name: 'nationality', label: 'Nacionalidad', type: 'text', placeholder: 'Ingresa la nacionalidad' },
    { name: 'publishedBooks', label: 'Libros Publicados', type: 'number', placeholder: 'Número de libros' },
    { name: 'website', label: 'Sitio Web', type: 'url', placeholder: 'https://ejemplo.com' },
    { name: 'image', label: 'URL de Imagen', type: 'url', placeholder: 'https://ejemplo.com/imagen.jpg' },
    { name: 'awards', label: 'Premios', type: 'array', placeholder: 'Premio Nobel, Cervantes...', helpText: 'Separar premios con comas' },
    { name: 'books', label: 'Libros', type: 'array', placeholder: 'Libro 1, Libro 2...', helpText: 'Separar libros con comas' },
    { name: 'genres', label: 'Géneros', type: 'array', placeholder: 'Novela, Poesía...', helpText: 'Separar géneros con comas' },
    { name: 'bio', label: 'Biografía', type: 'textarea', required: true, placeholder: 'Escribe la biografía del autor', rows: 4, gridSpan: 2 }
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  // Load authors from API on component mount
  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/authors`);
      if (!response.ok) {
        throw new Error('Error al cargar autores');
      }
      const data = await response.json();
      setAuthors(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching authors:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAuthor = async () => {
    if (newAuthor.name && newAuthor.bio) {
      try {
        setError(null); // Limpiar errores previos
        const response = await fetch(`${API_BASE_URL}/authors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAuthor),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error al crear autor: ${response.status}`);
        }

        const createdAuthor = await response.json();

        // Refrescar la lista completa de autores desde el servidor
        await fetchAuthors();

        // Limpiar el formulario
        setNewAuthor({
          name: "",
          lastName: "",
          bio: "",
          birthDate: "",
          nationality: "",
          awards: [],
          website: "",
          publishedBooks: "",
          image: "",
          books: [],
          genres: []
        });

        // Limpiar errores y mostrar confirmación
        setError(null);
        console.log('Autor creado exitosamente:', createdAuthor);

      } catch (err) {
        console.error('Error creating author:', err);
        setError(err.message || 'Error desconocido al crear el autor');
      }
    } else {
      setError('Por favor complete al menos el nombre y la biografía del autor');
    }
  };

  const startEdit = (author) => {
    setEditingId(author.id);
    setEditAuthor({ ...author });
    setShowEditModal(true);
  };

  const saveEdit = async (formData) => {
    try {
      setError(null); // Limpiar errores previos
      const response = await fetch(`${API_BASE_URL}/authors/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al actualizar autor: ${response.status}`);
      }

      const updatedAuthor = await response.json();

      // Refrescar la lista completa de autores desde el servidor
      await fetchAuthors();

      // Cerrar modal y limpiar estado
      setEditingId(null);
      setShowEditModal(false);

      console.log('Autor actualizado exitosamente:', updatedAuthor);

    } catch (err) {
      console.error('Error updating author:', err);
      setError(err.message || 'Error desconocido al actualizar el autor');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowEditModal(false);
  };

  const deleteAuthor = async (id) => {
    const authorToDelete = authors.find(a => a.id === id);
    if (authorToDelete) {
      const confirmDelete = window.confirm(
        `¿Está seguro de que desea eliminar al autor "${authorToDelete.name}"?\n\nEsta acción no se puede deshacer.`
      );

      if (confirmDelete) {
        try {
          setError(null); // Limpiar errores previos
          const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error al eliminar autor: ${response.status}`);
          }

          // Refrescar la lista completa de autores desde el servidor
          await fetchAuthors();

          console.log('Autor eliminado exitosamente:', authorToDelete.name);

        } catch (err) {
          console.error('Error deleting author:', err);
          setError(err.message || 'Error desconocido al eliminar el autor');
        }
      }
    }
  };

  // Filter authors based on search term
  const filteredAuthors = useMemo(() => {
    return authors.filter(author =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.books.some(book => book.toLowerCase().includes(searchTerm.toLowerCase())) ||
      author.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      author.awards.some(award => award.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [authors, searchTerm]);

  return (
    <div className="container authors-page">
      <div className="card">
        <h1>Autores</h1>
        <p>Lista de autores disponibles en la biblioteca.</p>
        <p>Accedido por: {user?.name}</p>

        {loading && <p>Cargando autores...</p>}
        {error && <p className="error">Error: {error}</p>}

        <h2>Agregar Nuevo Autor</h2>
        <div className="crud-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <input
            type="text"
            placeholder="Nombre"
            value={newAuthor.name}
            onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Apellido"
            value={newAuthor.lastName}
            onChange={(e) => setNewAuthor({ ...newAuthor, lastName: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha de Nacimiento"
            value={newAuthor.birthDate}
            onChange={(e) => setNewAuthor({ ...newAuthor, birthDate: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nacionalidad"
            value={newAuthor.nationality}
            onChange={(e) => setNewAuthor({ ...newAuthor, nationality: e.target.value })}
          />
          <input
            type="number"
            placeholder="Libros Publicados"
            value={newAuthor.publishedBooks}
            onChange={(e) => setNewAuthor({ ...newAuthor, publishedBooks: e.target.value })}
          />
          <input
            type="url"
            placeholder="Sitio Web"
            value={newAuthor.website}
            onChange={(e) => setNewAuthor({ ...newAuthor, website: e.target.value })}
          />
          <input
            type="url"
            placeholder="URL de Imagen"
            value={newAuthor.image}
            onChange={(e) => setNewAuthor({ ...newAuthor, image: e.target.value })}
          />
          <textarea
            placeholder="Biografía"
            value={newAuthor.bio}
            onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })}
            rows="3"
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
          <input
            type="text"
            placeholder="Premios (separados por comas)"
            value={newAuthor.awards.join(', ')}
            onChange={(e) => setNewAuthor({ ...newAuthor, awards: e.target.value.split(',').map(a => a.trim()).filter(a => a) })}
            style={{ gridColumn: 'span 2' }}
          />
          <input
            type="text"
            placeholder="Libros (separados por comas)"
            value={newAuthor.books.join(', ')}
            onChange={(e) => setNewAuthor({ ...newAuthor, books: e.target.value.split(',').map(b => b.trim()).filter(b => b) })}
            style={{ gridColumn: 'span 2' }}
          />
          <input
            type="text"
            placeholder="Géneros literarios (separados por comas)"
            value={newAuthor.genres.join(', ')}
            onChange={(e) => setNewAuthor({ ...newAuthor, genres: e.target.value.split(',').map(g => g.trim()).filter(g => g) })}
            style={{ gridColumn: 'span 2' }}
          />
          <button onClick={addAuthor} style={{ gridColumn: 'span 2' }}>Agregar</button>
        </div>

        <h2>Lista de Autores</h2>

        {/* Search Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Buscar autores por nombre o biografía..."
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

        {/* Authors Table */}
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
              <tr style={{ backgroundColor: '#689f38', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a7c59' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a7c59' }}>Nombre</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a7c59' }}>Apellido</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a7c59' }}>Nacimiento</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a7c59' }}>Nacionalidad</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a7c59' }}>Libros Pub.</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #4a7c59' }}>Premios</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #4a7c59' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuthors.map((author) => (
                <tr key={author.id} style={{ borderBottom: '1px solid #d7ccc8' }}>
                  <td style={{ padding: '1rem' }}>{author.id}</td>
                  <td style={{ padding: '1rem' }}>{author.name}</td>
                  <td style={{ padding: '1rem' }}>{author.lastName}</td>
                  <td style={{ padding: '1rem' }}>{author.birthDate ? new Date(author.birthDate).toLocaleDateString() : ''}</td>
                  <td style={{ padding: '1rem' }}>{author.nationality}</td>
                  <td style={{ padding: '1rem' }}>{author.publishedBooks}</td>
                  <td style={{ padding: '1rem' }}>{author.awards.join(', ')}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button onClick={() => setSelectedAuthor(author)}>Ver detalles</button>
                      <button onClick={() => startEdit(author)}>Editar</button>
                      <button onClick={() => deleteAuthor(author.id)} className="delete-button">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAuthors.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#689f38' }}>
                    No se encontraron autores que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Author Modal */}
        <DynamicFormModal
          isOpen={showEditModal}
          onClose={cancelEdit}
          onSave={saveEdit}
          title="Editar Autor"
          subtitle="Modificar información del autor"
          fields={authorFields}
          initialData={editAuthor}
        />

        {/* Author Details Modal */}
        {selectedAuthor && (
          <div className="detail-modal-overlay">
            <div className="detail-modal-content">
              <div className="detail-modal-header">
                <img
                  src={selectedAuthor.image || 'https://via.placeholder.com/150x200?text=Sin+Imagen'}
                  alt={`${selectedAuthor.name} ${selectedAuthor.lastName}`}
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
                  {selectedAuthor.name} {selectedAuthor.lastName}
                </h2>
                <p className="detail-modal-subtitle">Autor</p>
              </div>

              <div className="detail-modal-body">
                <div className="detail-modal-grid">
                  <div className="detail-modal-field">
                    <strong>Fecha de Nacimiento</strong>
                    <p>{selectedAuthor.birthDate ? new Date(selectedAuthor.birthDate).toLocaleDateString() : 'No especificada'}</p>
                  </div>
                  <div className="detail-modal-field">
                    <strong>Nacionalidad</strong>
                    <p>{selectedAuthor.nationality || 'No especificada'}</p>
                  </div>
                  <div className="detail-modal-field">
                    <strong>Libros Publicados</strong>
                    <p>{selectedAuthor.publishedBooks || 'No especificado'}</p>
                  </div>
                  <div className="detail-modal-field">
                    <strong>Sitio Web</strong>
                    <p>
                      {selectedAuthor.website ?
                        <a href={selectedAuthor.website} target="_blank" rel="noopener noreferrer" style={{ color: '#8d6e63', textDecoration: 'none' }}>
                          {selectedAuthor.website}
                        </a> :
                        'No especificado'
                      }
                    </p>
                  </div>
                </div>

                <div className="detail-modal-description">
                  <strong>Biografía</strong>
                  <p>{selectedAuthor.bio}</p>
                </div>

                <div className="detail-modal-description">
                  <strong>Premios Literarios</strong>
                  <div className="detail-modal-list">
                    {selectedAuthor.awards && selectedAuthor.awards.length > 0 ? (
                      selectedAuthor.awards.map((award, index) => (
                        <li key={index}>{award}</li>
                      ))
                    ) : (
                      <p>No especificados</p>
                    )}
                  </div>
                </div>

                <div className="detail-modal-description">
                  <strong>Libros Principales</strong>
                  <div className="detail-modal-list">
                    {selectedAuthor.books && selectedAuthor.books.length > 0 ? (
                      selectedAuthor.books.map((book, index) => (
                        <li key={index}>{book}</li>
                      ))
                    ) : (
                      <p>No especificados</p>
                    )}
                  </div>
                </div>

                <div className="detail-modal-description">
                  <strong>Géneros Literarios</strong>
                  <div className="detail-modal-list">
                    {selectedAuthor.genres && selectedAuthor.genres.length > 0 ? (
                      selectedAuthor.genres.map((genre, index) => (
                        <span key={index} style={{
                          backgroundColor: '#689f38',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}>
                          {genre}
                        </span>
                      ))
                    ) : (
                      <p>No especificados</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="detail-modal-actions">
                <button
                  onClick={() => setSelectedAuthor(null)}
                  className="detail-modal-close-btn"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Authors;