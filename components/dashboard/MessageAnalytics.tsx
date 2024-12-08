import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { startOfDay, subDays, format } from 'date-fns';

export async function MessageAnalytics() {
  const session = await getServerSession();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return null;

  // Get messages for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), i));
    return {
      date,
      formattedDate: format(date, 'MMM dd'),
    };
  }).reverse();

  // Get message counts by status for each day
  const messageStats = await Promise.all(
    last7Days.map(async ({ date }) => {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      const stats = await prisma.message.groupBy({
        by: ['status'],
        where: {
          userId: user.id,
          createdAt: {
            gte: date,
            lt: nextDay,
          },
        },
        _count: true,
      });

      return {
        date: format(date, 'MMM dd'),
        delivered: stats.find(s => s.status === 'DELIVERED')?._count || 0,
        failed: stats.find(s => s.status === 'FAILED')?._count || 0,
        pending: stats.find(s => s.status === 'PENDING')?._count || 0,
      };
    })
  );

  // Get delivery rates
  const totalMessages = await prisma.message.count({
    where: { userId: user.id },
  });

  const deliveredMessages = await prisma.message.count({
    where: {
      userId: user.id,
      status: 'DELIVERED',
    },
  });

  const failedMessages = await prisma.message.count({
    where: {
      userId: user.id,
      status: 'FAILED',
    },
  });

  const deliveryRate = totalMessages > 0
    ? Math.round((deliveredMessages / totalMessages) * 100)
    : 0;

  const failureRate = totalMessages > 0
    ? Math.round((failedMessages / totalMessages) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {deliveryRate}%
            </div>
            <p className="text-xs text-gray-500">
              {deliveredMessages} of {totalMessages} messages delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Failure Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {failureRate}%
            </div>
            <p className="text-xs text-gray-500">
              {failedMessages} of {totalMessages} messages failed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message Activity (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messageStats}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Bar
                  dataKey="delivered"
                  fill="#4ade80"
                  radius={[4, 4, 0, 0]}
                  name="Delivered"
                />
                <Bar
                  dataKey="failed"
                  fill="#f87171"
                  radius={[4, 4, 0, 0]}
                  name="Failed"
                />
                <Bar
                  dataKey="pending"
                  fill="#fbbf24"
                  radius={[4, 4, 0, 0]}
                  name="Pending"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
