import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, MessageSquare, CheckCircle, XCircle, Wallet, FileText, AlertTriangle } from 'lucide-react';

const FlowChart = () => {
  const steps = [
    {
      id: 'connect',
      title: 'Connect Wallet',
      icon: Wallet,
      description: 'Connect securely with blockchain',
      color: 'from-purple-600 to-indigo-600'
    },
    {
      id: 'report',
      title: 'Submit Report',
      icon: FileText,
      description: 'Description, Evidence, Location',
      color: 'from-indigo-600 to-blue-600'
    },
    {
      id: 'stake',
      title: 'Stake Tokens',
      icon: Lock,
      description: 'Stake to verify authenticity',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'review',
      title: 'Authority Review',
      icon: Shield,
      description: 'Secure verification process',
      color: 'from-cyan-600 to-teal-600'
    },
    {
      id: 'chat',
      title: 'Anonymous Chat',
      icon: MessageSquare,
      description: 'Encrypted communication',
      color: 'from-teal-600 to-green-600'
    }
  ];

  const outcomes = [
    {
      id: 'valid',
      title: 'Valid Report',
      icon: CheckCircle,
      description: '10x Token Reward',
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'invalid',
      title: 'False Report',
      icon: XCircle,
      description: 'Tokens Burned',
      color: 'from-red-600 to-rose-600'
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              How Whispr Works
            </span>
          </h2>
          <p className="text-gray-400">Secure and anonymous reporting process</p>
        </motion.div>

        <div className="relative">
          {/* Main Flow */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className={`bg-gradient-to-br ${step.color} p-[1px] rounded-2xl`}>
                  <div className="bg-gray-900 p-6 rounded-2xl h-full">
                    <div className="flex flex-col items-center text-center">
                      <motion.div
                        className="h-16 w-16 rounded-full bg-black/30 flex items-center justify-center mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <step.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-300">{step.description}</p>
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <motion.div 
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500/50 to-indigo-500/50"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Outcomes */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {outcomes.map((outcome) => (
              <motion.div
                key={outcome.id}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${outcome.color} p-[1px] rounded-2xl`}
              >
                <div className="bg-gray-900 p-6 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="h-12 w-12 rounded-full bg-black/30 flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <outcome.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{outcome.title}</h3>
                      <p className="text-sm text-gray-300">{outcome.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Security Notice */}
          <motion.div 
            className="mt-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-[1px] rounded-2xl">
              <div className="bg-gray-900 p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-900/30 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Security Guarantee</h4>
                    <p className="text-gray-300">
                      Your identity remains completely anonymous through blockchain technology. 
                      All communications are end-to-end encrypted and evidence is stored securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FlowChart;