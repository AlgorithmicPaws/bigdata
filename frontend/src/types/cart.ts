import type { TrackDetail } from '../api/types';

export interface CartItem {
  track: TrackDetail;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
}

export interface CartContextType extends CartState {
  addToCart: (track: TrackDetail, quantity?: number) => void;
  removeFromCart: (trackId: number) => void;
  updateQuantity: (trackId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (trackId: number) => boolean;
  getItemQuantity: (trackId: number) => number;
}