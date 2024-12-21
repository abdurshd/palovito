import { useCart as useCartContext } from '../contexts/CartContext';
import type { Menu } from '../types/Menu';

export interface CartItem {
  menuItem: Menu;
  quantity: number;
}

// Re-export the useCart hook from the context
export const useCart = useCartContext; 