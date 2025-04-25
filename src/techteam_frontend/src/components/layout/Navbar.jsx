import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Moon, Sun, LogIn, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../ui/Button';
import WalletConnectButton from '../wallet/WalletConnectButton'; // Import wallet button component

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Report', path: '/report' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Authority', path: '/authority' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
      }}
      transition={{ duration: 0.2 }}
      className="sticky top-0 z-50 py-4"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="h-8 w-8 text-purple-500" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-bold text-white">Whispr</span>
              <div className="flex items-center">
                <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                <span className="text-xs text-amber-500">Anonymous Reporting</span>
              </div>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group"
                >
                  <span className={`font-medium transition-colors duration-200 hover:text-purple-400 ${
                    isActive(link.path) ? 'text-purple-500' : 'text-gray-300'
                  }`}>
                    {link.name}
                  </span>
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-500"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Replace the static button with the wallet connect button */}
              <WalletConnectButton />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 glass-effect rounded-lg p-4"
            >
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-medium p-2 rounded-md transition-colors duration-200 ${
                      isActive(link.path)
                        ? 'bg-purple-900 bg-opacity-50 text-purple-300'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-gray-700 mt-2">
                  {/* Also update the mobile menu button */}
                  <WalletConnectButton 
                    onSuccess={() => setIsMenuOpen(false)} 
                    size="sm" 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;