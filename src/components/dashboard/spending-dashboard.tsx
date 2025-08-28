
'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { FinanceTips } from './finance-tips';
import { useRouter } from 'next/navigation';
import { Progress } from '../ui/progress';

const SpendingCard = ({ item, isSelected }: { item: any, isSelected: boolean }) => {
  const spent = item.spent;
  const total = item.total;
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
        className={`w-40 h-64 rounded-3xl p-4 flex flex-col justify-between shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-neutral-800 text-white'}`}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
        >
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <div className="flex-1 flex items-center justify-center">
        <div className="w-full space-y-2 text-center">
          <div className={`text-3xl font-bold ${isSelected ? 'text-primary-foreground' : 'text-white'}`}>
              ${item.spent.toLocaleString()}
          </div>
          <Progress 
            value={progress} 
            className="h-2" 
            indicatorClassName={
              isOverBudget ? 'bg-destructive' : (isSelected ? 'bg-black' : 'bg-primary')
            }
          />
          <p className={`text-center font-bold text-sm ${isSelected ? 'text-primary-foreground/80' : 'text-white/80'}`}>of ${item.total.toLocaleString()}</p>
        </div>
        </div>
    </div>
  );
};

export function SpendingDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCard, setSelectedCard] = useState('grocery');
  const [transactions] = useLocalStorage('transactions', initialTransactions);
  const [categories] = useLocalStorage('categories', initialCategories);

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

  const categoryTabs = categories.map(cat => (
    <TabsTrigger key={cat.id} value={cat.id} className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-full text-base px-4 py-2">{cat.name}</TabsTrigger>
  ));

  const spendingPatterns = JSON.stringify(transactions, null, 2);


  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent p-0 justify-start">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-full text-base px-4 py-2">All</TabsTrigger>
                {categoryTabs}
            </div>
            <ScrollBar orientation="horizontal" className="hidden"/>
          </ScrollArea>
        </TabsList>
      </Tabs>

      <ScrollArea className="w-full">
        <div className="flex space-x-4 pb-4">
          {filteredData.map(item => (
            <div key={item.id} onClick={() => setSelectedCard(item.id)}>
              <SpendingCard item={item} isSelected={selectedCard === item.id} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden"/>
      </ScrollArea>

      <FinanceTips spendingPatterns={spendingPatterns} />
    </div>
  );
}
