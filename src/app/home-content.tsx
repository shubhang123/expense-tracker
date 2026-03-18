'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { SpendingDashboard } from '@/components/dashboard/spending-dashboard';
import { categories as initialCategories } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

import { transactions as initialTransactions } from '@/lib/data';
import { Transaction } from '@/lib/types';

export default function HomeContent() {
  const [activeTab, setActiveTab] = useState('all');
  const [categories] = useLocalStorage('categories', initialCategories);
  const [transactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');

  const [spendingData, setSpendingData] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  const categoryTabs = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
  }));

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  }
  
  const hasSearchTerm = searchTerm.trim().length > 0;

  useEffect(() => {
    const data = categories.map(category => {
      const categoryTransactions = transactions.filter(t => t.category.toLowerCase() === category.id.toLowerCase());
      const spent = categoryTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
      return {
        ...category,
        spent,
        total: category.budget,
      };
    });

    const total = data.reduce((acc, cat) => acc + cat.spent, 0);
    const remaining = data.reduce((acc, cat) => acc + Math.max(0, (cat.budget || 0) - cat.spent), 0);

    setSpendingData(data);
    setTotalSpent(total);
    setRemainingBudget(remaining);
  }, [categories, transactions]);

  return (
    <div className="space-y-20 pb-32">
      {/* Editorial Header */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-on-surface-variant mb-4">Current Allocation</p>
          <h2 className="font-headline text-7xl md:text-9xl text-primary leading-none tracking-tighter">
            ₹{totalSpent.toLocaleString()}<span className="text-3xl font-light text-on-tertiary-container">.00</span>
          </h2>
          <p className="body-md text-on-surface-variant mt-6 max-w-md leading-relaxed opacity-70">
            Your financial landscape is currently in transition. {categories.length} categories require curatorial attention to maintain equilibrium.
          </p>
        </div>
        <div className="md:col-span-4 flex flex-col items-end gap-4">
          <div className="text-right">
            <p className="label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">Remaining</p>
            <p className="text-3xl font-headline text-secondary-dim">₹{remainingBudget.toLocaleString()}</p>
          </div>
          <Button asChild className="bg-primary text-on-primary-container px-6 py-6 rounded-xs text-[11px] font-bold tracking-[0.15em] uppercase hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 h-auto">
            <Link href="/add">
              <span className="material-symbols-outlined text-sm">add</span>
              Add Expense
            </Link>
          </Button>
        </div>
      </section>

      {/* Category Display */}
      <SpendingDashboard activeTab={activeTab} onTabChange={onTabChange} categoryTabs={categoryTabs} />

      {/* New Archetype Section (Simulated) */}
      <section className="mt-32 border-t border-outline-variant/10 pt-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h3 className="font-headline text-4xl text-primary mb-6">New Archetype</h3>
          <p className="body-md text-on-surface-variant opacity-60 leading-relaxed">
            Define a new vessel for your value. Select an identifier and a visual echo that resonates with its purpose.
          </p>
        </div>
        <div className="md:col-span-8 bg-surface-container-low p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
              <div>
                <label className="label-sm text-[10px] uppercase tracking-[0.2em] text-on-tertiary-container block mb-4">LABEL</label>
                <input className="w-full bg-transparent border-b border-outline-variant/30 py-2 text-primary focus:outline-none focus:border-primary transition-colors uppercase tracking-widest text-sm font-light" placeholder="ENTER CATEGORY NAME" type="text"/>
              </div>
              <div>
                <label className="label-sm text-[10px] uppercase tracking-[0.2em] text-on-tertiary-container block mb-4">MONTHLY LIMIT</label>
                <div className="flex items-baseline">
                  <span className="text-on-surface-variant font-headline text-2xl mr-2">₹</span>
                  <input className="w-full bg-transparent border-b border-outline-variant/30 py-2 text-primary focus:outline-none focus:border-primary transition-colors text-3xl font-headline" placeholder="0.00" type="number"/>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <label className="label-sm text-[10px] uppercase tracking-[0.2em] text-on-tertiary-container block mb-6">ICON SELECTION</label>
                <div className="grid grid-cols-4 gap-4">
                  {['potted_plant', 'diamond', 'flight', 'architecture'].map((icon) => (
                    <button key={icon} className="aspect-square flex items-center justify-center bg-surface-bright/30 border border-outline-variant/20 hover:border-primary transition-all">
                      <span className="material-symbols-outlined text-primary">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-sm text-[10px] uppercase tracking-[0.2em] text-on-tertiary-container block mb-6">BLOOM HUE</label>
                <div className="flex gap-4">
                  <button className="w-8 h-8 rounded-full bg-secondary border-2 border-primary/20 ring-4 ring-secondary/5"></button>
                  <button className="w-8 h-8 rounded-full bg-tertiary opacity-40 hover:opacity-100 transition-opacity"></button>
                  <button className="w-8 h-8 rounded-full bg-[#EBD9B4] opacity-40 hover:opacity-100 transition-opacity"></button>
                  <button className="w-8 h-8 rounded-full bg-error-dim opacity-40 hover:opacity-100 transition-opacity"></button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 flex justify-end">
            <button className="label-sm text-[11px] font-bold tracking-[0.2em] text-primary border border-outline-variant/30 px-10 py-4 hover:bg-primary hover:text-on-primary-container transition-all">
              ARCHIVE CHANGES
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
