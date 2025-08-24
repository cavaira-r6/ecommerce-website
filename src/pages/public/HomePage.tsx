import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Truck, Shield, Headphones, ArrowUp, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { shuffleArray } from "../../utils/helpers";
import { Product } from "../../data/types";
import ProductCard from "../../components/common/ProductCard";
import Button from "../../components/ui/Button";

const HomePage: React.FC = () => {
  // Animated background is provided by Layout; no body background override here
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Show "scroll to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch featured products
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3002/api/products")
      .then((response) => response.json())
      .then((data) => {
        const transformedProducts = data.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          images: [product.image],
          inStock: product.stockQuantity > 0,
          stockQuantity: product.stockQuantity,
          rating: 4.5,
          reviewCount: 0,
          tags: [],
          createdAt: product.created_at,
        })) as Product[];

        setFeaturedProducts(shuffleArray(transformedProducts).slice(0, 6));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex items-center min-h-[80vh]">
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 dark:from-white dark:to-gray-300"
                >
                  Welcome to MiniU
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl mb-12 text-white/90 dark:text-gray-300 max-w-3xl mx-auto font-light"
                >
                  Discover amazing products at unbeatable prices. Quality, style,
                  and convenience all in one place.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-6 justify-center"
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-96">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && searchQuery.trim()) {
                            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-white/60 border border-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                      <button
                        onClick={() => {
                          if (searchQuery.trim()) {
                            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                          }
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        <Search className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Explore Button */}
                    <Link to="/shop">
                      <Button
                        size="lg"
                        className="group bg-white text-blue-600 hover:bg-blue-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 px-8 py-4 text-lg relative overflow-hidden transform transition-transform hover:scale-105 whitespace-nowrap"
                      >
                        <span className="relative z-10 flex items-center">
                          Explore Products
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1 h-3 bg-white/50 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </section>

  {/* Featured Products Section (transparent so background canvas shows through) */}
  <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
                Featured Products
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Check out our most popular and trending products.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {isLoading
                ? [...Array(6)].map((_, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-800/50 rounded-2xl h-[400px] animate-pulse"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="h-64 bg-gray-700/50 rounded-t-2xl" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-700/50 rounded w-3/4" />
                        <div className="h-4 bg-gray-700/50 rounded w-1/2" />
                        <div className="h-10 bg-gray-700/50 rounded mt-4" />
                      </div>
                    </motion.div>
                  ))
                : featuredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <Link to="/shop">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <span className="relative z-10 flex items-center">
                    View All Products
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

  {/* Features Section (transparent so background canvas shows through) */}
  <section className="py-20 bg-transparent relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5"
            animate={{
              backgroundPosition: ["0px 0px", "100px 100px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                Why Choose MiniU?
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                We're committed to providing you with the best shopping experience possible.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-800"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Fast Shipping</h3>
                <p className="text-gray-300">Free shipping on orders over $50. Get your products delivered quickly and safely.</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-800"
              >
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Secure Shopping</h3>
                <p className="text-gray-300">Your personal information and payment details are always protected with us.</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-800"
              >
                <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">24/7 Support</h3>
                <p className="text-gray-300">Our customer support team is here to help you whenever you need assistance.</p>
              </motion.div>
            </div>
          </div>
        </section>

  {/* Newsletter Section (transparent so background canvas shows through) */}
  <section className="py-20 bg-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
                Stay Updated
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                Subscribe to our newsletter for exclusive deals, new arrivals, and insider-only discounts.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement & { email: { value: string } };
                  const email = form.email.value;
                  try {
                    const res = await fetch("http://localhost:3002/api/newsletter", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    });
                    const result = await res.json();
                    if (result.success) {
                      alert("Thank you for subscribing! Check your email for confirmation.");
                      form.reset();
                    } else {
                      alert(result.error || "Subscription failed. Please try again.");
                    }
                  } catch (err) {
                    alert("Network error. Please try again later.");
                  }
                }}
                className="max-w-md mx-auto"
              >
                <div className="flex gap-4 flex-col sm:flex-row">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-white/60 border border-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-300"
                  >
                    Subscribe
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
            >
              <ArrowUp className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;
