import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground from '../ui/AnimatedBackground';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            className="container mx-auto px-4 py-6 min-h-[calc(100vh-160px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;