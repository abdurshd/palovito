import { createContext } from 'react';
import { CartContextType } from '../utils/cartUtils';

export const CartContext = createContext<CartContextType | undefined>(undefined); 