import { SpendingDashboard } from '@/components/dashboard/spending-dashboard';

export default function Home() {
  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-4xl font-bold">Your Spending</h1>
      <SpendingDashboard />
    </div>
  );
}
