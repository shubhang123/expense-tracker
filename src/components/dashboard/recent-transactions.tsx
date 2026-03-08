'use client';

import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, History, MoreHorizontal, ChevronRight } from 'lucide-react';
import type { Transaction, Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function RecentTransactions({
  filterByCategory,
  hideHeader = false,
  searchTerm,
  transactions: propsTransactions,
  categories: propsCategories,
  showViewAll = false,
}: {
  filterByCategory?: string,
  hideHeader?: boolean,
  searchTerm?: string,
  transactions?: Transaction[],
  categories?: Category[],
  showViewAll?: boolean,
}) {
  const [localStorageTransactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
  const [localStorageCategories] = useLocalStorage<Category[]>('categories', initialCategories);
  const router = useRouter();

  const transactions = propsTransactions || localStorageTransactions;
  const categories = propsCategories || localStorageCategories;

  const handleTransactionClick = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id.toLowerCase() === id.toLowerCase());
    return category ? category.name : 'N/A';
  }

  const hasSearchTerm = searchTerm && searchTerm.trim().length > 0;

  const filteredTransactions = transactions.filter((t) => {
    const categoryMatch = !filterByCategory || t.category === filterByCategory;

    const trimmedSearch = searchTerm?.trim().toLowerCase();
    const searchMatch = !trimmedSearch ||
      t.merchant.toLowerCase().includes(trimmedSearch) ||
      (t.subcategory && t.subcategory.toLowerCase().includes(trimmedSearch)) ||
      (t.notes && t.notes.toLowerCase().includes(trimmedSearch));

    return categoryMatch && searchMatch;
  });

  const limitedTransactions = (hideHeader || hasSearchTerm) && !showViewAll ? filteredTransactions : filteredTransactions.slice(0, 5);

  return (
    <section className="card-architectural p-0 overflow-hidden group">
      {/* Corner Brackets */}
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/10" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/10" />

      {!hideHeader && (
        <div className="flex items-center justify-between p-10 border-b border-white/5 relative bg-white/2">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center relative">
              <div className="absolute -top-1 -left-1 w-2 h-2 bauhaus-blue" />
              <History className="h-5 w-5 text-white/40" />
            </div>
            <div>
              <span className="t-label text-[8px] mb-1 block opacity-40 t-bracket">Unit Activity Stream</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Intelligence Feed</h2>
            </div>
          </div>
          {showViewAll && (
            <Button asChild variant="ghost" className="h-auto p-0 hover:bg-transparent group/all">
              <Link href="/search" className="flex items-center gap-3 t-label !opacity-100 text-primary text-[10px] tracking-[0.2em]">
                View Entire Matrix
                <div className="w-6 h-[1px] bg-primary/30 group-hover/all:w-8 transition-all" />
              </Link>
            </Button>
          )}
        </div>
      )}

      <div className="divide-y divide-white/5 relative z-10">
        {limitedTransactions.map((t, index) => (
          <div
            key={t.id}
            onClick={() => handleTransactionClick(t.id)}
            className="flex items-center justify-between p-8 hover:bg-white/[0.03] cursor-pointer transition-all group animate-enter border-l-2 border-transparent hover:border-primary/40"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-14 h-14 bg-surface-base border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-all">
                  <span className="text-xs font-mono text-white/20 group-hover:text-primary transition-colors">
                    {t.merchant.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-surface-high border border-white/10 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white/20 group-hover:bg-primary transition-colors" />
                </div>
              </div>

              <div className="min-w-0 space-y-1 text-left">
                <span className="coord text-[7px] block mb-1 opacity-40">NODE.{t.category.toUpperCase().substring(0, 4)}</span>
                <p className="font-black text-white uppercase tracking-tight text-lg leading-none truncate w-48 md:w-auto">
                  {t.merchant}
                </p>
                <div className="flex items-center gap-2 t-label text-[8px] opacity-30 lowercase">
                  <span>{getCategoryName(t.category)}</span>
                  <ChevronRight className="h-2 w-2" />
                  <span>Verified</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-white tracking-tighter leading-none mb-2">
                  ₹{Math.abs(t.amount).toLocaleString()}
                </p>
                <span className="coord text-[8px] opacity-30">
                  TS.{format(new Date(t.date), 'yyyy.MM.dd')}
                </span>
              </div>
              <div className="h-12 w-12 flex items-center justify-center rounded-none bg-white/5 border border-white/5 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:border-primary/20">
                <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        ))}
        {limitedTransactions.length === 0 && (
          <div className="text-center py-32 px-10 relative overflow-hidden">
            <div className="absolute inset-0 arc-grid opacity-5" />
            <p className="coord text-[10px] opacity-20 uppercase relative z-10 tracking-[0.4em]">Zero Activity Detected in Matrix</p>
          </div>
        )}
      </div>
    </section>
  );
}
