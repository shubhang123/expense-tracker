'use client';

import React, { useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  transactions as initialTransactions,
  categories as initialCategories,
  getMonthlyLimit,
  getTotalSpentThisMonth
} from '@/lib/data';
import { Transaction, Category } from '@/lib/types';
import {
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  LayoutGrid,
  ArrowRight,
  Monitor,
  Search,
  ChevronRight,
  TrendingUp,
  Box,
  Circle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DashboardV5() {
  const [transactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
  const [categories] = useLocalStorage<Category[]>('categories', initialCategories);

  const totalSpent = useMemo(() => getTotalSpentThisMonth(transactions), [transactions]);
  const monthlyLimit = getMonthlyLimit();
  const remaining = Math.max(0, monthlyLimit - totalSpent);
  const percentUsed = Math.min(100, (totalSpent / monthlyLimit) * 100);

  // Filter recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="bg-mesh-art min-h-screen px-6 py-24 relative selection:bg-art-blush selection:text-art-charcoal overflow-x-hidden">
      <div className="bg-noise-art" />

      {/* ── v5 Organic Blobs ── */}
      <div className="art-blob bg-art-blush w-[600px] h-[400px] -top-20 -right-20" />
      <div className="art-blob bg-art-sage w-[500px] h-[500px] top-[40%] -left-20 delay-1000" />
      <div className="art-blob bg-art-lavender w-[400px] h-[300px] bottom-0 right-[10%] delay-2000" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* ── v5 Hero Strip: Sculptural Typography ── */}
        <header className="mb-32 enter-art">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-foreground/5 pb-16">
            <div className="space-y-4">
              <span className="t-label-jost">Gallery Context // Portfolio_v5.0</span>
              <h1 className="t-hero-num text-foreground">
                <span className="italic font-light">₹</span>{totalSpent.toLocaleString()}
              </h1>
              <p className="t-para-art max-w-md">
                Your financial architecture is evolving. Currently utilizing <span className="font-semibold text-foreground">{percentUsed.toFixed(1)}%</span> of the monthly allocation matrix.
              </p>
            </div>

            <div className="flex flex-col items-end gap-6">
              <div className="flex gap-4">
                <Button asChild variant="outline" className="glass-art border-foreground/10 rounded-full h-16 px-8 hover:bg-foreground hover:text-background transition-colors duration-500">
                  <Link href="/add" className="flex items-center gap-3">
                    <Plus className="h-5 w-5" />
                    <span className="font-ui font-semibold uppercase tracking-widest text-xs">Commit Payload</span>
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 text-[10px] font-ui tracking-widest opacity-40">
                <div className="flex items-center gap-2"><Circle className="h-2 w-2 fill-art-sage border-0" /> SYSTEM_OK</div>
                <div className="flex items-center gap-2"><Circle className="h-2 w-2 fill-art-blush border-0" /> DATA_SYNC_ACTIVE</div>
              </div>
            </div>
          </div>

          {/* ── Ticker ── */}
          <div className="mt-8 overflow-hidden whitespace-nowrap opacity-20 hover:opacity-100 transition-opacity cursor-default">
            <div className="inline-block animate-marquee font-ui text-[10px] tracking-[0.4em] uppercase">
              REVENUE_STREAM_OPTIMIZED // NODE_DELTA_0.4 // CORE_INFRA_HEALTH_100% // ALLOCATION_STABLE //
              REVENUE_STREAM_OPTIMIZED // NODE_DELTA_0.4 // CORE_INFRA_HEALTH_100% // ALLOCATION_STABLE //
            </div>
          </div>
        </header>

        {/* ── v5 Asymmetric Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ── Allocation Card (Large Artist Slice) ── */}
          <section className="lg:col-span-8 enter-art" style={{ animationDelay: '100ms' }}>
            <div className="glass-art-active rounded-[2rem] p-12 h-full flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <h2 className="font-title text-4xl italic mb-2">Resource Allocation</h2>
                  <span className="t-label-jost">Structural Distribution</span>
                </div>
                <div className="circle-icon">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="relative">
                  {/* ── v5 Minimal Donut ── */}
                  <div className="w-64 h-64 rounded-full border-[20px] border-foreground/5 relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[20px] border-art-sage" style={{ clipPath: `polygon(50% 50%, -50% -50%, ${percentUsed}% -50%)`, transform: 'rotate(-90deg)' }} />
                    <div className="text-center">
                      <span className="block font-title text-5xl italic leading-none">{Math.round(percentUsed)}%</span>
                      <span className="t-label-jost opacity-30">utilized</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {categories.slice(0, 3).map((cat, i) => (
                    <div key={cat.id} className="group/item">
                      <div className="flex justify-between items-end mb-3">
                        <span className="font-ui font-semibold text-sm uppercase tracking-widest">{cat.name}</span>
                        <span className="font-title italic text-xl">₹{cat.budget.toLocaleString()}</span>
                      </div>
                      <div className="h-[1px] bg-foreground/10 relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-art-lavender transition-all duration-1000 w-[60%]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button asChild variant="ghost" className="mt-16 w-full h-16 border-t border-foreground/5 rounded-none hover:bg-transparent group/btn p-0">
                <Link href="/analytics" className="flex items-center justify-between w-full">
                  <span className="t-label-jost">View Full Spectrum</span>
                  <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </div>
          </section>

          {/* ── Metrics Cluster (Right Side) ── */}
          <div className="lg:col-span-4 flex flex-col gap-8 lg:gap-12">
            <div className="glass-art-active rounded-[2rem] p-10 enter-art" style={{ animationDelay: '200ms' }}>
              <span className="t-label-jost mb-6 block">Balance_Residual</span>
              <div className="font-title text-6xl italic leading-none mb-4">
                ₹{remaining.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-art-sage font-ui text-[10px] font-bold tracking-widest">
                <ArrowUpRight className="h-3 w-3" />
                SAFE_ZONE
              </div>
            </div>

            <div className="glass-art-active rounded-[2rem] p-10 flex-1 enter-art" style={{ animationDelay: '300ms' }}>
              <div className="flex justify-between items-center mb-8">
                <span className="t-label-jost">Recent_Activity</span>
                <HistoryIcon className="h-4 w-4 opacity-30" />
              </div>

              <div className="space-y-6">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center group/tx cursor-pointer">
                    <div>
                      <div className="font-ui font-semibold text-xs transition-colors group-hover/tx:text-art-blush">{tx.merchant}</div>
                      <div className="t-label-jost text-[8px] opacity-30 mt-1">{tx.category}</div>
                    </div>
                    <div className="font-title italic text-lg">
                      -₹{tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild variant="ghost" className="mt-10 w-full hover:bg-foreground hover:text-background rounded-full border border-foreground/5 transition-all duration-500 font-ui text-[10px] font-black uppercase tracking-[0.2em]">
                <Link href="/analytics">Catalogue</Link>
              </Button>
            </div>
          </div>

        </div>

        {/* ── v5 Bottom Navigation/Tools ── */}
        <footer className="mt-32 pt-16 border-t border-foreground/5 flex flex-col md:flex-row justify-between gap-12 enter-art" style={{ animationDelay: '400ms' }}>
          <div className="flex gap-16">
            <div className="space-y-4">
              <span className="t-label-jost">Architecture</span>
              <ul className="space-y-2 font-ui text-xs font-semibold opacity-40">
                <li className="hover:opacity-100 transition-opacity"><Link href="/analytics">Spectral Audit</Link></li>
                <li className="hover:opacity-100 transition-opacity"><Link href="/categories">Node Control</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <span className="t-label-jost">Protocol</span>
              <ul className="space-y-2 font-ui text-xs font-semibold opacity-40">
                <li className="hover:opacity-100 transition-opacity whitespace-nowrap cursor-help">Terms of Aesthetics</li>
                <li className="hover:opacity-100 transition-opacity whitespace-nowrap cursor-help">Digital Privacy Art</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="font-title text-4xl italic mb-2">Emerald.</div>
            <span className="t-label-jost opacity-20">Artistically Engineered // 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Simple History Icon since Lucide might not have 'History' as exactly expected in some versions
function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

// Marquee animation css (inline or in globals.css)
// I already have globals.css for breathing blobs, marquee is just standard
