"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface MessageData {
  date: string;
  total: number;
}

export function Overview() {
  const [data, setData] = useState<MessageData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stats/messages');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch message stats:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
