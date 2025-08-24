import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../../data/types';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../contexts/CartContext';
import { useAnalytics } from '../../hooks/useProducts';
import { useWishlist } from '../../contexts/WishlistContext';
import Button from '../ui/Button';
import QuickViewModal from '../ui/QuickViewModal';

interface QuickViewProduct extends Product {
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { trackEvent } = useAnalytics();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product, 1);
    trackEvent('add_to_cart', { productId: product.id });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
    trackEvent('product_quick_view', { productId: product.id });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      trackEvent('remove_from_wishlist', { productId: product.id });
    } else {
      addToWishlist(product);
      trackEvent('add_to_wishlist', { productId: product.id });
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const enrichedProduct = {
    ...product,
    imageUrl: product.images[0]?.startsWith('http') 
      ? product.images[0] 
      : `http://localhost:3002${product.images[0]}`
  } as QuickViewProduct;

  return (
    <>
      <div 
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black dark:from-gray-800 dark:to-black 
      hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="aspect-square overflow-hidden rounded-t-2xl bg-gray-800 relative">
          <img
            src={product.images[0]?.startsWith('http') ? product.images[0] : `http://localhost:3002${product.images[0]}`}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg">
              -{discountPercentage}%
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlistClick}
              className={`p-2 backdrop-blur-sm rounded-full shadow-md transition-colors ${
                isInWishlist(product.id)
                  ? 'bg-pink-500 text-white hover:bg-pink-600'
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              }`}
              aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart 
                className="w-5 h-5" 
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'} 
              />
            </button>
          </div>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
          >
            Quick View
          </button>

          {/* Out of Stock Badge */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-semibold text-xl">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <p className="text-sm text-blue-400 dark:text-blue-300 font-medium uppercase tracking-wider mb-2">
            {product.category}
          </p>
          
          {/* Name */}
          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-400">
              ({product.reviewCount})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      <div className="p-6 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full group ${
            isInCart(product.id)
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
          } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
          size="lg"
        >
          <ShoppingCart className={`h-5 w-5 mr-2 transition-transform duration-300 ${
            isInCart(product.id) ? 'scale-110' : 'group-hover:scale-110'
          }`} />
          {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
        </Button>
      </div>
    </div>

    <QuickViewModal
      product={enrichedProduct}
      isOpen={isQuickViewOpen}
      onClose={() => setIsQuickViewOpen(false)}
      onAddToCart={() => {
        addToCart(product, 1);
        trackEvent('add_to_cart', { productId: product.id });
      }}
    />
    </>
  );
};

export default ProductCard;