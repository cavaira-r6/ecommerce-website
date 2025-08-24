import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../../utils/api';
import type { Product } from '../../data/types';


interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className = '', 
  placeholder = 'Search products...' 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 0) {
        try {
          const results = await searchProducts(query);
          setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else if (query.trim()) {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setQuery(product.name);
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400/70 group-hover:text-blue-400/70 transition-colors duration-300" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="block w-full pl-12 pr-12 py-3.5 rounded-2xl
            bg-white/10 dark:bg-gray-800/10 backdrop-blur-md
            border-2 border-gray-200/20 dark:border-gray-700/30
            text-gray-900 dark:text-white 
            placeholder-gray-500/70 dark:placeholder-gray-400/70
            focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-400/50
            focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
            hover:bg-white/20 dark:hover:bg-gray-800/20
            transition-all duration-300"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400/70 hover:text-red-400/70 transition-colors duration-300" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg
          border border-gray-200/20 dark:border-gray-700/30 
          rounded-2xl shadow-xl max-h-[70vh] overflow-auto
          divide-y divide-gray-100/20 dark:divide-gray-800/30">
          {suggestions.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className={`px-4 py-3 cursor-pointer transition-all duration-300
                first:rounded-t-2xl last:rounded-b-2xl
                ${index === selectedIndex 
                  ? 'bg-gray-50/80 dark:bg-gray-800/80' 
                  : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
                }`}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-500">
                    {product.name}
                  </p>
                  <p className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium truncate">
                    ${product.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {query.trim() && (
            <div
              onClick={handleSearch}
              className="px-4 py-3 text-sm font-medium
                bg-gradient-to-r from-blue-500/10 to-purple-500/10
                hover:from-blue-500/20 hover:to-purple-500/20
                text-blue-600 dark:text-blue-400 
                cursor-pointer transition-all duration-300"
            >
              Search for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 