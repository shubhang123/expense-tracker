'use client';

import { ArrowLeft, Circle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddTransactionForm } from '@/components/forms/add-transaction-form';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useSearchParams } from 'next/navigation';
import React from 'react';

function AddTransactionPageContentV5() {
  const [transactions, setTransactions] = useLocalStorage(
    'transactions',
    initialTransactions
  );
  const [categories] = useLocalStorage('categories', initialCategories);

  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const handleAddTransaction = (data: any) => {
    const newTransaction = {
      ...data,
      id: `trx-${Date.now()}`,
      date: new Date(data.date).toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div className="bg-mesh-art min-h-screen px-6 py-24 relative selection:bg-art-blush selection:text-art-charcoal overflow-x-hidden">
      <div className="bg-noise-art" />
      
      {/* ── v5 Organic Blobs ── */}
      <div className="art-blob bg-art-blush w-[600px] h-[400px] -top-20 -right-20" />
      <div className="art-blob bg-art-sage w-[500px] h-[500px] bottom-0 -left-20 delay-1000" />

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* ── v5 Header: Editorial Standard ── */}
        <header className="mb-24 border-b border-foreground/5 pb-16 enter-art">
          <div className="flex justify-between items-start mb-12">
            <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent group">
              <Link href="/" className="flex items-center gap-2 t-label-jost group-hover:text-art-blush transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>RETURN_TO_CORE</span>
              </Link>
            </Button>
            <div className="coord">TRX.PROTO // PAYLOAD_ENTRY</div>
          </div>
          
          <div className="space-y-4">
            <span className="t-label-jost">Record Event // Sequential Logic</span>
            <h1 className="t-hero-num text-foreground">
              Record <span className="font-light italic">Payload.</span>
            </h1>
          </div>
        </header>

        {/* ── v5 Form Container: Editorial Section ── */}
        <section className="glass-art-active rounded-[2rem] p-12 enter-art" style={{ animationDelay: '100ms' }}>
          <div className="flex justify-between items-start mb-20">
            <div>
              <h2 className="font-title text-4xl italic mb-2">Transaction_Event</h2>
              <span className="t-label-jost">Payload Definition Matrix</span>
            </div>
            <div className="circle-icon border-art-blush text-art-blush">
              <Circle className="h-2 w-2 fill-current border-0" />
            </div>
          </div>

          <div className="relative z-10">
            <AddTransactionForm
              categories={categories}
              onSubmit={handleAddTransaction}
              defaultCategory={category}
            />
          </div>
        </section>
        
        <footer className="mt-24 text-center opacity-20 t-label-jost">
          Awaiting User Input // Buffer Active
        </footer>
      </div>
    </div>
  );
}

export default function AddTransactionPageV5() {
  return (
    <React.Suspense fallback={
      <div className="bg-mesh-art min-h-screen flex items-center justify-center">
        <div className="t-label-jost animate-pulse">Initializing Protocol...</div>
      </div>
    }>
      <AddTransactionPageContentV5 />
    </React.Suspense>
  )
}
