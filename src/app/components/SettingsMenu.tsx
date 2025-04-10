'use client';

import { Menu, Transition } from '@headlessui/react';
import { Settings, Moon, Sun, Monitor, Bell, User, LogOut } from 'lucide-react';
import { Fragment, useState } from 'react';
import { useTheme } from 'next-themes';
import { Tooltip } from './Tooltip';
import toast from 'react-hot-toast';
import { NotificationsPanel } from './NotificationsPanel';
import { ProfileSettings } from './ProfileSettings';
import { useRouter } from 'next/navigation';

export function SettingsMenu() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    // In a real app, you would handle actual logout logic here
    toast.success('Logged out successfully');
    // Redirect to login page after logout
    router.push('/');
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <Tooltip content="Settings">
          <Menu.Button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Menu.Button>
        </Tooltip>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                Theme
              </div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } group flex w-full items-center rounded-md px-3 py-2 text-sm gap-3 ${
                      theme === 'light' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
                    }`}
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } group flex w-full items-center rounded-md px-3 py-2 text-sm gap-3 ${
                      theme === 'dark' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
                    }`}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } group flex w-full items-center rounded-md px-3 py-2 text-sm gap-3 ${
                      theme === 'system' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
                    }`}
                    onClick={() => setTheme('system')}
                  >
                    <Monitor className="w-4 h-4" />
                    System
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="p-2">
              <Menu.Item>
                {({ active, close }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } group flex w-full items-center rounded-md px-3 py-2 text-sm gap-3`}
                    onClick={() => {
                      close();
                      setIsNotificationsOpen(true);
                    }}
                  >
                    <Bell className="w-4 h-4" />
                    Notifications
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active, close }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } group flex w-full items-center rounded-md px-3 py-2 text-sm gap-3`}
                    onClick={() => {
                      close();
                      setIsProfileOpen(true);
                    }}
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="p-2">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } group flex w-full items-center rounded-md px-3 py-2 text-sm gap-3 text-red-600 dark:text-red-400`}
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />

      {/* Profile Settings */}
      <ProfileSettings 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
}