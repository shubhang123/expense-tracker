'use client';

import { ArrowLeft, Megaphone, TrendingUp, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import type { Transaction, Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const LARGE_PURCHASE_THRESHOLD = 5000;
const BUDGET_ALERT_THRESHOLD = 0.8;

type Alert = {
  id: string;
  type: 'budget' | 'large_purchase';
  title: string;
  description: string;
  timestamp: Date;
  cta?: {
    text: string;
    href: string;
  };
};

export default function NotificationsPage() {
  const [transactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
  const [categories] = useLocalStorage<Category[]>('categories', initialCategories);

  const spendingData = categories.map(category => {
    const categoryTransactions = transactions.filter(t => t.category.toLowerCase() === category.id.toLowerCase());
    const spent = categoryTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return { ...category, spent, total: category.budget, progress: category.budget > 0 ? (spent / category.budget) : 0 };
  });

  const budgetAlerts: Alert[] = spendingData
    .filter(cat => cat.budget > 0 && cat.progress > BUDGET_ALERT_THRESHOLD)
    .map(cat => ({
      id: `budget-${cat.id}`,
      type: 'budget',
      title: `Threshold Breach: ${cat.name}`,
      description: `Utilization at ${Math.round(cat.progress * 100)}%. Allocation limit of ₹${cat.total.toLocaleString()} nearly exhausted.`,
      timestamp: new Date(),
      cta: { text: 'Audit Matrix', href: '/categories' }
    }));

  const largePurchaseAlerts: Alert[] = transactions
    .filter(t => Math.abs(t.amount) > LARGE_PURCHASE_THRESHOLD)
    .map(t => ({
      id: `large-${t.id}`,
      type: 'large_purchase',
      title: `High Volume Node: ₹${Math.abs(t.amount).toLocaleString()}`,
      description: `A transaction of ₹${Math.abs(t.amount).toLocaleString()} detected at ${t.merchant}.`,
      timestamp: new Date(t.date),
      cta: { text: 'Inspect Unit', href: `/search?q=${t.merchant}` }
    }));

  const allAlerts = [...budgetAlerts, ...largePurchaseAlerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'budget': return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'large_purchase': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Megaphone className="h-5 w-5 text-white/40" />;
    }
  };

  return (
    <div className="space-y-12 pb-32 max-w-4xl mx-auto enter">
      {/* ── Header ── */}
      <header className="space-y-4">
        <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent group">
          <Link href="/" className="flex items-center gap-2 t-label opacity-60 group-hover:opacity-100 transition-opacity">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="pt-2 flex justify-between items-end">
          <div>
            <span className="t-label">Surveillance</span>
            <h1 className="t-h1 text-5xl md:text-6xl">System <span className="t-light opacity-50">Event</span> <span className="t-accent">Logs</span></h1>
          </div>
          <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
            <span className="t-label !opacity-100 text-[10px]">{allAlerts.length} ACTIVE EVENTS</span>
          </div>
        </div>
      </header>

      {/* ── Alerts Matrix ── */}
      <div className="relative group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] blob blob-violet opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity" />

        {allAlerts.length > 0 ? (
          <section className="card bg-surface-raised border-white/5 p-0 overflow-hidden relative z-10">
            <div className="divide-y divide-white/5">
              {allAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="p-8 hover:bg-white/2 transition-all group/item flex gap-6"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/5",
                    alert.type === 'budget' ? 'bg-primary/10 border-primary/20' : 'bg-red-500/10 border-red-500/20'
                  )}>
                    {getIcon(alert.type)}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="t-label text-[9px] mb-1 opacity-40">TIMESTAMP: {format(alert.timestamp, 'HH:mm:ss')}</p>
                        <h3 className="font-black text-xl text-white uppercase tracking-tight">{alert.title}</h3>
                      </div>
                      <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border",
                        alert.type === 'budget' ? 'borderColor-primary/20 text-primary' : 'borderColor-red-500/20 text-red-500'
                      )}>
                        {alert.type.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-white/40 leading-relaxed font-medium">
                      {alert.description}
                    </p>

                    {alert.cta && (
                      <Button asChild variant="ghost" className="h-auto p-0 hover:bg-transparent group/link">
                        <Link href={alert.cta.href} className="flex items-center gap-2 t-label !opacity-100 text-primary text-[10px]">
                          {alert.cta.text}
                          <ChevronRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="card bg-surface-raised border-white/5 py-24 px-10 text-center relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center max-w-xs mx-auto space-y-6">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white/20" />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-2xl text-white uppercase tracking-tighter">Void Detected</h3>
                <p className="t-label !opacity-40 leading-relaxed">System logs are clear. No structural breaches or budget overflows recorded.</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
