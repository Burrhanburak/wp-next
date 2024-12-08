import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MetricsData {
  deliveryTimes: {
    labels: string[];
    values: number[];
  };
  failureReasons: {
    labels: string[];
    values: number[];
  };
  successRate: {
    labels: string[];
    values: number[];
  };
}

export default function PerformanceMetrics() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/metrics?timeRange=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Performance Metrics
        </h2>
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Times Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Message Delivery Times
          </h3>
          <Line
            data={{
              labels: data.deliveryTimes.labels,
              datasets: [
                {
                  label: 'Average Delivery Time (seconds)',
                  data: data.deliveryTimes.values,
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </motion.div>

        {/* Failure Reasons Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Message Failure Reasons
          </h3>
          <Bar
            data={{
              labels: data.failureReasons.labels,
              datasets: [
                {
                  label: 'Number of Failures',
                  data: data.failureReasons.values,
                  backgroundColor: 'rgb(239, 68, 68)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </motion.div>

        {/* Success Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 md:col-span-2"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Message Success Rate
          </h3>
          <Line
            data={{
              labels: data.successRate.labels,
              datasets: [
                {
                  label: 'Success Rate (%)',
                  data: data.successRate.values,
                  borderColor: 'rgb(34, 197, 94)',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  fill: true,
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
