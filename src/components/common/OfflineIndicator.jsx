import React from 'react';
import { WifiOff } from 'lucide-react';

/**
 * Offline Indicator Component
 * Shows when the app is running in offline mode
 */
const OfflineIndicator = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white py-2 px-4 z-50 animate-slide-down">
      <div className="max-w-6xl mx-auto flex items-center justify-center space-x-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">
          You're offline - but the app still works!
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;