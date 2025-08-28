'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { name: 'Groceries', total: 4890 },
  { name: 'Dining Out', total: 2130 },
  { name: 'Transport', total: 890 },
  { name: 'Shopping', total: 3450 },
  { name: 'Utilities', total: 1200 },
  { name: 'Entertainment', total: 670 },
  { name: 'Health', total: 530 },
];

export function SpendingChart() {
  return (
    <Card className="glassmorphic-card col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-white">Spending Overview</CardTitle>
        <CardDescription className="text-gray-400">Your spending by category this month.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
            <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} hide />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#B0B0B0' }}
              width={100}
            />
            <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                content={<ChartTooltipContent
                    formatter={(value) => `$${value.toLocaleString()}`}
                    indicator="dot"
                    labelClassName="text-white"
                    className="bg-black/70 border-white/20 text-white"
                 />}
            />
            <Bar dataKey="total" radius={[0, 4, 4, 0]} fill="url(#goldGradient)" barSize={20}>
            </Bar>
            <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--accent))" />
                    <stop offset="100%" stopColor="#FFB800" />
                </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
