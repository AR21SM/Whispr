
import React from 'react';
import Navbar from '../layout/Navbar';
import HeroSection from './HeroSection';
import AnimatedBands from './AnimatedBands';
import FeatureHighlights from './FeatureHighlights';
import BackgroundEffects from '../ui/BackgroundEffects';
import useWalletConnect from '../wallet/WalletConnect';
import Notification from '../ui/Notification';

const Home = () => {
  const { error, successMessage, setError, setSuccessMessage } = useWalletConnect();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Navigation */}
      {/* <Navbar /> */}
      
      {/* Notifications */}
      {successMessage && (
        <Notification 
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      
      {error && (
        <Notification 
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      
      {/* Background Elements */}
      <BackgroundEffects />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Animated Bands */}
      <AnimatedBands />

      {/* Feature Highlights */}
      <FeatureHighlights />
    </div>
  );
};

export default Home;