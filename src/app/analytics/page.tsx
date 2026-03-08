'use client';

import { useMemo } from 'react';
import { ArrowLeft, Activity, Target, Zap, PieChart as PieIcon, ChevronRight, TrendingUp, Search, Circle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import type { Transaction, Category } from '@/lib/types';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

const ART_COLORS = [
    '#F0D4C8', // Blush
    '#C8D8C4', // Sage
    '#D4CCE8', // Lavender
    '#F0E4B8', // Butter
    '#FAF8F3', // Ivory (Accent)
];

export default function AnalyticsPageV5() {
    const [transactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
    const [categories] = useLocalStorage<Category[]>('categories', initialCategories);

    const analytics = useMemo(() => {
        const categorySpending = categories.map((cat, index) => {
            const catTransactions = transactions.filter(
                t => t.category.toLowerCase() === cat.id.toLowerCase()
            );
            const totalSpent = catTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
            return {
                name: cat.name,
                value: totalSpent,
                budget: cat.budget,
                color: ART_COLORS[index % ART_COLORS.length],
            };
        }).filter(c => c.value > 0);

        const totalSpent = categorySpending.reduce((acc, c) => acc + c.value, 0);
        const totalBudget = categories.reduce((acc, c) => acc + c.budget, 0);

        const merchantMap = new Map<string, number>();
        transactions.forEach(t => {
            const current = merchantMap.get(t.merchant) || 0;
            merchantMap.set(t.merchant, current + Math.abs(t.amount));
        });
        const topMerchants = Array.from(merchantMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, amount]) => ({ name, amount }));

        return {
            categorySpending,
            totalSpent,
            totalBudget,
            topMerchants,
        };
    }, [transactions, categories]);

    const budgetUtilization = analytics.totalBudget > 0
        ? Math.round((analytics.totalSpent / analytics.totalBudget) * 100)
        : 0;

    return (
        <div className="bg-mesh-art min-h-screen px-6 py-24 relative selection:bg-art-blush selection:text-art-charcoal overflow-x-hidden">
            <div className="bg-noise-art" />

            {/* ── v5 Organic Blobs ── */}
            <div className="art-blob bg-art-lavender w-[600px] h-[400px] -top-20 -left-20" />
            <div className="art-blob bg-art-sage w-[500px] h-[500px] bottom-0 -right-20 delay-1000" />

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* ── v5 Header: Editorial Standard ── */}
                <header className="mb-24 border-b border-foreground/5 pb-16 enter-art">
                    <div className="flex justify-between items-start mb-12">
                        <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent group">
                            <Link href="/" className="flex items-center gap-2 t-label-jost group-hover:text-art-blush transition-colors">
                                <ArrowLeft className="h-4 w-4" />
                                <span>RETURN_TO_CORE</span>
                            </Link>
                        </Button>
                        <div className="coord">ANL.SYS // SPECTRAL_AUDIT</div>
                    </div>

                    <div className="space-y-4">
                        <span className="t-label-jost">Data Architecture // Spectral Map</span>
                        <h1 className="t-hero-num text-foreground">
                            Spectral <span className="font-light italic">Audit.</span>
                        </h1>
                    </div>
                </header>

                {/* ── v5 Stat Nodes ── */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 enter-art" style={{ animationDelay: '100ms' }}>
                    {[
                        { label: 'CUMULATIVE_VOLUME', value: `₹${analytics.totalSpent.toLocaleString()}`, color: 'text-foreground' },
                        { label: 'ALLOCATION_RATIO', value: `${budgetUtilization}%`, color: 'text-art-blush' },
                        { label: 'DATA_POINTS', value: transactions.length, color: 'text-art-sage' },
                        { label: 'MATRIX_STATUS', value: 'OPTIMAL', color: 'text-art-lavender' },
                    ].map((stat, i) => (
                        <div key={stat.label} className="glass-art-active rounded-[2rem] p-10 group">
                            <div className="t-label-jost mb-8 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full border border-foreground/30 group-hover:bg-foreground transition-all" />
                                {stat.label}
                            </div>
                            <div className={cn("font-title text-5xl italic leading-none tracking-tighter", stat.color)}>{stat.value}</div>
                        </div>
                    ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* ── v5 Allocation Canvas ── */}
                    <section className="lg:col-span-7 enter-art" style={{ animationDelay: '200ms' }}>
                        <div className="glass-art-active rounded-[2rem] p-12 h-full">
                            <div className="flex justify-between items-start mb-16">
                                <div>
                                    <h2 className="font-title text-4xl italic mb-2">Spectral_Map</h2>
                                    <span className="t-label-jost">Category Dispersion</span>
                                </div>
                                <div className="circle-icon">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="h-[400px] w-full relative mb-16">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.categorySpending}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={110}
                                            outerRadius={160}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="transparent"
                                        >
                                            {analytics.categorySpending.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    className="hover:opacity-80 transition-opacity cursor-help"
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                                backdropFilter: 'blur(10px)',
                                                border: 'none',
                                                borderRadius: '20px',
                                                padding: '20px',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                                            }}
                                            itemStyle={{
                                                fontFamily: 'var(--font-ui)',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                fontSize: '10px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <span className="block font-title text-6xl italic leading-none">{analytics.categorySpending.length}</span>
                                        <span className="t-label-jost opacity-30">Nodes</span>
                                    </div>
                                </div>
                            </div>

                            <div className="art-grid gap-4">
                                {analytics.categorySpending.map(item => (
                                    <div key={item.name} className="col-span-12 md:col-span-6 flex justify-between items-center p-6 border border-foreground/5 hover:border-foreground/20 rounded-2xl transition-all group/item">
                                        <div className="flex items-center gap-4">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="font-ui font-semibold text-xs uppercase tracking-widest">{item.name}</span>
                                        </div>
                                        <span className="font-title text-xl italic group-hover/item:text-art-blush transition-colors">₹{item.value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── v5 Art Catalogue (Merchant Audit) ── */}
                    <section className="lg:col-span-5 enter-art" style={{ animationDelay: '300ms' }}>
                        <div className="glass-art-active rounded-[2rem] p-12 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-16">
                                <div>
                                    <h2 className="font-title text-4xl italic mb-2">Entity_Audit</h2>
                                    <span className="t-label-jost">Catalogue of Engagements</span>
                                </div>
                                <div className="circle-icon">
                                    <Search className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="space-y-0 border-t border-foreground/5 flex-1">
                                {analytics.topMerchants.map((merchant, index) => (
                                    <div key={merchant.name} className="flex items-center justify-between py-10 border-b border-foreground/5 hover:bg-foreground/2 transition-colors px-4 group/row">
                                        <div className="flex items-center gap-8">
                                            <span className="font-title text-3xl italic opacity-10 group-hover/row:opacity-100 transition-opacity">0{index + 1}</span>
                                            <div>
                                                <div className="t-label-jost text-[8px] opacity-30 mb-1">NODE_ID</div>
                                                <h3 className="font-ui font-semibold uppercase text-sm tracking-widest leading-none">{merchant.name}</h3>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="t-label-jost text-[8px] opacity-30 mb-1">VOLUME</div>
                                            <div className="font-title text-2xl italic">₹{merchant.amount.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button className="mt-16 h-24 bg-foreground text-background hover:bg-art-blush hover:text-art-charcoal rounded-[2rem] transition-all duration-700 group/btn">
                                <div className="w-full flex justify-between items-center px-12">
                                    <div className="text-left">
                                        <div className="t-label-jost opacity-50 group-hover:opacity-100">Full Archive</div>
                                        <div className="font-title text-2xl italic">Download_Audit_Log</div>
                                    </div>
                                    <ChevronRight className="h-8 w-8 group-hover:translate-x-4 transition-transform duration-700" />
                                </div>
                            </Button>
                        </div>
                    </section>
                </div>

                <footer className="mt-32 text-center opacity-20 t-label-jost">
                    End of Spectral Audit // Version 5.0.0
                </footer>
            </div>
        </div>
    );
}
