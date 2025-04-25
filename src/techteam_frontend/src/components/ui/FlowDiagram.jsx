import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, MessageSquare, CheckCircle, XCircle, Wallet, FileCheck } from 'lucide-react';

const FlowDiagram = () => {
  const flowSteps = [
    {
      title: 'Connect Wallet',
      icon: Wallet,
      description: 'Securely connect your wallet',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'Submit Report',
      icon: FileCheck,
      description: 'Provide evidence and details',
      color: 'from-purple-600 to-indigo-600'
    },
    {
      title: 'Stake Tokens',
      icon: Lock,
      description: 'Stake tokens to validate report',
      color: 'from-violet-600 to-purple-600'
    },
    {
      title: 'Anonymous Review',
      icon: Shield,
      description: 'Authorities review securely',
      color: 'from-indigo-600 to-blue-600'
    },
    {
      title: 'Secure Chat',
      icon: MessageSquare,
      description: 'Encrypted communication',
      color: 'from-blue-600 to-cyan-600'
    }
  ];

  const outcomes = [
    {
      title: 'Valid Report',
      icon: CheckCircle,
      description: '10x Token Reward',
      color: 'from-emerald-600 to-green-600'
    },
    {
      title: 'False Report',
      icon: XCircle,
      description: 'Tokens Burned',
      color: 'from-red-600 to-rose-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.3,
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="py-20 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            How Whispr Works
          </motion.h2>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Our blockchain-powered platform ensures complete anonymity while enabling secure reporting
          </motion.p>
        </div>

        <div className="relative">
          {/* Main Flow */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {flowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`bg-gradient-to-br ${step.color} p-1 rounded-2xl shadow-xl`}>
                  <div className="bg-gray-900 p-6 rounded-2xl h-full">
                    <div className="flex flex-col items-center text-center">
                      <motion.div
                        className="h-16 w-16 rounded-full bg-opacity-20 bg-white flex items-center justify-center mb-4"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <step.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-300">{step.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Outcomes */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            {outcomes.map((outcome, index) => (
              <motion.div
                key={outcome.title}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${outcome.color} p-1 rounded-2xl shadow-xl`}
              >
                <div className="bg-gray-900 p-6 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <outcome.icon className="h-8 w-8 text-white" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{outcome.title}</h3>
                      <p className="text-sm text-gray-300">{outcome.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Connecting Lines */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block"
            style={{ zIndex: 0 }}
          >
            <motion.path
              d="M200 100 L1000 100"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              variants={lineVariants}
              className="opacity-20"
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default FlowDiagram;