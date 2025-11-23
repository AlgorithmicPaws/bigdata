import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { TrackDetail } from '../api/types';
import type { CartItem, CartState, CartContextType } from '../types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'chinook_cart';

// Función para cargar el carrito desde localStorage
function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }
  return [];
}

// Función para guardar el carrito en localStorage
function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
}

// Función para calcular el total del carrito
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = parseFloat(item.track.UnitPrice);
    return total + (price * item.quantity);
  }, 0);
}

// Función para calcular la cantidad total de items
function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  // Calcular estado derivado
  const itemCount = calculateItemCount(items);
  const total = calculateTotal(items);

  // Persistir en localStorage cuando cambian los items
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // Agregar un track al carrito
  const addToCart = (track: TrackDetail, quantity: number = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.track.TrackId === track.TrackId);

      if (existingItem) {
        // Si ya existe, aumentar la cantidad
        return currentItems.map(item =>
          item.track.TrackId === track.TrackId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, agregarlo
        return [...currentItems, { track, quantity }];
      }
    });
  };

  // Remover un track del carrito
  const removeFromCart = (trackId: number) => {
    setItems(currentItems => currentItems.filter(item => item.track.TrackId !== trackId));
  };

  // Actualizar la cantidad de un track
  const updateQuantity = (trackId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(trackId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.track.TrackId === trackId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Limpiar todo el carrito
  const clearCart = () => {
    setItems([]);
  };

  // Verificar si un track está en el carrito
  const isInCart = (trackId: number): boolean => {
    return items.some(item => item.track.TrackId === trackId);
  };

  // Obtener la cantidad de un track específico
  const getItemQuantity = (trackId: number): number => {
    const item = items.find(item => item.track.TrackId === trackId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    items,
    itemCount,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook personalizado para usar el carrito
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}