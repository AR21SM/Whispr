import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Lock, Upload, Dribbble as ChatBubble, Database, Check,BadgeCheck ,Trophy, FileLock2,MessageSquare   } from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQ from '../features/home/FAQ';
import HowItWorks from '../features/home/HowItWorks';
import FloatingIcons from '../components/three/FloatingIcons';
import { useWeb3 } from '../context/Web3Context';

const HomePage = () => {
  const { connectWallet } = useWeb3();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Responsive */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-[calc(70vh-60px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-4 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-10 sm:-right-20 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-primary-500/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-1/4 -left-10 sm:-left-20 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-secondary-500/10 rounded-full filter blur-3xl" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6"
          >
            <FloatingIcons />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-primary-400">
              Decentralized Crime
            </span>
            <br />
            <span className="text-white">Reporting Platform</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0"
          >
            Report illegal activities anonymously and earn rewards for verified reports. Your identity stays protected through blockchain technology.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
          >
            <Link to="/report" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
              >
                Start Reporting
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
              onClick={() => {
                const element = document.getElementById('learn-more');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

    {/* Stats Section - Responsive */}
<section className="py-8 sm:py-12 lg:py-16 relative">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {[
        { 
          title: 'Incognito Shield', 
          description: 'Zero-knowledge encryption guards every submission.', 
          icon: Shield
        },
        { 
          title: 'Truth Rewarded', 
          description: 'Submit solid evidence and reap powerful token incentives.', 
          icon: Trophy
        },
        { 
          title: 'Timeless Records', 
          description: 'Your evidence lives forever on a secure, decentralized ledger.', 
          icon: FileLock2    
        }
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ 
            scale: 1.03,
            boxShadow: "0 0 15px 2px rgba(101, 75, 228, 0.2)",
            transition: { 
              duration: 0.4, 
              ease: "easeOut" 
            }
          }}
          className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl flex flex-col items-center text-center cursor-pointer transition-all"
        >
          <motion.div 
            className="bg-dark-700/50 p-2 sm:p-3 rounded-full mb-3 sm:mb-4 transition-all duration-300"
            whileHover={{ 
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
              <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary-400" />
            </motion.div>
          </motion.div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{stat.title}</h3>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{stat.description}</p>
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
      ))}
    </div>
  </div>
</section>

      {/* Features Section - Responsive */}
      <section id="learn-more" className="py-12 sm:py-16 lg:py-24 relative">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12 sm:mb-16"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gradient">Powerful Features</h2>
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: "100px" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-4 sm:mb-6"
      />
      <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0">
        Built on the blockchain, our platform offers cutting-edge security and anonymity features.
      </p>
    </motion.div>

    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
    >
      {[
        {
          title: 'Total Anonymity',
          description: 'Your identity is never revealed at any point in the reporting process through zero-knowledge proofs.',
          icon: Shield
        },
        {
          title: 'Token Staking',
          description: 'Stake tokens to verify report authenticity, with rewards for genuine reports.',
          icon: Lock
        },
        {
          title: 'Evidence Upload',
          description: 'Securely upload text, photos, and videos as evidence to support your report.',
          icon: Upload
        },
        {
          title: 'Authority Verification',
          description: 'Verified authorities review reports without ever knowing the reporter\'s identity.',
          icon: BadgeCheck 
        },
        {
          title: 'Anonymous Chat',
          description: 'Communicate with authorities while maintaining complete anonymity.',
          icon: MessageSquare
        },
        {
          title: 'Blockchain Storage',
          description: 'All data securely stored on the blockchain\'s decentralized network.',
          icon: Database
        }
      ].map((feature, index) => (
        <motion.div
          key={index}
          variants={item}
          whileHover={{ 
            scale: 1.03,
            boxShadow: "0 0 15px 2px rgba(101, 75, 228, 0.2)",
            transition: { 
              duration: 0.4, 
              ease: "easeOut" 
            }
          }}
          className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl h-full cursor-pointer transition-all"
        >
          <motion.div 
            className="bg-dark-700/50 p-2 sm:p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300"
            whileHover={{ 
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
              <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
            </motion.div>
          </motion.div>
          <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-white mb-2 sm:mb-3">{feature.title}</h3>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{feature.description}</p>
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
      ))}
    </motion.div>
  </div>
</section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* FAQ Section */}
      <section id="faq">
        <FAQ />
      </section>
    </div>
  );
};

export default HomePage;