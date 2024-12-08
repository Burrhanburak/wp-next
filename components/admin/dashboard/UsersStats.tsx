import { Card } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

export async function UsersStats() {
  const totalUsers = await prisma.user.count();
  const activeUsers = await prisma.user.count({
    where: {
      isVerified: true,
    },
  });
  const premiumUsers = await prisma.user.count({
    where: {
      packageId: {
        not: null,
      },
    },
  });

  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-gray-500">Users Overview</h3>
      <div className="mt-2 grid grid-cols-1 gap-4">
        <div>
          <p className="text-2xl font-semibold text-gray-900">{totalUsers}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xl font-semibold text-gray-900">{activeUsers}</p>
            <p className="text-sm text-gray-500">Active Users</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900">{premiumUsers}</p>
            <p className="text-sm text-gray-500">Premium Users</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
