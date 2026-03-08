'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddTransactionForm } from '@/components/forms/add-transaction-form';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useSearchParams } from 'next/navigation';
import React from 'react';

function AddTransactionPageContent() {
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
    <div className="min-h-screen bg-black gallery-grid bg-noise pb-32 pt-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* ── v4 Header: Protocol Style ── */}
        <header className="mb-24 relative border-b-4 border-white pb-12">
          <div className="flex justify-between items-start mb-12">
            <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent group">
              <Link href="/" className="flex items-center gap-2 t-label group-hover:text-blue-500 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>RETURN_TO_CORE</span>
              </Link>
            </Button>
            <div className="coord">TRX.PROTO // AUTH_OK</div>
          </div>
          <h1 className="t-display">
            RECORD<br />
            <span className="text-white/20">PAYLOAD.</span>
          </h1>
        </header>

        {/* ── v4 Form Container ── */}
        <section className="card-gallery p-12">
          <div className="flex justify-between items-start mb-16">
            <div>
              <h2 className="text-3xl font-black mb-2 uppercase italic">Transaction_Event</h2>
              <div className="t-label opacity-40 uppercase">Payload Definition Seq</div>
            </div>
            <div className="w-8 h-8 bauhaus-red" />
          </div>

          <div className="relative z-10">
            <AddTransactionForm
              categories={categories}
              onSubmit={handleAddTransaction}
              defaultCategory={category}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AddTransactionPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="t-label animate-pulse">Initializing Protocol...</div></div>}>
      <AddTransactionPageContent />
    </React.Suspense>
  )
}
