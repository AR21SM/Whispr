import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import hello from '../../assets/hello.png'
const Home = () => {
  const bandsRef = useRef(null);
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

  // Improved band animations with smoother movement and better visuals
  useEffect(() => {
    const bands = bandsRef.current;
    if (!bands) return;

    const tealBands = bands.querySelectorAll('.teal-band');
    const indigoBands = bands.querySelectorAll('.indigo-band');
    
    let offset = 0;
    const speed = 0.3;

    const animate = () => {
      offset = (offset + speed) % 100;
      
      tealBands.forEach((band, i) => {
        const position = (offset + (i * 50)) % 200 - 100;
        band.style.transform = `translateX(${position}%) rotate(-3deg)`;
        band.style.opacity = `${0.9 - (Math.abs(position) / 200)}`;
      });
      
      indigoBands.forEach((band, i) => {
        const position = 100 - (offset + (i * 50)) % 200;
        band.style.transform = `translateX(${position}%) rotate(3deg)`;
        band.style.opacity = `${0.9 - (Math.abs(position) / 200)}`;
      });
      
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleSubmitReport = () => {
    navigate('/report');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal-100 opacity-30 blur-3xl"></div>
      <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
      
      {/* Hero Section with enhanced layout */}
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
                src={hello}
                alt="Blockchain Illustration"
                className="z-10 drop-shadow-2xl absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Improved Animated Bands with better colors and smoother motion */}
      <div ref={bandsRef} className="relative overflow-hidden h-64 mt-16">
        {/* Teal bands instead of yellow */}
        <div className="teal-band absolute h-16 bg-gradient-to-r from-teal-400 to-teal-500 w-full origin-center transform -rotate-3 flex items-center justify-around px-4 top-0 left-0 right-0 shadow-md">
          <span className="text-xl font-bold text-white">Report It</span>
          <span className="text-xl font-bold text-white">Submit Evidence</span>
          <span className="text-xl font-bold text-white">Stay Anonymous</span>
          <span className="text-xl font-bold text-white">Get Rewarded</span>
        </div>
        
        <div className="teal-band absolute h-16 bg-gradient-to-r from-teal-400 to-teal-500 w-full origin-center transform -rotate-3 flex items-center justify-around px-4 bottom-0 left-0 right-0 shadow-md">
          <span className="text-xl font-bold text-white">Stake Tokens</span>
          <span className="text-xl font-bold text-white">Upload Evidence</span>
          <span className="text-xl font-bold text-white">Keep Identity Hidden</span>
          <span className="text-xl font-bold text-white">Earn Rewards</span>
        </div>
        
        {/* Indigo bands instead of purple */}
        <div className="indigo-band absolute h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 w-full origin-center transform rotate-3 flex items-center justify-around px-4 top-16 left-0 right-0 shadow-md">
          <span className="text-xl font-bold text-white">Verify Report</span>
          <span className="text-xl font-bold text-white">Review Evidence</span>
          <span className="text-xl font-bold text-white">Chat Anonymously</span>
          <span className="text-xl font-bold text-white">Approve Report</span>
        </div>
        
        <div className="indigo-band absolute h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 w-full origin-center transform rotate-3 flex items-center justify-around px-4 bottom-16 left-0 right-0 shadow-md">
          <span className="text-xl font-bold text-white">Analyze Reports</span>
          <span className="text-xl font-bold text-white">Assess Evidence</span>
          <span className="text-xl font-bold text-white">Validate Claims</span>
          <span className="text-xl font-bold text-white">Reward Informers</span>
        </div>
      </div>

      {/* Feature Highlights with improved design */}
      <div className="px-8 py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">How It Works</h2>
        <p className="text-xl text-center mb-12 text-gray-600 max-w-3xl mx-auto">
          Our blockchain-based platform ensures complete anonymity while fighting crime
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Anonymous Reporting */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-teal-500 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Anonymous Reporting</h3>
            <p className="text-center text-gray-600">Submit evidence securely with your identity protected by advanced blockchain technology.</p>
          </div>
          
          {/* Token Staking */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-indigo-500 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Token Staking System</h3>
            <p className="text-center text-gray-600">Stake tokens when reporting to ensure credibility. Receive 10x rewards for verified reports.</p>
          </div>
          
          {/* Secure Communication */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-teal-500 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Secure Communication</h3>
            <p className="text-center text-gray-600">Chat with authorities while maintaining your anonymity through encrypted channels.</p>
          </div>
        </div>
      </div>
      
      {/* Background animation elements */}
      <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-teal-100 opacity-30 blur-2xl"></div>
      <div className="absolute -bottom-8 left-1/3 w-32 h-32 rounded-full bg-indigo-100 opacity-30 blur-xl"></div>
    </div>
  );
};

export default Home;