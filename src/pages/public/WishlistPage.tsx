import React from 'react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import Button from '../../components/ui/Button';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const WishlistPage: React.FC = () => {
  const { state: wishlistState, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistState.items.length === 0) {
    return (
      <div className="min-h-screen bg-black dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Heart className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            <h1 className="text-4xl font-bold text-white mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-400 mb-8">Browse our products and add some items to your wishlist!</p>
            <Link to="/shop">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">My Wishlist</h1>
            <Button
              onClick={clearWishlist}
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
            >
              Clear Wishlist
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistState.items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
            >
              <Link to={`/product/${item.id}`}>
                <div className="aspect-w-16 aspect-h-12 bg-gray-900">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div className="p-6">
                <Link to={`/product/${item.id}`}>
                  <h3 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-gray-400 mb-4 line-clamp-2">{item.product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">
                    {formatPrice(item.product.price)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => removeFromWishlist(item.id)}
                      variant="outline"
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => addToCart(item.product, 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
