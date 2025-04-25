import React from 'react';
import useWalletConnect from './WalletConnect';
import Notification from '../ui/Notification';

const WalletConnectButton = () => {
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

  return (
    <>
      {/* Success Message */}
      {successMessage && (
        <Notification 
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      
      {/* Error message */}
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
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-indigo-700 transition-all duration-300 disabled:opacity-70 flex items-center"
        >
          {isLoading ? 
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </> 
            : 'Connect Wallet'
          }
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
            <div className="bg-green-100 p-1 rounded-full">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm font-medium">
              {walletInfo?.principal && `${walletInfo.principal.substring(0, 5)}...${walletInfo.principal.substring(walletInfo.principal.length - 4)}`}
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            disabled={isLoading}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            {isLoading ? 
              <>
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Disconnecting...
              </> 
              : 'Disconnect'
            }
          </button>
        </div>
      )}
    </>
  );
};

export default WalletConnectButton;