import { Card } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

export async function MessagesStats() {
  const totalMessages = await prisma.message.count();
  const successfulMessages = await prisma.message.count({
    where: {
      status: 'DELIVERED',
    },
  });
  const failedMessages = await prisma.message.count({
    where: {
      status: 'FAILED',
    },
  });

  const successRate = totalMessages > 0
    ? Math.round((successfulMessages / totalMessages) * 100)
    : 0;

  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-gray-500">Messages Overview</h3>
      <div className="mt-2 grid grid-cols-1 gap-4">
        <div>
          <p className="text-2xl font-semibold text-gray-900">{totalMessages}</p>
          <p className="text-sm text-gray-500">Total Messages</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xl font-semibold text-green-600">{successfulMessages}</p>
            <p className="text-sm text-gray-500">Delivered</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-red-600">{failedMessages}</p>
            <p className="text-sm text-gray-500">Failed</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${successRate}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {successRate}% Success Rate
          </p>
        </div>
      </div>
    </Card>
  );
}
