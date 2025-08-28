
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { SpendingDashboard } from '@/components/dashboard/spending-dashboard';
import { categories as initialCategories } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';


export default function Home() {
  const [activeTab, setActiveTab] = useState('all');
  const [categories] = useLocalStorage('categories', initialCategories);
  const [searchTerm, setSearchTerm] = useState('');

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

      <div className="relative">
        <Input 
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-base"
        />
        {searchTerm && (
          <Button asChild variant="link" className="absolute right-0 top-0 h-full">
            <Link href={`/search?q=${searchTerm}`}>
              View All <ArrowRight className="ml-2" />
            </Link>
          </Button>
        )}
      </div>

      <SpendingDashboard activeTab={activeTab} onTabChange={onTabChange} categoryTabs={categoryTabs} />
      <RecentTransactions 
        hideHeader={false} 
        filterByCategory={activeTab === 'all' ? undefined : activeTab}
        searchTerm={searchTerm}
      />
    </div>
  );
}
