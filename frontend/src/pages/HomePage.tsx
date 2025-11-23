import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Bienvenido a Chinook Music Store</h1>
        <p>Descubre y compra tu música favorita</p>
        <div className="hero-actions">
          <Link to="/browse" className="btn btn-primary">
            Explorar Catálogo
          </Link>
          <Link to="/genres" className="btn btn-secondary">
            Ver Géneros
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🎵 Amplio Catálogo</h3>
          <p>Miles de canciones de todos los géneros</p>
        </div>
        <div className="feature-card">
          <h3>🎸 Artistas Destacados</h3>
          <p>Encuentra a tus artistas favoritos</p>
        </div>
        <div className="feature-card">
          <h3>💿 Álbumes Completos</h3>
          <p>Colecciones completas disponibles</p>
        </div>
      </section>
    </div>
  );
}