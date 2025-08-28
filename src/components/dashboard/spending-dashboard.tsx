
'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { categories, transactions as initialTransactions } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';

const SpendingCard = ({ item, isSelected }: { item: any, isSelected: boolean }) => {
  const progress = item.total > 0 ? (item.spent / item.total) * 100 : 0;

  return (
    <Link href={`/purchase/${item.id}`}>
        <div className={`w-40 h-64 rounded-3xl p-4 flex flex-col justify-between shrink-0 ${isSelected ? 'bg-primary text-black' : 'bg-neutral-800 text-white'}`}>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <div className="flex-1 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center relative overflow-hidden">
                    <div
                        className="absolute bottom-0 w-full bg-white"
                        style={{ height: `${progress}%` }}
                    ></div>
                    <div className={`relative text-center font-bold ${isSelected ? 'text-black' : 'text-white'}`}>
                        <div className="text-2xl">${item.spent.toLocaleString()}</div>
                        <div className="text-xs">Spent</div>
                    </div>
                </div>
            </div>
            <p className="text-center font-bold text-sm mt-2">of ${item.total.toLocaleString()}</p>
        </div>
    </Link>
  );
};

export function SpendingDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCard, setSelectedCard] = useState('grocery');
  const [transactions] = useLocalStorage('transactions', initialTransactions);

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
    </div>
  );
}
