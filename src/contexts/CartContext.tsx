import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, CartState, Product } from '../data/types';
import { getFromStorage, setToStorage, generateId } from '../utils/helpers';

// Cart Context Types
interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItem: (productId: string) => CartItem | undefined;
  isInCart: (productId: string) => boolean;
}

// Cart Actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Initial State
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'LOAD_CART': {
      const { totalItems, totalPrice } = calculateTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
        isLoading: false,
      };
    }

    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + action.payload.quantity,
                  item.maxQuantity
                ),
              }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      const { totalItems, totalPrice } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const { totalItems, totalPrice } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? {
              ...item,
              quantity: Math.min(
                Math.max(action.payload.quantity, 1),
                item.maxQuantity
              ),
            }
          : item
      );

      const { totalItems, totalPrice } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    default:
      return state;
  }
};

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = getFromStorage<CartItem[]>('cart');
        if (storedCart && Array.isArray(storedCart)) {
          dispatch({ type: 'LOAD_CART', payload: storedCart });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      setToStorage('cart', state.items);
    }
  }, [state.items, state.isLoading]);

  // Add item to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    if (!product.inStock || quantity <= 0) {
      return;
    }

    const cartItem: CartItem = {
      id: generateId(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity: Math.min(quantity, product.stockQuantity),
      maxQuantity: product.stockQuantity,
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Get cart item by product ID
  const getCartItem = (productId: string): CartItem | undefined => {
    return state.items.find(item => item.productId === productId);
  };

  // Check if product is in cart
  const isInCart = (productId: string): boolean => {
    return state.items.some(item => item.productId === productId);
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper hooks
export const useCartItems = () => {
  const { state } = useCart();
  return state.items;
};

export const useCartTotal = () => {
  const { state } = useCart();
  return {
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
  };
};

export const useCartLoading = () => {
  const { state } = useCart();
  return state.isLoading;
};

export const useCartItemCount = () => {
  const { state } = useCart();
  return state.totalItems;
};