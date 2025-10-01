// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Bienvenido a la Biblioteca Digital</h1>
          <p style={{ fontSize: '1.2rem', color: '#5d4037', fontStyle: 'italic' }}>
            "Un puente hacia el conocimiento infinito"
          </p>
        </header>

        <section style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Descubre un mundo de conocimiento en nuestra biblioteca digital. Aquí podrás explorar una vasta colección de libros,
            conocer a autores fascinantes y gestionar tus préstamos de manera sencilla y eficiente.
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #d7ccc8', borderRadius: '8px' }}>
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop"
              alt="Catálogo de Libros"
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }}
            />
            <h3>📚 Catálogo de Libros</h3>
            <p>Explora miles de títulos organizados por género, autor y año.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #d7ccc8', borderRadius: '8px' }}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNS1djOxE3ma8wPHHj_t8jJdzqK8fTv5G19Q&s"
              alt="Gestión de Autores"
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }}
            />
            <h3>✍️ Gestión de Autores</h3>
            <p>Conoce la biografía y obras de tus autores favoritos.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #d7ccc8', borderRadius: '8px' }}>
            <img
              src="https://images.unsplash.com/photo-1553729784-e91953dec042?w=300&h=200&fit=crop"
              alt="Sistema de Préstamos"
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }}
            />
            <h3>📖 Sistema de Préstamos</h3>
            <p>Solicita y administra tus préstamos de libros de forma digital.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #d7ccc8', borderRadius: '8px' }}>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop"
              alt="Administración de Usuarios"
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }}
            />
            <h3>👥 Administración de Usuarios</h3>
            <p>Gestiona perfiles y accede a funciones personalizadas.</p>
          </div>
        </section>

        <section style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#f5f5dc', borderRadius: '8px', border: '2px solid #d7ccc8' }}>
          <h2 style={{ marginBottom: '1rem', color: '#3e2723' }}>¡Comienza tu viaje literario!</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            Inicia sesión para acceder a todas las funcionalidades y sumérgete en el fascinante mundo de los libros.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/login" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#8d6e63', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
              Iniciar Sesión
            </a>
            <a href="/register" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#a1887f', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
              Registrarse
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}