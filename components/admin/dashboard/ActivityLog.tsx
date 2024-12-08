import { Card } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';

export async function ActivityLog() {
  const activities = await prisma.adminLog.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
      <div className="mt-2 space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {activity.admin.name?.[0] || activity.admin.email[0]}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.admin.name}</span>{' '}
                {activity.action}
              </p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
