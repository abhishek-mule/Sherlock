import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className = 'w-6 h-6' }: LoadingSpinnerProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Main spinner */}
      <div className="absolute inset-0 animate-spin">
        <div className="h-full w-full rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      {/* Center circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-1/2 w-1/2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600"></div>
      </div>
    </div>
  );
}