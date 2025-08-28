'use client';

import { RadialBar, RadialBarChart, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { ScrollArea } from '@/components/ui/scroll-area';

const data = [
  { name: 'Shopping', total: 3450, fill: "var(--color-chart-1)" },
  { name: 'Groceries', total: 4890, fill: "var(--color-chart-2)" },
  { name: 'Dining Out', total: 2130, fill: "var(--color-chart-3)" },
  { name: 'Utilities', total: 1200, fill: "var(--color-chart-4)" },
  { name: 'Transport', total: 890, fill: "var(--color-chart-5)" },
  { name: 'Entertainment', total: 670, fill: "var(--color-chart-1)" },
  { name: 'Health', total: 530, fill: "var(--color-chart-2)" },
];

const chartConfig = {
  total: {
    label: "Total",
  },
  'Shopping': { label: 'Shopping', color: "hsl(var(--chart-1))" },
  'Groceries': { label: 'Groceries', color: "hsl(var(--chart-2))" },
  'Dining Out': { label: 'Dining Out', color: "hsl(var(--chart-3))" },
  'Utilities': { label: 'Utilities', color: "hsl(var(--chart-4))" },
  'Transport': { label: 'Transport', color: "hsl(var(--chart-5))" },
  'Entertainment': { label: 'Entertainment', color: "hsl(var(--chart-1))" },
  'Health': { label: 'Health', color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;


export function SpendingChart() {
  return (
    <Card className="glassmorphic-card col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-white">Spending Overview</CardTitle>
        <CardDescription className="text-muted-foreground">Your spending by category this month.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2 h-[350px] flex">
        <ChartContainer config={chartConfig} className="w-2/3 min-h-[350px]">
            <RadialBarChart 
                data={data} 
                innerRadius="30%" 
                outerRadius="100%" 
                startAngle={180} 
                endAngle={0} 
                barSize={12}
            >
                <RadialBar 
                    minAngle={15}
                    background
                    clockWise
                    dataKey="total" 
                />
            </RadialBarChart>
        </ChartContainer>
         <ScrollArea className="w-1/3 h-full pr-4">
            <div className="space-y-2 p-4">
                {data.sort((a,b) => b.total - a.total).map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-md bg-white/5">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                            <span className="text-sm text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-semibold text-white">${item.total.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
