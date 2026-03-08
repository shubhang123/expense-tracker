'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import type { Transaction, Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Activity, Plus, Target } from 'lucide-react';

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

  const handleDoubleClick = () => {
    router.push(`/add?category=${item.id}`);
  };

  const handleClick = () => {
    router.push(`/purchase/${item.id}`);
  }

  return (
    <div
      className={cn(
        "w-56 h-64 p-0 flex flex-col justify-between shrink-0 cursor-pointer relative overflow-hidden transition-all duration-500 group card-architectural",
        isSelected
          ? "border-primary/40 bg-surface-high/60 ring-1 ring-primary/20 scale-[1.02]"
          : "hover:border-white/10"
      )}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    >
      {/* Structural Accents */}
      <div className="absolute top-0 left-0 w-12 h-[1px] bg-white/10" />
      <div className="absolute top-0 left-0 w-[1px] h-12 bg-white/10" />
      <div className="absolute top-4 right-4 coord text-[7px]">MTX.{item.id.substring(0, 3).toUpperCase()}</div>

      {/* Header Layer */}
      <div className="p-6 pb-0 relative z-10 space-y-1">
        <div className="flex items-center gap-2">
          <div className={cn("w-1 h-1", isSelected ? "bauhaus-emerald" : "bg-white/20")} />
          <span className="t-label text-[8px] opacity-40 t-bracket">Allocation Node</span>
        </div>
        <h3 className="font-black text-white uppercase tracking-tight text-lg leading-tight truncate">{item.name}</h3>
      </div>

      {/* Internal Grid Divider */}
      <div className="mx-6 border-t border-white/5" />

      {/* Core Projection */}
      <div className="p-6 pt-0 relative z-10 space-y-6">
        <div className="space-y-1">
          <div className="flex justify-between items-end">
            <span className="t-label text-[8px] opacity-30">VOL.METRIC</span>
            {isSelected && <span className="coord text-primary">ACTIVE</span>}
          </div>
          <div className={cn("text-4xl font-black tracking-tighter leading-none", isOverBudget && !isSelected ? "text-red-500" : "text-white")}>
            ₹{item.spent.toLocaleString()}
          </div>
        </div>

        {/* Proximity Gauge (Artistic) */}
        <div className="space-y-3">
          <div className="relative h-6 flex items-center">
            <div className="absolute inset-0 bg-white/5 border border-white/5" />
            <div
              className={cn("h-full transition-all duration-1000 relative", isOverBudget ? "bauhaus-red" : "bauhaus-emerald")}
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute top-0 right-0 w-[1px] h-full bg-white opacity-40 shadow-[0_0_10px_white]" />
            </div>
            <div className="absolute inset-x-0 h-[1px] bg-white/10" />
          </div>
          <div className="flex justify-between items-center px-0.5">
            <span className="t-label text-[8px] opacity-30 uppercase tracking-[0.2em] font-mono">LIM: {total.toLocaleString()}</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/10" />
              <div className="w-1 h-1 bg-white/10" />
              <div className="w-1 h-1 bg-white/10" />
            </div>
          </div>
        </div>
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
    <div className="space-y-10">
      {/* ── Architectural Selection Control ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-[1px] bg-primary" />
          <span className="t-label text-[10px] opacity-60">System Filter Interface</span>
        </div>
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <TabsList className="bg-transparent h-14 inline-flex gap-4 px-1">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-white/10 bg-surface-raised text-white/40 rounded-none text-[10px] px-10 h-full font-black uppercase tracking-widest hover:bg-white/10 transition-all focus-visible:ring-0 relative"
              >
                <div className="absolute top-0 left-0 w-1 h-1 bg-white/20" />
                Master Matrix
              </TabsTrigger>
              {categoryTabs.map(cat => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-white/10 bg-surface-raised text-white/40 rounded-none text-[10px] px-10 h-full font-black uppercase tracking-widest hover:bg-white/10 transition-all focus-visible:ring-0 relative"
                >
                  <div className="absolute top-0 left-0 w-1 h-1 bg-white/20" />
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </Tabs>
      </div>

      {/* ── Visual Matrix Grid ── */}
      <ScrollArea className="w-full px-1">
        <div className="flex space-x-6 pb-8">
          {filteredData.map(item => (
            <div key={item.id} className="relative group/card">
              <SpendingCard item={item} isSelected={activeTab === item.id} />
              {/* External Architectural Anchor */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[1px] h-6 bg-white/5 group-hover/card:bg-primary/30 transition-colors" />
            </div>
          ))}
          {/* Add Unit Placeholder */}
          <div className="w-56 h-64 border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-6 group cursor-pointer hover:border-primary/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="h-6 w-6 text-white/20 group-hover:text-primary transition-colors" />
            </div>
            <span className="t-label text-[8px] opacity-20 group-hover:opacity-60 transition-opacity">Initialize New Unit</span>
          </div>
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
