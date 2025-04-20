import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
// import Footer from './components/layout/Footer';
import Home from './pages/Home'; // Changed from lowercase to PascalCase
import ReportCrime from './pages/Submit';
import PoliceDashboard from './pages/PoliceDashboard';
import './index.css';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Changed from lowercase to PascalCase */}
            <Route path="/report" element={<ReportCrime />} />
            <Route path="/dashboard" element={<PoliceDashboard />} />
          </Routes>
        </main>
      
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;