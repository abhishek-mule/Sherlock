import React from 'react';
import { Bell, X } from 'lucide-react';

interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPopup({ isOpen, onClose }: NotificationsPopupProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Search Feature Updated',
      message: 'The student search feature now uses database search for better results.',
      time: '2 minutes ago',
      isNew: true,
    },
    {
      id: 2,
      title: 'New Student Records',
      message: 'All student records have been updated in the system.',
      time: '1 hour ago',
      isNew: true,
    },
    {
      id: 3,
      title: 'System Maintenance',
      message: 'The system will undergo maintenance tonight from 2:00 AM to 4:00 AM.',
      time: '3 hours ago',
      isNew: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="notifications-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 sm:h-10 sm:w-10">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-lg leading-6 font-medium text-gray-900 dark:text-white" id="notifications-title">
                  Notifications
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white dark:bg-gray-800 px-4 pb-5 sm:px-6 max-h-80 overflow-y-auto">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg ${notification.isNew ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                        {notification.title}
                        {notification.isNew && (
                          <span className="ml-2 bg-blue-500 text-white text-xs rounded-full py-0.5 px-2">
                            New
                          </span>
                        )}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 