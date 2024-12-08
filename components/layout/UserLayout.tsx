import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface UserLayoutProps {
  children: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Send Messages', href: '/messages/send' },
    { name: 'Message History', href: '/messages/history' },
    { name: 'Templates', href: '/messages/templates' },
    { name: 'Credits', href: '/credits' },
    { name: 'Settings', href: '/settings' },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">WhatsApp SaaS</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                      ${
                        isActive(item.href)
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {/* Implement logout */}}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                ${
                  isActive(item.href)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Page content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} WhatsApp SaaS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
