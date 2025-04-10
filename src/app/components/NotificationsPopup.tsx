import React from 'react';
import { Bell, X, Check, Clock, Info, AlertCircle } from 'lucide-react';

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
      type: 'info',
    },
    {
      id: 2,
      title: 'New Student Records',
      message: 'All student records have been updated in the system.',
      time: '1 hour ago',
      isNew: true,
      type: 'success',
    },
    {
      id: 3,
      title: 'System Maintenance',
      message: 'The system will undergo maintenance tonight from 2:00 AM to 4:00 AM.',
      time: '3 hours ago',
      isNew: false,
      type: 'warning',
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="notifications-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen p-4 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-gray-200 dark:border-gray-700 animate-fade-in">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-md">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="notifications-title">
                    Notifications
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {notifications.filter(n => n.isNew).length} new notifications
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white dark:bg-gray-800 py-4 max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="space-y-1 px-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      notification.isNew 
                        ? 'border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10' 
                        : 'border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                            {notification.isNew && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                                New
                              </span>
                            )}
                          </h4>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
              type="button"
              className="inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors"
              onClick={() => {}}
            >
              Mark all as read
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-sm font-medium text-white hover:from-blue-600 hover:to-indigo-700 focus:outline-none transition-colors"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 