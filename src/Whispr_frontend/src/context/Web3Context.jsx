import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTokenBalance, initializeNewUser } from '../api/whisprBackend';

const Web3Context = createContext(undefined);

export const Web3Provider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize user with 250 tokens on first visit
  useEffect(() => {
    initializeNewUser();
    loadTokenBalance();
    
    // Listen for token balance updates
    const handleBalanceUpdate = (event) => {
      setBalance(event.detail.newBalance);
    };
    
    window.addEventListener('tokenBalanceUpdated', handleBalanceUpdate);
    
    return () => {
      window.removeEventListener('tokenBalanceUpdated', handleBalanceUpdate);
    };
  }, []);

  const loadTokenBalance = async () => {
    try {
      const tokenBalance = await getTokenBalance();
      setBalance(tokenBalance);
    } catch (error) {
      console.error('Error loading token balance:', error);
      setBalance(250); // Default for new users
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // In production, this would connect to Internet Computer's Plug wallet
      setIsConnected(true);
      setAddress('2vxsx-fae'); // Example Internet Computer principal ID
      
      // Load actual token balance from backend
      await loadTokenBalance();
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setBalance(250); // Fallback to default
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    // Keep the balance for offline use
  };

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        connectWallet,
        disconnectWallet,
        address,
        balance,
        isLoading,
        refreshBalance: loadTokenBalance,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};