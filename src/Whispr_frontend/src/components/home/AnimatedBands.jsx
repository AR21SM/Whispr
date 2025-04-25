
import React, { useEffect, useRef } from 'react';

const AnimatedBands = () => {
  const bandsRef = useRef(null);

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

  return (
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
  );
};

export default AnimatedBands;