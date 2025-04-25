import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-effect py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold text-white">Whispr</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Empowering anonymous reporting of illegal activities with blockchain technology for 
              privacy and security.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Report Activity
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Token Info
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/AR21SM/Whispr" 
                className="p-2 rounded-full bg-gray-800 hover:bg-purple-900 transition-colors duration-200"
                aria-label="Github"
              >
                <Github className="h-5 w-5 text-gray-400" />
              </a>
              <a 
            href="https://linkedin.com/in/21ashishmahajan" 
            className="p-2 rounded-full bg-gray-800 hover:bg-purple-900 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5 text-gray-400" />
          </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SecureReport. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-purple-400 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-400 text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;