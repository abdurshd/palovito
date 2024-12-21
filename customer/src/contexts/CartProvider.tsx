import { useReducer, ReactNode } from 'react';
import { CartState, cartReducer, CartItem } from '../utils/cartUtils';
import { CartContext } from './CartContext.context.js';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 } as CartState);

  const value = {
    ...state,
    addToCart: (item: CartItem) => dispatch({ type: 'ADD_TO_CART', payload: item }),
    removeFromCart: (menuId: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: menuId }),
    updateQuantity: (menuId: string, quantity: number) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { menuId, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 