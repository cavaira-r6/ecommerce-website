import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Layout from "./components/layout/Layout";

// Pages
import HomePage from "./pages/public/HomePage";
const ShopPage = React.lazy(() => import("./pages/public/ShopPage"));
const ProductDetailPage = React.lazy(() => import("./pages/public/ProductDetailPage"));
import CartPage from "./pages/public/CartPage";
import WishlistPage from "./pages/public/WishlistPage";
import CheckoutPage from "./pages/public/CheckoutPage";
import ContactPage from "./pages/public/ContactPage";
import AboutPage from "./pages/public/AboutPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CheckoutSuccess from "./pages/public/CheckoutSuccess";
import CheckoutFailure from "./pages/public/CheckoutFailure";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import TermsPage from "./pages/public/TermsPage";

// Routes
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  const base = (import.meta as any).env?.BASE_URL || '/';
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout><Outlet /></Layout>}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
  <Route path="/shop" element={<Suspense fallback={<div /> }><ShopPage /></Suspense>} />
  <Route path="/product/:id" element={<Suspense fallback={<div /> }><ProductDetailPage /></Suspense>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/failure" element={<CheckoutFailure />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Route>
    ),
    {
      basename: base,
      future: {
        v7_relativeSplatPath: true,
      },
    }
  );

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RouterProvider router={router} />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
