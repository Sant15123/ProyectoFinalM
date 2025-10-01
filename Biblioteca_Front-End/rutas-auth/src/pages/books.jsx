// src/pages/Books.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import DynamicFormModal from "../components/DynamicFormModal";

const API_BASE_URL = 'http://localhost:3001';

function Books() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    year: "",
    publisher: "",
    isbn: "",
    pages: "",
    language: "",
    publicationDate: "",
    category: "",
    description: "",
    availableCopies: "",
    image: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [editBook, setEditBook] = useState({
    title: "",
    author: "",
    year: "",
    publisher: "",
    isbn: "",
    pages: "",
    language: "",
    publicationDate: "",
    category: "",
    description: "",
    availableCopies: "",
    image: ""
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [authors, setAuthors] = useState([]);

  // Configuración de campos para el formulario dinámico
  const bookFields = useMemo(() => [
    { name: 'title', label: 'Título', type: 'text', required: true, placeholder: 'Ingresa el título del libro' },
    {
      name: 'author',
      label: 'Autor',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Seleccionar Autor' },
        ...authors.map(author => ({
          value: `${author.name} ${author.lastName}`,
          label: `${author.name} ${author.lastName}`
        }))
      ],
      placeholder: 'Selecciona un autor'
    },
    { name: 'year', label: 'Año de Publicación', type: 'number', placeholder: 'Ej: 2023' },
    { name: 'publisher', label: 'Editorial', type: 'text', placeholder: 'Ingresa la editorial' },
    { name: 'isbn', label: 'ISBN', type: 'text', placeholder: 'Ingresa el ISBN' },
    { name: 'pages', label: 'Número de Páginas', type: 'number', placeholder: 'Número de páginas' },
    { name: 'language', label: 'Idioma', type: 'text', placeholder: 'Ej: Español, Inglés' },
    { name: 'publicationDate', label: 'Fecha de Publicación', type: 'date', placeholder: 'Selecciona la fecha' },
    { name: 'category', label: 'Categoría', type: 'text', placeholder: 'Ej: Novela, Ciencia Ficción' },
    { name: 'availableCopies', label: 'Copias Disponibles', type: 'number', placeholder: 'Número de copias' },
    { name: 'image', label: 'URL de Portada', type: 'url', placeholder: 'https://ejemplo.com/portada.jpg' },
    { name: 'description', label: 'Descripción', type: 'textarea', placeholder: 'Describe el libro', rows: 4, gridSpan: 2 }
  ], [authors]);

  // Load books and authors from API on component mount
  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) {
        throw new Error('Error al cargar libros');
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/authors`);
      if (!response.ok) {
        throw new Error('Error al cargar autores');
      }
      const data = await response.json();
      setAuthors(data);
    } catch (err) {
      console.error('Error fetching authors:', err);
    }
  };

  const addBook = async () => {
    if (newBook.title && newBook.author && newBook.year) {
      try {
        setError(null); // Limpiar errores previos
        const response = await fetch(`${API_BASE_URL}/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newBook),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error al crear libro: ${response.status}`);
        }

        const createdBook = await response.json();

        // Refrescar la lista completa de libros desde el servidor
        await fetchBooks();

        // Limpiar el formulario
        setNewBook({
          title: "",
          author: "",
          year: "",
          publisher: "",
          isbn: "",
          pages: "",
          language: "",
          publicationDate: "",
          category: "",
          description: "",
          availableCopies: "",
          image: ""
        });

        // Limpiar errores y mostrar confirmación
        setError(null);
        console.log('Libro creado exitosamente:', createdBook);

      } catch (err) {
        console.error('Error creating book:', err);
        setError(err.message || 'Error desconocido al crear el libro');
      }
    } else {
      setError('Por favor complete al menos el título, autor y año del libro');
    }
  };

  const startEdit = (book) => {
    setEditingId(book.id);
    setEditBook({ ...book });
    setShowEditModal(true);
  };

  const saveEdit = async (formData) => {
    try {
      setError(null); // Limpiar errores previos
      const response = await fetch(`${API_BASE_URL}/books/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al actualizar libro: ${response.status}`);
      }

      const updatedBook = await response.json();

      // Refrescar la lista completa de libros desde el servidor
      await fetchBooks();

      // Cerrar modal y limpiar estado
      setEditingId(null);
      setShowEditModal(false);

      console.log('Libro actualizado exitosamente:', updatedBook);

    } catch (err) {
      console.error('Error updating book:', err);
      setError(err.message || 'Error desconocido al actualizar el libro');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowEditModal(false);
  };

  const deleteBook = async (id) => {
    const bookToDelete = books.find(b => b.id === id);
    if (bookToDelete) {
      const confirmDelete = window.confirm(
        `¿Está seguro de que desea eliminar el libro "${bookToDelete.title}"?\n\nEsta acción no se puede deshacer.`
      );

      if (confirmDelete) {
        try {
          setError(null); // Limpiar errores previos
          const response = await fetch(`${API_BASE_URL}/books/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error al eliminar libro: ${response.status}`);
          }

          // Refrescar la lista completa de libros desde el servidor
          await fetchBooks();

          console.log('Libro eliminado exitosamente:', bookToDelete.title);

        } catch (err) {
          console.error('Error deleting book:', err);
          setError(err.message || 'Error desconocido al eliminar el libro');
        }
      }
    }
  };

  // Filter books based on search term
  const filteredBooks = useMemo(() => {
    return books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.year.toString().includes(searchTerm)
    );
  }, [books, searchTerm]);

  return (
    <div className="container books-page">
      <div className="card">
        <h1>Libros</h1>
        <p>Catalogo de libros disponibles.</p>
        <p>Explorado por: {user?.name}</p>

        {loading && <p>Cargando libros...</p>}
        {error && <p className="error">Error: {error}</p>}

        <h2>Agregar Nuevo Libro</h2>
        <div className="crud-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <input
            type="text"
            placeholder="Título"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
          <select
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            style={{
              padding: '0.75rem',
              border: '2px solid #bcaaa4',
              borderRadius: '6px',
              backgroundColor: '#fff8e1',
              fontSize: '1rem',
              width: '100%'
            }}
          >
            <option value="">Seleccionar Autor</option>
            {authors.map((author) => (
              <option key={author.id} value={`${author.name} ${author.lastName}`}>
                {author.name} {author.lastName}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Año de Publicación"
            value={newBook.year}
            onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
          />
          <input
            type="text"
            placeholder="Editorial"
            value={newBook.publisher}
            onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
          />
          <input
            type="text"
            placeholder="ISBN"
            value={newBook.isbn}
            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
          />
          <input
            type="number"
            placeholder="Número de Páginas"
            value={newBook.pages}
            onChange={(e) => setNewBook({ ...newBook, pages: e.target.value })}
          />
          <input
            type="text"
            placeholder="Idioma"
            value={newBook.language}
            onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha de Publicación"
            value={newBook.publicationDate}
            onChange={(e) => setNewBook({ ...newBook, publicationDate: e.target.value })}
          />
          <input
            type="text"
            placeholder="Categoría"
            value={newBook.category}
            onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
          />
          <input
            type="number"
            placeholder="Copias Disponibles"
            value={newBook.availableCopies}
            onChange={(e) => setNewBook({ ...newBook, availableCopies: e.target.value })}
          />
          <input
            type="url"
            placeholder="URL de Portada"
            value={newBook.image}
            onChange={(e) => setNewBook({ ...newBook, image: e.target.value })}
          />
          <textarea
            placeholder="Descripción"
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
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
          <button onClick={addBook} style={{ gridColumn: 'span 2' }}>Agregar</button>
        </div>

        <h2>Lista de Libros</h2>

        {/* Search Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Buscar libros por título, autor o año..."
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

        {/* Books Table */}
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
              <tr style={{ backgroundColor: '#f57c00', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e65100' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e65100' }}>Título</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e65100' }}>Autor</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e65100' }}>Editorial</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e65100' }}>ISBN</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e65100' }}>Categoría</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #e65100' }}>Copias</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #e65100' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} style={{ borderBottom: '1px solid #d7ccc8' }}>
                  <td style={{ padding: '1rem' }}>{book.id}</td>
                  <td style={{ padding: '1rem' }}>{book.title}</td>
                  <td style={{ padding: '1rem' }}>{book.author}</td>
                  <td style={{ padding: '1rem' }}>{book.publisher}</td>
                  <td style={{ padding: '1rem' }}>{book.isbn}</td>
                  <td style={{ padding: '1rem' }}>{book.category}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>{book.availableCopies}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button onClick={() => setSelectedBook(book)}>Ver detalles</button>
                      <button onClick={() => startEdit(book)}>Editar</button>
                      <button onClick={() => deleteBook(book.id)} className="delete-button">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#f57c00' }}>
                    No se encontraron libros que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Book Modal */}
        <DynamicFormModal
          isOpen={showEditModal}
          onClose={cancelEdit}
          onSave={saveEdit}
          title="Editar Libro"
          subtitle="Modificar información del libro"
          fields={bookFields}
          initialData={editBook}
        />

        {/* Book Details Modal */}
        {selectedBook && (
          <div className="detail-modal-overlay">
            <div className="detail-modal-content">
              <div className="detail-modal-header">
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <img
                    src={selectedBook.image || 'https://via.placeholder.com/200x300?text=Sin+Portada'}
                    alt={`Portada de ${selectedBook.title}`}
                    style={{
                      width: '150px',
                      height: '225px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <h2 className="detail-modal-title" style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>
                      {selectedBook.title}
                    </h2>
                    <p className="detail-modal-subtitle" style={{ fontSize: '1.1rem', margin: '0' }}>
                      por {selectedBook.author}
                    </p>
                  </div>
                </div>
              </div>

              <div className="detail-modal-body">
                <div className="detail-modal-grid">
                  <div className="detail-modal-field">
                    <strong>Año</strong>
                    <p>{selectedBook.year}</p>
                  </div>
                  <div className="detail-modal-field">
                    <strong>Editorial</strong>
                    <p>{selectedBook.publisher}</p>
                  </div>
                  <div className="detail-modal-field">
                    <strong>ISBN</strong>
                    <p>{selectedBook.isbn}</p>
                  </div>
                  <div className="detail-modal-field">
                    <strong>Páginas</strong>
                    <p>{selectedBook.pages}</p>
                  </div>
                  <div className="detail-modal-field">
                    <strong>Idioma</strong>
                    <p>{selectedBook.language}</p>
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
                    <strong>Fecha de Publicación</strong>
                    <p>{selectedBook.publicationDate ? new Date(selectedBook.publicationDate).toLocaleDateString() : 'No especificada'}</p>
                  </div>
                </div>

                <div className="detail-modal-description">
                  <strong>Descripción</strong>
                  <p>{selectedBook.description}</p>
                </div>
              </div>

              <div className="detail-modal-actions">
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
    </div>
  );
}

export default Books;