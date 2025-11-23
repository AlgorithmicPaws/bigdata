import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const { itemCount, total } = useCart();

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>🎵 Chinook Music Store</h1>
        </Link>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/browse" className="nav-link">Catálogo</Link>
          <Link to="/albums" className="nav-link">Álbumes</Link>
          <Link to="/artists" className="nav-link">Artistas</Link>
          <Link to="/genres" className="nav-link">Géneros</Link>
          
          <div className="header-divider"></div>
          
          <Link to="/customers" className="nav-link">Clientes</Link>
          <Link to="/invoices" className="nav-link">Compras</Link>
          {/* <Link to="/stats" className="nav-link">Estadísticas</Link> ← QUITAR ESTA LÍNEA */}
        </nav>

        <button 
          className="cart-button"
          onClick={() => navigate('/cart')}
        >
          <span className="cart-icon">🛒</span>
          <div className="cart-info">
            <span className="cart-label">Carrito</span>
            <span className="cart-total">${total.toFixed(2)}</span>
          </div>
          {itemCount > 0 && (
            <span className="cart-badge">{itemCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}