import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '../data/types';
// Storage helpers
const getFromStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const setToStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

// Wishlist Types
interface WishlistItem {
  id: string;
  dateAdded: string;
  product: Product;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
}

interface WishlistContextType {
  state: WishlistState;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

// Wishlist Actions
type WishlistAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' };

// Initial State
const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

// Create Context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Reducer
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOAD_WISHLIST':
      return { ...state, items: action.payload, isLoading: false };
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };
    default:
      return state;
  }
}

// Provider Component
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = getFromStorage('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
        } else {
          console.error('Invalid wishlist data format');
          setToStorage('wishlist', '[]');
        }
      } catch (error) {
        console.error('Error parsing wishlist:', error);
        setToStorage('wishlist', '[]');
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      setToStorage('wishlist', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }, [state.items]);

  const addToWishlist = (product: Product) => {
    const wishlistItem: WishlistItem = {
      id: product.id,
      dateAdded: new Date().toISOString(),
      product,
    };
    dispatch({ type: 'ADD_ITEM', payload: wishlistItem });
  };

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (productId: string) => {
    return state.items.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        state,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// Custom Hook
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
