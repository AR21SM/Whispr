import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import FlowChart from '../components/ui/FlowChart';

const HomePage = () => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mb-8 inline-block"
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Shield className="h-24 w-24 text-purple-500 mx-auto" />
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Whispr
              </span>
            </motion.h1>

            <motion.p 
              className="text-2xl md:text-3xl text-gray-300 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Anonymous Crime Reporting Platform
            </motion.p>

            <motion.p 
              className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Report illegal activities securely and anonymously using blockchain technology.
              Your identity stays protected while making the world safer.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/report">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="group relative overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
                    animate={{
                      scale: [1, 1.5, 1.8, 1],
                      opacity: [0.5, 0.8, 0, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  <span className="relative">Report Activity</span>
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-gray-800 hover:bg-gray-700"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </section>

      {/* How It Works Section */}
      <FlowChart />

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <motion.div
          className="container mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-1 rounded-3xl overflow-hidden">
            <div className="relative bg-gray-900/80 backdrop-blur-xl p-12 rounded-3xl">
              <div className="max-w-3xl mx-auto text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="mb-8"
                >
                  <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Make a Difference Anonymously
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Your anonymous reports can help authorities take action against illegal activities.
                  Start reporting today with complete privacy and security.
                </p>
                <Link to="/report">
                  <Button variant="primary" size="lg" className="min-w-[200px]">
                    Start Reporting
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;