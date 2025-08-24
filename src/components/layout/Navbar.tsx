import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search,
  LogOut,
  Settings,
  Package,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth, useIsAuthenticated, useIsAdmin } from '../../contexts/AuthContext';
import { useCartItemCount } from '../../contexts/CartContext';
import SearchBar from '../common/SearchBar';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const cartItemCount = useCartItemCount();
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.nav 
      className="sticky top-0 z-40 bg-gradient-to-b from-black/90 to-gray-900/90 backdrop-blur-lg border-b border-gray-800/20"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <Package className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white p-1.5 rounded-xl transform group-hover:scale-110 transition-transform duration-300" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                MiniU
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="relative text-gray-400 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-all duration-300 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-400 hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-gray-800 group"
            >
              <Heart className="h-6 w-6 transform group-hover:scale-110 transition-transform duration-300" />
            </Link>
            <Link
              to="/cart"
              className="relative p-2 text-gray-400 hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-gray-800 group"
            >
              <ShoppingCart className="h-6 w-6 transform group-hover:scale-110 transition-transform duration-300" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg transform scale-100 group-hover:scale-110 transition-transform duration-300">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-gray-800 group"
                >
                  {state.user?.avatar ? (
                    <img
                      src={state.user.avatar}
                      alt={state.user.name}
                      className="h-8 w-8 rounded-lg object-cover transform group-hover:scale-110 transition-transform duration-300 ring-2 ring-blue-500/30"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium">
                    {state.user?.name}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-black/95 rounded-2xl shadow-xl py-2 z-50 border border-gray-700/30 backdrop-blur-lg">
                    <div className="px-4 py-3 text-sm border-b border-gray-800/50">
                      <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {state.user?.name}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{state.user?.email}</p>
                    </div>
                    
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800/50 transition-all duration-300 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3 text-blue-400 transform group-hover:rotate-90 transition-transform duration-300" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800/50 transition-all duration-300 group"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-blue-400 transform group-hover:translate-x-1 transition-transform duration-300" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-xl hover:bg-gray-800"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-3 py-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/wishlist"
                className="block px-3 py-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <div className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Wishlist
                </div>
              </Link>
            </div>
            <div className="px-2 pt-4">
              <SearchBar />
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
