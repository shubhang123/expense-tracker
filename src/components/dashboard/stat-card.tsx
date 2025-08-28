import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendValue, className }: StatCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={cn('glassmorphic-card p-4 transition-all duration-300 hover:bg-primary/20', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend && trendValue && (
          <p className="text-xs text-muted-foreground flex items-center">
            <TrendIcon className={cn('mr-1 h-4 w-4', trend === 'up' ? 'text-cyan-400' : 'text-pink-400')} />
            {trendValue} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
