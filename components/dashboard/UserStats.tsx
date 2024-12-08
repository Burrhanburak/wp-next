import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export async function UserStats() {
  const session = await getServerSession();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { package: true },
  });

  if (!user) return null;

  const messageStats = await prisma.message.groupBy({
    by: ['status'],
    where: {
      userId: user.id,
    },
    _count: true,
  });

  const totalMessages = messageStats.reduce((sum, stat) => sum + stat._count, 0);
  const deliveredMessages = messageStats.find(stat => stat.status === 'DELIVERED')?._count || 0;
  const successRate = totalMessages > 0 ? Math.round((deliveredMessages / totalMessages) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMessages}</div>
          <p className="text-xs text-muted-foreground">
            Messages sent this month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
          <p className="text-xs text-muted-foreground">
            Messages delivered successfully
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.package?.name || 'Free'}</div>
          <p className="text-xs text-muted-foreground">
            {user.credits} credits remaining
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
