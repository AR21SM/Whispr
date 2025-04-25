import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';

import { Web3Provider } from './context/Web3Context';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import AuthorityPage from './pages/AuthorityPage';
import ChatPage from './pages/ChatPage';
import ReportViewPage from './pages/ReportViewPage'; // Add this import
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // Add this import
import NotFoundPage from './pages/NotFoundPage';
import './App.css';


function App() {
  return (
    <Web3Provider>
      <AnimatePresence mode="wait">

     
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="report/:id" element={<ReportViewPage />} /> {/* Add this route */}
          <Route path="authority" element={<AuthorityPage />} />
          <Route path="chat/:reportId" element={<ChatPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} /> {/* Add this route */}
          <Route path="*" element={<NotFoundPage />} />
          
        </Route>
      </Routes>
      </AnimatePresence>
  </Web3Provider>
  );
}

export default App;