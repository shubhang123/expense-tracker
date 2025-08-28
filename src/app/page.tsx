
'use client';

import { useState } from 'react';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { SpendingDashboard } from '@/components/dashboard/spending-dashboard';
import { categories as initialCategories } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';


export default function Home() {
  const [activeTab, setActiveTab] = useState('all');
  const [categories] = useLocalStorage('categories', initialCategories);

  const categoryTabs = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
  }));

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-4xl font-bold">Your Spending</h1>
      </div>
      <SpendingDashboard activeTab={activeTab} onTabChange={onTabChange} categoryTabs={categoryTabs} />
      <RecentTransactions 
        hideHeader={false} 
        filterByCategory={activeTab === 'all' ? undefined : activeTab}
      />
    </div>
  );
}
