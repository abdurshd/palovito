import type { Menu } from '../types/Menu';

export interface CartItem {
  menuItem: Menu;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { menuId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

export interface CartContextType extends CartState {
  addToCart: (item: CartItem) => void;
  removeFromCart: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearCart: () => void;
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        item => item.menuItem.id === action.payload.menuItem.id
      );

      const items = existingItem
        ? state.items.map(item =>
            item.menuItem.id === action.payload.menuItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        : [...state.items, action.payload];

      return {
        items,
        total: calculateTotal(items),
      };
    }
    case 'REMOVE_FROM_CART': {
      const items = state.items.filter(item => item.menuItem.id !== action.payload);
      return {
        items,
        total: calculateTotal(items),
      };
    }
    case 'UPDATE_QUANTITY': {
      const items = state.items.map(item =>
        item.menuItem.id === action.payload.menuId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        items,
        total: calculateTotal(items),
      };
    }
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
      };
    default:
      return state;
  }
}

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
}