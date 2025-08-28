'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';

const spendingData = [
  { id: 'medicine', name: 'Medicine', spent: 5100, total: 10200, color: 'bg-white' },
  { id: 'grocery', name: 'Grocery', spent: 1755, total: 5850, color: 'bg-primary' },
  { id: 'loan-emi', name: 'Loan EMI', spent: 22900, total: 22900, color: 'bg-white' },
  { id: 'health', name: 'Health', spent: 800, total: 2000, color: 'bg-white' },
  { id: 'entertainment', name: 'Entertainment', spent: 1200, total: 1500, color: 'bg-white' },
];

const SpendingCard = ({ item, isSelected }: { item: typeof spendingData[0], isSelected: boolean }) => {
  const progress = (item.spent / item.total) * 100;

  return (
    <Link href={`/purchase/${item.id}`}>
        <div className={`w-40 h-64 rounded-3xl p-3 flex flex-col justify-between shrink-0 ${isSelected ? 'bg-primary text-black' : 'bg-neutral-800 text-white'}`}>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <div className="flex-1 flex items-end justify-center">
                <div className="w-16 h-40 bg-white/20 rounded-2xl overflow-hidden relative">
                    <div
                        className="absolute bottom-0 w-full bg-white rounded-2xl"
                        style={{ height: `${progress}%` }}
                    >
                      <div className={`absolute bottom-2 left-0 right-0 text-center font-bold text-sm transform -rotate-90 origin-bottom-left text-black`}>
                          ${item.spent.toLocaleString()}
                      </div>
                    </div>
                </div>
            </div>
            <p className="text-center font-bold text-xl mt-2">${item.total.toLocaleString()}</p>
        </div>
    </Link>
  );
};

export function SpendingDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCard, setSelectedCard] = useState('grocery');

  const filteredData = activeTab === 'all'
    ? spendingData
    : spendingData.filter(item => item.name.toLowerCase() === activeTab);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent p-0 justify-start">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-full text-base px-4 py-2">All</TabsTrigger>
                <TabsTrigger value="health" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-full text-base px-4 py-2">Health</TabsTrigger>
                <TabsTrigger value="grocery" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-full text-base px-4 py-2">Grocery</TabsTrigger>
                <TabsTrigger value="entertainment" className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-full text-base px-4 py-2">Entertainment</TabsTrigger>
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
