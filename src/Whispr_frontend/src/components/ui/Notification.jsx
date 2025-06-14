
import React from 'react';

const Notification = ({ type, message, onClose }) => {
  const colorClasses = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-700',
      icon: 'text-green-500',
      hover: 'hover:bg-green-100'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
      icon: 'text-red-500',
      hover: 'hover:bg-red-100'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-700',
      icon: 'text-yellow-500',
      hover: 'hover:bg-yellow-100'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-700',
      icon: 'text-blue-500',
      hover: 'hover:bg-blue-100'
    }
  };

  const colors = colorClasses[type] || colorClasses.info;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className={`${colors.bg} border-l-4 ${colors.border} p-4 rounded-md`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {type === 'success' ? (
              <svg className={`h-5 w-5 ${colors.icon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : type === 'error' ? (
              <svg className={`h-5 w-5 ${colors.icon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className={`h-5 w-5 ${colors.icon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <p className={`text-sm ${colors.text}`}>{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className={`inline-flex ${colors.bg} rounded-md p-1.5 ${colors.icon} ${colors.hover} focus:outline-none`}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;