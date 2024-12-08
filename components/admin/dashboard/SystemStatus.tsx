import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { prisma } from '@/lib/prisma';

async function getSystemMetrics() {
  const [
    totalUsers,
    activeMessages,
    failedMessages,
    cpuUsage,
    memoryUsage,
    diskUsage,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.message.count({
      where: {
        status: 'PENDING',
      },
    }),
    prisma.message.count({
      where: {
        status: 'FAILED',
      },
    }),
    // Simulated metrics - in production, these would come from your monitoring service
    Promise.resolve(Math.floor(Math.random() * 100)),
    Promise.resolve(Math.floor(Math.random() * 100)),
    Promise.resolve(Math.floor(Math.random() * 100)),
  ]);

  return {
    totalUsers,
    activeMessages,
    failedMessages,
    cpuUsage,
    memoryUsage,
    diskUsage,
  };
}

export async function SystemStatus() {
  const metrics = await getSystemMetrics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="CPU Usage"
          value={`${metrics.cpuUsage}%`}
          progress={metrics.cpuUsage}
          status={metrics.cpuUsage > 80 ? 'critical' : metrics.cpuUsage > 60 ? 'warning' : 'normal'}
        />
        <MetricCard
          title="Memory Usage"
          value={`${metrics.memoryUsage}%`}
          progress={metrics.memoryUsage}
          status={metrics.memoryUsage > 80 ? 'critical' : metrics.memoryUsage > 60 ? 'warning' : 'normal'}
        />
        <MetricCard
          title="Disk Usage"
          value={`${metrics.diskUsage}%`}
          progress={metrics.diskUsage}
          status={metrics.diskUsage > 80 ? 'critical' : metrics.diskUsage > 60 ? 'warning' : 'normal'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="mt-2 text-3xl font-semibold">{metrics.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Messages</h3>
          <p className="mt-2 text-3xl font-semibold">{metrics.activeMessages}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Failed Messages</h3>
          <p className="mt-2 text-3xl font-semibold">{metrics.failedMessages}</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  progress, 
  status 
}: { 
  title: string; 
  value: string; 
  progress: number; 
  status: 'normal' | 'warning' | 'critical' 
}) {
  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  const getProgressColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return 'bg-red-600';
      case 'warning':
        return 'bg-yellow-600';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className={`text-sm font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <p className="text-2xl font-semibold mb-2">{value}</p>
      <Progress
        value={progress}
        className="h-2"
        indicatorClassName={getProgressColor(status)}
      />
    </div>
  );
}
