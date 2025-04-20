import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';; // Import the logo directly

const Navbar = () => {
  return (
    <nav className="px-8 py-6 flex items-center">
      <div className="flex-grow">
        <div className="flex items-center">
          <img src={logo} alt="Whispr Logo" className="h-16 w-auto mr-2" />
          <div className="flex flex-col">
            <div className="font-bold text-3xl text-black">WHISPR</div>
            <div className="text-xs leading-tight">
              <div>AN ANONYMOUS</div>
              <div className="text-xs">CRIME REPORTING SERVICE</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center flex-grow">
        <div className="flex space-x-8">
          <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
          <Link to="/report" className="text-gray-700 hover:text-indigo-600">Report Crime</Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Police Dashboard</Link>
        </div>
      </div>
      <div className="flex-grow"></div>
    </nav>
  );
};

export default Navbar;