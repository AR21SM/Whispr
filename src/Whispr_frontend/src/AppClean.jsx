import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import DashboardPageClean from './pages/DashboardPageClean';
import AuthorityPageClean from './pages/AuthorityPageClean';
import ReportViewPage from './pages/ReportViewPage';
import ChatPage from './pages/ChatPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/wallet/ProtectedRoute';
import AuthorityProtectedRoute from './components/wallet/Authority/AuthorityProtectedRoute';
import { Web3Provider } from './context/Web3Context';

function App() {
  return (
    <Web3Provider>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            
            <Route 
              path="report" 
              element={
                <ProtectedRoute>
                  <ReportPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPageClean />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="report/:id" 
              element={
                <ProtectedRoute>
                  <ReportViewPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="authority" 
              element={
                <AuthorityProtectedRoute>
                  <AuthorityPageClean />
                </AuthorityProtectedRoute>
              } 
            />
            
            <Route 
              path="chat" 
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsOfServicePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Web3Provider>
  );
}

export default App;
