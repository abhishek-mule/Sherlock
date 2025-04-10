'use client';

import { X, AlertTriangle, Lock, ShieldCheck, ScrollText } from 'lucide-react';
import { useState, useEffect } from 'react';

interface OsintDisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function OsintDisclaimer({ isOpen, onClose, onAccept }: OsintDisclaimerProps) {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  
  // Reset state when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setIsAcknowledged(false);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-fade-in-up">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-orange-100 dark:bg-orange-900/40">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-200">
              OSINT Information - Educational Use Only
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="prose dark:prose-invert max-w-none">
            <div className="flex items-center space-x-2 mb-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <ScrollText className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <h3 className="text-xl font-medium m-0 text-blue-900 dark:text-blue-200">What is OSINT?</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              <strong>Open Source Intelligence (OSINT)</strong> refers to the collection and analysis of information from publicly available sources. 
              In today's digital world, significant amounts of personal information may be accessible through social media profiles, 
              public records, academic publications, and other online resources.
            </p>
            
            <div className="flex items-center space-x-2 mt-6 mb-4 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <Lock className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
              <h3 className="text-xl font-medium m-0 text-red-900 dark:text-red-200">Why This Matters</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              The OSINT Profile feature demonstrates how much information might be publicly available about a student. 
              This feature is provided <strong>for educational purposes only</strong> to:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
                <span className="bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 font-medium">1</span>
                <span className="text-gray-800 dark:text-gray-200">Raise awareness about digital privacy and online footprints</span>
              </li>
              <li className="flex items-start hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
                <span className="bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 font-medium">2</span>
                <span className="text-gray-800 dark:text-gray-200">Help students understand potential privacy risks</span>
              </li>
              <li className="flex items-start hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
                <span className="bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 font-medium">3</span>
                <span className="text-gray-800 dark:text-gray-200">Encourage better privacy practices and digital hygiene</span>
              </li>
            </ul>
            
            <div className="flex items-center space-x-2 mt-6 mb-4 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <h3 className="text-xl font-medium m-0 text-green-900 dark:text-green-200">Important Disclaimer</h3>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-lg p-4 mb-4">
              <p className="text-red-900 dark:text-red-200 text-sm m-0 leading-relaxed font-medium">
                The OSINT information shown is <strong>simulated and does not involve actual data collection</strong>. 
                No real searches are performed, and no actual student information is gathered from external sources.
                All information displayed is derived solely from the existing student records already in the system.
              </p>
            </div>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              This feature is designed as an educational tool to illustrate privacy concepts and should not be used 
              for any purpose other than education and privacy awareness.
            </p>
          </div>
          
          <div className="mt-6 flex items-start space-x-3 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <input 
              type="checkbox"
              id="acknowledge"
              checked={isAcknowledged}
              onChange={(e) => setIsAcknowledged(e.target.checked)}
              className="mt-1 w-4 h-4 accent-blue-600"
            />
            <label htmlFor="acknowledge" className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
              I understand that this feature is for educational purposes only, and I will use this information 
              responsibly and in accordance with applicable privacy laws and institutional policies.
            </label>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 bg-gray-100 dark:bg-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            disabled={!isAcknowledged}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
              isAcknowledged ? 'hover:bg-blue-700 active:bg-blue-800' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 