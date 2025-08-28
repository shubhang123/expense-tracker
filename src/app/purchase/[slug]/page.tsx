'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function PurchaseDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [transactions] = useLocalStorage('transactions', initialTransactions);
  const [categories] = useLocalStorage('categories', initialCategories);

  const category = categories.find(c => c.id === slug);
  const categoryTransactions = transactions.filter(t => t.category.toLowerCase() === slug);
  
  const total = categoryTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
  
  const items = categoryTransactions.map(t => ({
    name: t.subcategory || t.merchant,
    value: Math.abs(t.amount)
  }));
  
  const purchaseData = {
    store: category?.name || 'Category',
    date: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    total: total,
    items: items,
  };


  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="icon">
          <Link href="/">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Spent Purchase</h1>
        <div className="w-10"></div>
      </div>

      <Card className="flex-1 flex flex-col bg-primary text-black rounded-3xl p-4">
        <CardHeader>
          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold">{purchaseData.store}</span>
            <span className="text-sm">{purchaseData.date}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={purchaseData.items} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="name"
                  stroke="#000000"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide={true} domain={[0, 'dataMax + 200']} />
                <Bar
                  dataKey="value"
                  fill="#000000"
                  radius={[10, 10, 0, 0]}
                  label={{
                    position: 'top',
                    fill: '#000000',
                    formatter: (value: number) => `$${value}`,
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-4xl font-bold">${purchaseData.total.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="bg-black/10 rounded-full">
                <Pencil className="h-5 w-5" />
              </Button>
              <Button variant="default" className="bg-black text-white rounded-full h-12 w-12">
                &#x2713;
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
