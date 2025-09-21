import React from 'react';
import { AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface ScrapingStatusProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  onRetry?: () => void;
}

const ScrapingStatus: React.FC<ScrapingStatusProps> = ({ status, message, onRetry }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <RefreshCw className="animate-spin" size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusMessage = () => {
    if (message) return message;
    
    switch (status) {
      case 'loading':
        return 'Scraping trader data... Please wait.';
      case 'success':
        return 'Data successfully extracted and analyzed.';
      case 'error':
        return 'Failed to extract data. Please try again.';
      default:
        return 'Ready to scrape trader data.';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 flex items-center space-x-3 ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="flex-1 font-medium">{getStatusMessage()}</span>
      {status === 'error' && onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ScrapingStatus;