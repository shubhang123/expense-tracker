
'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { FinanceTips } from './finance-tips';
import { useRouter } from 'next/navigation';
import { Progress } from '../ui/progress';
import type { Transaction, Category } from '@/lib/types';

interface SpendingCardProps {
  item: Category & { spent: number; total?: number };
  isSelected: boolean;
}

const SpendingCard = ({ item, isSelected }: SpendingCardProps) => {
  const spent = item.spent;
  const total = item.total || 0;
  const progress = total > 0 ? (spent / total) * 100 : 0;
  const isOverBudget = spent > total && total > 0;
  const router = useRouter();

  const handleClick = () => {
    router.push(`/purchase/${item.id}`);
  }

  // Map category IDs to icons and blob colors from BLOOM design
  const categoryMeta: Record<string, { icon: string, color: string }> = {
    living: { icon: 'home_pin', color: 'bg-secondary' },
    grocery: { icon: 'restaurant', color: 'bg-[#EBD9B4]' },
    health: { icon: 'spa', color: 'bg-error-container' },
    entertainment: { icon: 'apparel', color: 'bg-tertiary' },
    transport: { icon: 'flight', color: 'bg-secondary-dim' },
    utilities: { icon: 'architecture', color: 'bg-on-tertiary-container' },
  };

  const meta = categoryMeta[item.id.toLowerCase()] || { icon: 'category', color: 'bg-primary/20' };

  return (
    <div 
      className={`relative group bg-surface-container-low p-8 h-[320px] flex flex-col justify-between overflow-hidden transition-all duration-500 hover:bg-surface-container-high cursor-pointer ${isOverBudget ? 'border border-error-container/20 overspent-glow' : ''}`}
      onClick={handleClick}
    >
      <div className={`absolute -right-4 -top-4 w-48 h-48 ${meta.color} breathing-blob scale-110 opacity-20`}></div>
      
      <div className="relative z-10 flex justify-between items-start">
        <span className="material-symbols-outlined" style={{ color: meta.color.startsWith('bg-[') ? meta.color.slice(4, -1) : undefined }}>
          {meta.icon}
        </span>
        <span className={`label-sm text-[10px] tracking-widest ${isOverBudget ? 'text-error animate-pulse' : 'text-on-surface-variant'}`}>
          {isOverBudget ? `${Math.round(progress)}% EXCEEDED` : `${Math.round(progress)}% USED`}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className={`label-sm text-[11px] font-bold tracking-[0.15em] uppercase mb-1 ${isOverBudget ? 'text-error-dim' : 'text-on-surface-variant'}`}>
          {item.name}
        </h3>
        <p className="font-headline text-4xl text-primary font-bold">₹{item.spent.toLocaleString()}</p>
        <p className={`label-sm text-[10px] mt-2 ${isOverBudget ? 'text-on-error-container' : 'text-on-tertiary-container'}`}>
          LIMIT: ₹{total.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

type SpendingDashboardProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
    categoryTabs: { id: string; name: string }[];
}

export function SpendingDashboard({ activeTab, onTabChange, categoryTabs }: SpendingDashboardProps) {
  const [transactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
  const [categories] = useLocalStorage<Category[]>('categories', initialCategories);

  const spendingData = categories.map(category => {
    const categoryTransactions = transactions.filter(t => t.category.toLowerCase() === category.id.toLowerCase());
    const spent = categoryTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return {
      ...category,
      spent,
      total: category.budget,
    };
  });

  const filteredData = activeTab === 'all'
    ? spendingData
    : spendingData.filter(item => item.id.toLowerCase() === activeTab);

  return (
    <div className="space-y-12">
      {/* Category Tabs (Atrium style) */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <TabsList className="bg-transparent p-0 justify-start gap-8">
            <TabsTrigger 
              value="all" 
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none text-[11px] font-bold tracking-[0.2em] uppercase px-0 py-2 transition-all"
            >
              All
            </TabsTrigger>
            {categoryTabs.map((cat: { id: string; name: string }) => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id} 
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none text-[11px] font-bold tracking-[0.2em] uppercase px-0 py-2 transition-all"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" className="hidden"/>
        </ScrollArea>
      </Tabs>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.map(item => (
          <SpendingCard key={item.id} item={item} isSelected={false} />
        ))}
      </div>
    </div>
  );
}
