import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center group">
              <Package className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white p-1.5 rounded-xl transform group-hover:scale-110 transition-transform duration-300" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                MiniU
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted online destination for quality products at great prices.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Home
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/shop" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Shop
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  About Us
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Contact
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Contact Info
            </h3>
            <div className="space-y-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 group"
              >
                <div className="p-2 rounded-lg bg-gray-800/50 group-hover:bg-gray-800 transition-colors">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-gray-400 text-sm group-hover:text-blue-400 transition-colors">
                  darna
                </span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 group"
              >
                <div className="p-2 rounded-lg bg-gray-800/50 group-hover:bg-gray-800 transition-colors">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-gray-400 text-sm group-hover:text-blue-400 transition-colors">
                  +21628687562
                </span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 group"
              >
                <div className="p-2 rounded-lg bg-gray-800/50 group-hover:bg-gray-800 transition-colors">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-gray-400 text-sm group-hover:text-blue-400 transition-colors">
                  support@miniu.com
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-500 text-sm">
            © {currentYear} MiniU. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-gray-400 hover:text-blue-400 transition-colors text-sm cursor-pointer"
              >
                Privacy Policy
              </motion.span>
            </Link>
            <Link to="/terms">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-gray-400 hover:text-blue-400 transition-colors text-sm cursor-pointer"
              >
                Terms of Service
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
