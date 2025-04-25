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
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

import AuthorityChatPage from './pages/AuthorityChatPage';

function App() {
  return (
    <Web3Provider>
      <AnimatePresence mode="wait">

     
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="authority" element={<AuthorityPage />} />
          <Route path="chat/:reportId" element={<ChatPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="authority/chat/:reportId" element={<AuthorityChatPage />} />
        </Route>
      </Routes>
      </AnimatePresence>
  </Web3Provider>
  );
}

export default App;