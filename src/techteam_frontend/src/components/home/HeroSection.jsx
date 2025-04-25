
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();

  // Enhanced floating animation for the hero section
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    
    const image = hero.querySelector('.hero-image');
    if (!image) return;
    
    let yPos = 0;
    let direction = 1;
    const speed = 0.2;
    const maxOffset = 15;
    
    const animateFloat = () => {
      yPos += speed * direction;
      
      if (yPos > maxOffset) {
        direction = -1;
      } else if (yPos < -maxOffset) {
        direction = 1;
      }
      
      image.style.transform = `translateY(${yPos}px)`;
      requestAnimationFrame(animateFloat);
    };
    
    const floatAnimation = requestAnimationFrame(animateFloat);
    return () => cancelAnimationFrame(floatAnimation);
  }, []);

  const handleSubmitReport = () => {
    navigate('/report');
  };

  return (
    <div ref={heroRef} className="px-8 py-12 md:py-10 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
      {/* Left Column - Text */}
      <div className="md:w-1/2 z-10">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
          Expose Crimes, Stay Anonymous
        </h1>
        <p className="text-xl mb-8 text-gray-700">
          Report illegal activity, get rewarded — no identity needed. Blockchain protected, completely secure.
        </p>
        <div className="mb-12 flex space-x-4">
          <button 
            onClick={handleSubmitReport}
            className="bg-indigo-600 text-white rounded-lg px-8 py-3 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Report Crime
          </button>
          <button className="bg-transparent border-2 border-indigo-600 text-indigo-600 rounded-lg px-8 py-3 font-bold hover:bg-indigo-50 transition-all duration-300">
            Learn More
          </button>
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-xl shadow-lg border-l-4 border-teal-500">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Blockchain Powered Anonymity
          </h2>
          <p className="text-lg text-gray-700">
            Internet Computer (ICP) technology ensures your identity remains protected
            while you help make the world safer.
          </p>
        </div>
      </div>
      
      {/* Right Column - Image with floating animation */}
      <div className="md:w-1/2 flex justify-center mt-12 md:mt-0 relative">
        <div className="relative w-96 h-96 hero-image transition-transform duration-1000 ease-in-out">
          <div className="absolute -top-8 -left-8 w-full h-full bg-indigo-100 rounded-full"></div>
          <div className="absolute -bottom-8 -right-8 w-full h-full bg-teal-100 rounded-full"></div>
          <div className="relative w-full h-full">
            <img
              src="/assets/blockchain.png"
              alt="Blockchain Illustration"
              className="z-10 drop-shadow-2xl absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;