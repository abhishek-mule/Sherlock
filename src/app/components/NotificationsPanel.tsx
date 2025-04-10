'use client';

import { useState } from 'react';
import { X, Bell, Info, Check } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Student Registered',
      message: 'A new student has been registered in the system.',
      time: '2 hours ago',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'System Update',
      message: 'System will be updated on Saturday. Please save your work.',
      time: '1 day ago',
      read: false,
      type: 'warning'
    },
    {
      id: '3',
      title: 'Data Import Complete',
      message: 'Student data import has been completed successfully.',
      time: '3 days ago',
      read: true,
      type: 'success'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-start justify-end">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 h-screen shadow-lg overflow-auto animate-slide-in-right">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
          <div className="flex space-x-4 items-center">
            <button 
              onClick={markAllAsRead}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Mark all as read
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <Bell className="w-10 h-10 mx-auto mb-2 text-gray-400 dark:text-gray-600" />
            <p>No notifications to display</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                  notification.read ? 'opacity-75' : 'bg-blue-50 dark:bg-blue-900/10'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {notification.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 