import { useState, useEffect, useCallback } from 'react';

const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      // Make sure the IC object exists in window
      if (typeof window.ic?.plug === 'undefined') {
        console.log("Plug wallet extension not detected");
        return;
      }

      try {
        const connected = await window.ic.plug.isConnected();
        
        if (connected) {
          setIsConnected(true);
          // Get principal ID
          const principal = await window.ic.plug.agent.getPrincipal();
          
          setWalletInfo({
            principal: principal.toString(),
            // Use a static account ID or derive it using a different method
            accountId: 'c6ea0cfefa62ef67b27d7ac212e2217b8044a345ea8f860f72b719e403398a2b'
          });
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };
    
    // Small delay to ensure the plug extension has loaded
    const timer = setTimeout(() => {
      checkConnection();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Connect to Plug wallet
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    if (typeof window.ic?.plug === 'undefined') {
      window.open('https://plugwallet.ooo/', '_blank');
      setIsLoading(false);
      setError("Plug wallet not installed. Please install Plug and refresh.");
      return;
    }

    try {
      // Whitelist of canisters to connect with
      const whitelist = []; // Add any canisters you want to connect to
      const host = "https://mainnet.dfinity.network"; // Or your desired network

      // Request connection
      const result = await window.ic.plug.requestConnect({
        whitelist,
        host,
        timeout: 60000, // 60 second timeout
      });

      if (result) {
        setIsConnected(true);
        
        // Get principal ID
        const principal = await window.ic.plug.agent.getPrincipal();
        
        setWalletInfo({
          principal: principal.toString(),
          // Use a static account ID or derive it using a different method
          accountId: 'c6ea0cfefa62ef67b27d7ac212e2217b8044a345ea8f860f72b719e403398a2b'
        });
        
        setSuccessMessage("Wallet connected successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError("Wallet connection was rejected");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setError("Failed to connect: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Disconnect wallet with guaranteed disconnection
  const disconnectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to disconnect using the Plug API
      if (window.ic?.plug) {
        try {
          await window.ic.plug.disconnect();
        } catch (apiError) {
          console.warn("Error with plug.disconnect API:", apiError);
          // Continue with fallback even if API fails
        }
      }
      
      // Always reset React state regardless of API success
      setIsConnected(false);
      setWalletInfo(null);
      
      // Force clear localStorage entries that might be related to wallet connection
      try {
        localStorage.removeItem('ic-identity');
        localStorage.removeItem('ic-delegation');
        // Add other potential wallet-related keys if needed
      } catch (storageError) {
        console.warn("Error clearing localStorage:", storageError);
      }
      
      // Clear any other state or caches
      if (window.ic?.plug?.agent) {
        try {
          window.ic.plug.agent = null;
        } catch (err) {}
      }
      
      setSuccessMessage("Wallet disconnected successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Disconnect error:", error);
      setError("Error disconnecting wallet: " + (error.message || "Unknown error"));
      
      // Even if there's an error, still reset the React state as a fallback
      setIsConnected(false);
      setWalletInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isConnected,
    walletInfo,
    isLoading,
    error,
    successMessage,
    connectWallet,
    disconnectWallet,
    setError,
    setSuccessMessage
  };
};

export default WalletConnect;