import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import type { TrackDetail } from '../../api/types';
import './AddToCartButton.css';

interface AddToCartButtonProps {
  track: TrackDetail;
  className?: string;
}

export default function AddToCartButton({ track, className = '' }: AddToCartButtonProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(track, 1);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const inCart = isInCart(track.TrackId);
  const quantity = getItemQuantity(track.TrackId);

  return (
    <button
      className={`add-to-cart-btn ${className} ${showAdded ? 'added' : ''}`}
      onClick={handleAddToCart}
    >
      {showAdded ? (
        <>✓ Agregado</>
      ) : inCart ? (
        <>En carrito ({quantity})</>
      ) : (
        <>🛒 Agregar</>
      )}
    </button>
  );
}