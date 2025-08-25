import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, Lock, MessageSquare } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Connect & Verify',
      description: 'Connect your wallet anonymously through zero-knowledge proofs',
      icon: Shield,
      color: 'bg-primary-500'
    },
    {
      id: 2,
      title: 'Submit Evidence',
      description: 'Upload encrypted evidence securely to the blockchain',
      icon: Upload,
      color: 'bg-secondary-500'
    },
    {
      id: 3,
      title: 'Stake Tokens',
      description: 'Stake tokens to validate your report\'s authenticity',
      icon: Lock,
      color: 'bg-primary-400'
    },
    {
      id: 4,
      title: 'Authority Review',
      description: 'Verified authorities review while maintaining your anonymity',
      icon: MessageSquare,
      color: 'bg-secondary-400'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 relative">
      <div className="absolute inset-0 bg-dark-800/30" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white">How It Works</h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-4 sm:mb-6"
          />
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
            Four simple steps to anonymously report and get rewarded
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line connecting steps - hidden on mobile */}
          <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-primary-500 via-secondary-500 to-primary-500 transform -translate-x-1/2"></div>
          
          <div className="space-y-8 sm:space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:text-left lg:pl-16'} pb-6 sm:pb-8 lg:pb-0 text-center lg:text-left`}>
                  <motion.div 
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 0 15px 2px rgba(101, 75, 228, 0.2)",
                      transition: { 
                        duration: 0.4, 
                        ease: "easeOut" 
                      }
                    }}
                    className={`glass-card p-4 sm:p-6 lg:p-8 rounded-xl inline-block max-w-xs sm:max-w-sm lg:max-w-md transition-all cursor-pointer`}
                  >
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">{step.title}</h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{step.description}</p>
                    <motion.div 
                      initial={{ width: 0 }}
                      className="h-0.5 bg-gradient-to-r from-secondary-400 to-primary-400 mt-3 sm:mt-4"
                      whileHover={{ 
                        width: "80%", 
                        transition: { 
                          duration: 0.6, 
                          ease: "easeInOut" 
                        }
                      }}
                    />
                  </motion.div>
                </div>
                
                <div className="flex justify-center relative z-10">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    whileHover={{
                      boxShadow: "0 0 15px 2px rgba(101, 75, 228, 0.3)",
                      transition: { duration: 0.4, ease: "easeOut" }
                    }}
                    className={`rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${step.color} flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0 shadow-lg transition-all`}
                  >
                    {step.id}
                  </motion.div>
                </div>
                
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-left lg:pl-16' : 'lg:text-right lg:pr-16'} pt-6 sm:pt-8 lg:pt-0 text-center lg:text-left`}>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.1, duration: 0.5 }}
                    className="flex md:justify-center"
                  >
                    <motion.div 
                      className={`bg-dark-700/50 p-3 sm:p-4 rounded-full cursor-pointer transition-all duration-300`}
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 0 15px 2px rgba(101, 75, 228, 0.3)",
                        backgroundColor: "rgba(101, 75, 228, 0.15)",
                        transition: { 
                          duration: 0.5, 
                          ease: "easeInOut" 
                        } 
                      }}
                    >
                      <motion.div
                        whileHover={{ 
                          rotate: [0, -5, 5, -3, 0],
                          transition: { 
                            duration: 0.8, 
                            ease: "easeInOut",
                            times: [0, 0.2, 0.5, 0.8, 1] 
                          }
                        }}
                      >
                        <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;