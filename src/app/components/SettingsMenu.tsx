'use client';

import { Settings, Moon, Sun, Monitor, Bell, User, LogOut, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would handle actual logout logic here
    toast.success('Logged out successfully');
    onClose();
    // Redirect to login page after logout
    router.push('/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" onClick={onClose}></div>
      <div className="flex items-end justify-end min-h-screen">
        <div className="relative bg-white dark:bg-gray-800 h-screen w-full max-w-sm shadow-xl overflow-y-auto animate-slide-right border-l border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Theme</h3>
            <div className="space-y-2">
                  <button
                className={`flex items-center w-full p-3 rounded-lg ${
                  theme === 'light' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setTheme('light')}
                  >
                <Sun className="w-5 h-5 mr-3" />
                <span>Light Mode</span>
                  </button>
              
                  <button
                className={`flex items-center w-full p-3 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setTheme('dark')}
                  >
                <Moon className="w-5 h-5 mr-3" />
                <span>Dark Mode</span>
                  </button>
              
                  <button
                className={`flex items-center w-full p-3 rounded-lg ${
                  theme === 'system' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setTheme('system')}
                  >
                <Monitor className="w-5 h-5 mr-3" />
                <span>System Preference</span>
                  </button>
            </div>
            </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Account</h3>
            <div className="space-y-2">
                  <button
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onClose}
                  >
                <User className="w-5 h-5 mr-3" />
                <span>Profile Settings</span>
                  </button>
              
                  <button
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onClose}
                  >
                <Bell className="w-5 h-5 mr-3" />
                <span>Notification Preferences</span>
                  </button>
            </div>
            </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button
              className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
                  </button>
            </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Sherlock v1.0.0</p>
            <p className="mt-1">© {new Date().getFullYear()} Sherlock Systems</p>
          </div>
        </div>
      </div>
    </div>
  );
}