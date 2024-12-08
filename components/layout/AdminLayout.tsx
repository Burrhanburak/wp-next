import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Messages', href: '/admin/messages' },
    { name: 'Templates', href: '/admin/templates' },
    { name: 'Packages', href: '/admin/packages' },
    { name: 'Logs', href: '/admin/logs' },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900">
        <div className="flex items-center justify-center h-16 bg-gray-800">
          <span className="text-white text-xl font-bold">Admin Panel</span>
        </div>
        <nav className="mt-5 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${
                  isActive(item.href)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top header */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-4 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigation.find((item) => isActive(item.href))?.name || 'Admin'}
            </h1>
            <button
              onClick={() => {/* Implement logout */}}
              className="text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="py-6 px-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
