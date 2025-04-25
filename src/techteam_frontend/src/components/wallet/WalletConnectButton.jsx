import React from 'react';
import useWalletConnect from './WalletConnect';
import { LogIn, LogOut, Wallet, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

// Global notification container - will be created if it doesn't exist
const getNotificationContainer = () => {
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'fixed bottom-4 right-4 z-50 flex flex-col space-y-2';
    document.body.appendChild(container);
  }
  return container;
};

// Add animation keyframes style to head
const addAnimationStyles = () => {
  if (!document.getElementById('notification-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-animation-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .animate-slide-in {
        animation: slideInRight 0.3s forwards;
      }
    `;
    document.head.appendChild(style);
  }
};

// Call this once to ensure animations are defined
addAnimationStyles();

const Notification = ({ type, message, onClose }) => {
  return createPortal(
    <div 
      className={`max-w-sm p-4 rounded-lg shadow-lg flex items-center justify-between animate-slide-in ${
        type === 'success' 
          ? 'bg-purple-900 text-purple-100 border-l-4 border-purple-400' 
          : 'bg-red-900 text-red-100 border-l-4 border-red-500'
      }`}
    >
      <div className="flex items-center">
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-purple-300 mr-2" /> 
        ) : (
          <AlertTriangle className="h-5 w-5 text-red-300 mr-2" />
        )}
        <span>{message}</span>
      </div>
      <button 
        onClick={onClose}
        className="ml-4 text-sm hover:text-white"
      >
        ✕
      </button>
    </div>,
    getNotificationContainer()
  );
};

const WalletConnectButton = ({ size = "default", className = "" }) => {
  const {
    isConnected,
    walletInfo,
    isLoading,
    error,
    successMessage,
    connectWallet,
    disconnectWallet,
    setError,
    setSuccessMessage
  } = useWalletConnect();

  const [copied, setCopied] = React.useState(false);
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  const copyToClipboard = () => {
    if (!walletInfo?.principal) return;
    
    navigator.clipboard.writeText(walletInfo.principal)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await disconnectWallet();
    } finally {
      setIsDisconnecting(false);
    }
  };

  const buttonSize = {
    sm: "text-xs px-2.5 py-1.5",
    default: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5"
  };

  return (
    <>
      {successMessage && (
        <Notification 
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      
      {error && (
        <Notification 
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className={`bg-purple-600 text-white rounded-lg font-medium shadow-md hover:bg-purple-700 hover:shadow-lg transition-all duration-300 disabled:opacity-70 flex items-center ${buttonSize[size]} ${className}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </> 
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Connect Wallet
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <div 
            className="bg-slate-800 border border-slate-700 text-white px-3 py-1.5 rounded-lg shadow-inner flex items-center cursor-pointer group hover:bg-slate-700"
            onClick={copyToClipboard}
          >
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm font-medium">
              {walletInfo?.principal && `${walletInfo.principal.substring(0, 5)}...${walletInfo.principal.substring(walletInfo.principal.length - 4)}`}
            </span>
            <div className="ml-2 text-slate-400 group-hover:text-purple-300">
              {copied ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </div>
          </div>
          
          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className={`bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center ${buttonSize[size]} transition-colors`}
            title="Disconnect"
          >
            {isDisconnecting ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default WalletConnectButton;