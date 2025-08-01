import React, { createContext, useContext, useReducer, useEffect } from "react";
import { User, AuthState, LoginForm, SignupForm } from "../data/types";
import {
  getFromStorage,
  setToStorage,
  removeFromStorage,
} from "../utils/helpers";

// API base URL
const API_BASE_URL = "http://localhost:3002/api";

// Auth Context Types
interface AuthContextType {
  state: AuthState;
  login: (
    credentials: LoginForm
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    userData: SignupForm
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Auth Actions
type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> };

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = getFromStorage<User>("user");
        const storedToken = getFromStorage<string>("authToken");

        if (storedUser && storedToken) {
          // In a real app, you would validate the token with the server
          dispatch({ type: "LOGIN_SUCCESS", payload: storedUser });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        dispatch({ type: "LOGIN_FAILURE" });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (
    credentials: LoginForm
  ): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        const { user, token } = data.data;

        // Store user and token
        setToStorage("user", user);
        setToStorage("authToken", token);

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return { success: true };
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch({ type: "LOGIN_FAILURE" });
      return { success: false, error: "Network error. Please try again." };
    }
  };

  // Signup function
  const signup = async (
    userData: SignupForm
  ): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const { user, token } = data.data;

        // Store user and token
        setToStorage("user", user);
        setToStorage("authToken", token);

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return { success: true };
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        return { success: false, error: data.error || "Signup failed" };
      }
    } catch (error) {
      console.error("Signup error:", error);
      dispatch({ type: "LOGIN_FAILURE" });
      return { success: false, error: "Network error. Please try again." };
    }
  };

  // Logout function
  const logout = () => {
    removeFromStorage("user");
    removeFromStorage("authToken");
    dispatch({ type: "LOGOUT" });
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      setToStorage("user", updatedUser);
      dispatch({ type: "UPDATE_USER", payload: userData });
    }
  };

  const value: AuthContextType = {
    state,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper hooks
export const useUser = () => {
  const { state } = useAuth();
  return state.user;
};

export const useIsAuthenticated = () => {
  const { state } = useAuth();
  return state.isAuthenticated;
};

export const useIsAdmin = () => {
  const { state } = useAuth();
  return state.user?.role === "admin";
};

export const useAuthLoading = () => {
  const { state } = useAuth();
  return state.isLoading;
};
