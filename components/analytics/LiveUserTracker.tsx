import { useState, useEffect } from 'react';
import { UserCircleIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  lastActive: Date;
  status: 'online' | 'offline' | 'idle';
}

export default function LiveUserTracker() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await fetch('/api/analytics/active-users');
        if (!response.ok) throw new Error('Failed to fetch active users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching active users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'idle':
        return 'bg-yellow-400';
      case 'offline':
        return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Active Users
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-4 text-sm font-medium text-gray-500 mb-2">
          <div>User</div>
          <div>Status</div>
          <div>Last Active</div>
          <div>Actions</div>
        </div>

        <AnimatePresence>
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-4 items-center py-3 border-b border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(user.status)}`}></div>
                <span className="capitalize text-sm text-gray-700">{user.status}</span>
              </div>

              <div className="text-sm text-gray-500">
                {new Date(user.lastActive).toLocaleString()}
              </div>

              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  onClick={() => {/* Implement message action */}}
                >
                  Message
                </button>
                <button
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => {/* Implement view details action */}}
                >
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No active users at the moment
          </div>
        )}
      </div>
    </div>
  );
}
