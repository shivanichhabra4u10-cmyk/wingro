import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, saveCart as saveCartApi, clearCart as clearCartApi } from '../services/cartService';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
}

interface CartContextType {
  cart: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: any): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(i => i.productId === action.item.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === action.item.productId
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter(i => i.productId !== action.productId) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    default:
      return state;
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  // Load cart from backend or localStorage on mount/login
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          const backendCart = await fetchCart();
          dispatch({ type: 'CLEAR_CART' });
          backendCart.forEach((item: CartItem) => {
            dispatch({ type: 'ADD_TO_CART', item });
          });
        } catch {
          // fallback to localStorage if backend fails
          const stored = localStorage.getItem('cart');
          if (stored) {
            const items = JSON.parse(stored).items || [];
            dispatch({ type: 'CLEAR_CART' });
            items.forEach((item: CartItem) => {
              dispatch({ type: 'ADD_TO_CART', item });
            });
          }
        }
      } else {
        // Not logged in, use localStorage
        const stored = localStorage.getItem('cart');
        if (stored) {
          const items = JSON.parse(stored).items || [];
          dispatch({ type: 'CLEAR_CART' });
          items.forEach((item: CartItem) => {
            dispatch({ type: 'ADD_TO_CART', item });
          });
        }
      }
    };
    loadCart();
  }, [isAuthenticated]);

  // Persist cart to backend/localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated) {
      // Only call saveCartApi if authenticated
      saveCartApi(cart.items).catch(() => {});
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', item });
  };
  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });
  };
  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    if (isAuthenticated) {
      await clearCartApi();
    }
  };
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
