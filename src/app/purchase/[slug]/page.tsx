'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Transaction, Category } from '@/lib/types';

const CustomBarLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  return (
    <g>
      <text x={x + width / 2} y={y + height - 10} fill="hsl(var(--primary-foreground))" textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold font-mono">
        ₹{value}
      </text>
    </g>
  );
};

export default function PurchaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
  const [categories] = useLocalStorage<Category[]>('categories', initialCategories);

  const category = categories.find(c => c.id === slug);
  const categoryTransactions = transactions.filter(t => t.category.toLowerCase() === slug);

  const total = categoryTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const items = categoryTransactions.map(t => ({
    name: t.subcategory || t.merchant,
    value: Math.abs(t.amount),
  }));

  const purchaseData = {
    store: category?.name || 'Category',
    date: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    total: total,
    items: items,
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-fluid-2xl font-headline font-bold">{purchaseData.store}</h1>
          <p className="text-sm text-muted-foreground">{purchaseData.date}</p>
        </div>
      </div>

      {/* Total Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute right-10 -bottom-6 w-14 h-14 bg-white/5 rotate-45" />
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-80">Total Spent</p>
          <p className="text-fluid-3xl font-headline font-bold mt-1">₹{purchaseData.total.toLocaleString()}</p>
          <p className="text-sm opacity-70 mt-1">{items.length} transaction{items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Bar Chart */}
      {items.length > 0 && (
        <Card className="border-border/50 shadow-card">
          <CardHeader className="pb-2">
            <p className="font-headline font-semibold text-sm">Spending Breakdown</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={purchaseData.items} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis hide={true} domain={[0, 'dataMax + 50']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      color: 'hsl(var(--foreground))',
                      fontSize: '13px',
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]} label={<CustomBarLabel />}>
                    {purchaseData.items.map((_, index) => (
                      <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction List */}
      <Card className="border-border/50 shadow-card">
        <CardHeader className="pb-2">
          <p className="font-headline font-semibold text-sm">Transactions</p>
        </CardHeader>
        <CardContent className="space-y-1">
          {categoryTransactions.map(t => (
            <Link
              key={t.id}
              href={`/edit/${t.id}`}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{t.merchant.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.merchant}</p>
                  <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
              <span className="font-mono font-bold text-sm">₹{Math.abs(t.amount).toLocaleString()}</span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
