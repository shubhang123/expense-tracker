import { StatCard } from '@/components/dashboard/stat-card';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { BudgetOverview } from '@/components/dashboard/budget-overview';
import { AiTipsCard } from '@/components/dashboard/ai-tips-card';
import { Wallet, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex-1 p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value="$24,284.50"
          icon={Wallet}
          trend="up"
          trendValue="+2.5%"
        />
        <StatCard
          title="Monthly Income"
          value="$5,600.00"
          icon={TrendingUp}
          trend="up"
          trendValue="+5.2%"
        />
        <StatCard
          title="Monthly Expenses"
          value="$3,150.75"
          icon={TrendingDown}
          trend="down"
          trendValue="-1.8%"
        />
        <StatCard
          title="Credit Card Debt"
          value="$1,230.00"
          icon={CreditCard}
          trend="up"
          trendValue="+10%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SpendingChart />
        <RecentTransactions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BudgetOverview />
        <AiTipsCard />
      </div>
    </main>
  );
}
