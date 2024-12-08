import { Card } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

export async function RevenueStats() {
  // Get all users with their packages
  const users = await prisma.user.findMany({
    where: {
      packageId: {
        not: null,
      },
    },
    include: {
      package: true,
    },
  });

  // Calculate total revenue
  const totalRevenue = users.reduce((sum, user) => {
    return sum + (user.package?.price || 0);
  }, 0);

  // Get new subscriptions in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newSubscriptions = await prisma.user.count({
    where: {
      packageId: {
        not: null,
      },
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-gray-500">Revenue Overview</h3>
      <div className="mt-2 grid grid-cols-1 gap-4">
        <div>
          <p className="text-2xl font-semibold text-gray-900">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xl font-semibold text-gray-900">{users.length}</p>
            <p className="text-sm text-gray-500">Active Subscriptions</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900">{newSubscriptions}</p>
            <p className="text-sm text-gray-500">New (30d)</p>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Average Revenue per User: ${(totalRevenue / users.length || 0).toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
}
