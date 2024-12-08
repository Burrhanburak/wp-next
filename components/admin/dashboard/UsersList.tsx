import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';

export async function UsersList() {
  const users = await prisma.user.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      package: true,
    },
  });

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user.name?.[0] || user.email[0]}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
              <p className="text-xs text-gray-500">
                Joined {formatDistanceToNow(user.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user.package?.name || 'Free Plan'}
            </p>
            <p className="text-xs text-gray-500">
              {user.isVerified ? 'Verified' : 'Unverified'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
