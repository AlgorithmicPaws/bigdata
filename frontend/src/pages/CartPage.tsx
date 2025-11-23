import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, total, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega algunas canciones para empezar a comprar</p>
        <Link to="/browse" className="btn btn-primary">
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>🛒 Carrito de Compras</h1>
        <button onClick={clearCart} className="btn btn-danger">
          Vaciar Carrito
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.track.TrackId} className="cart-item">
              <div className="item-image">
                <div className="item-placeholder">🎵</div>
              </div>

              <div className="item-info">
                <Link to={`/tracks/${item.track.TrackId}`} className="item-name">
                  {item.track.Name}
                </Link>
                <p className="item-artist">{item.track.artist_name || 'Artista desconocido'}</p>
                <p className="item-album">{item.track.album?.Title || 'Sin álbum'}</p>
                <p className="item-duration">{formatDuration(item.track.Milliseconds)}</p>
              </div>

              <div className="item-quantity">
                <button
                  onClick={() => updateQuantity(item.track.TrackId, item.quantity - 1)}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.track.TrackId, item.quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <div className="item-price">
                <p className="unit-price">${parseFloat(item.track.UnitPrice).toFixed(2)} c/u</p>
                <p className="total-price">
                  ${(parseFloat(item.track.UnitPrice) * item.quantity).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.track.TrackId)}
                className="item-remove"
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Resumen</h2>
          
          <div className="summary-row">
            <span>Items:</span>
            <span>{itemCount} {itemCount === 1 ? 'canción' : 'canciones'}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row summary-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary btn-block"
          >
            Proceder al Pago
          </button>

          <Link to="/browse" className="continue-shopping">
            ← Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}