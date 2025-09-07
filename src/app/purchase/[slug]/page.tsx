'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Transaction, Category } from '@/lib/types';


// Custom label for inside the bar
const CustomBarLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    const radius = 10;
  
    return (
      <g>
        <text x={x + width / 2} y={y + height - 10} fill="#fff" textAnchor="middle" dominantBaseline="middle" className="text-sm font-bold">
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

  const handleDeleteCategoryTransactions = () => {
    const remainingTransactions = transactions.filter(t => t.category.toLowerCase() !== slug);
    setTransactions(remainingTransactions);
    router.push('/');
  }

  return (
    <div className="flex flex-col h-full space-y-6">
       <div className="flex items-center justify-between relative text-center">
        <Button asChild variant="ghost" size="icon" className="bg-neutral-800 rounded-full absolute left-0">
          <Link href="/">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold flex-1 text-center">Category Details</h1>
      </div>

      <Card className="flex-1 flex flex-col bg-primary text-primary-foreground rounded-3xl p-4">
        <CardHeader>
          <div className="flex justify-between items-center text-lg text-black">
            <span className="font-semibold">{purchaseData.store}</span>
            <span className="text-sm">{purchaseData.date}</span>
          </div>
          <hr className="border-black/20" />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={purchaseData.items} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--primary-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis hide={true} domain={[0, 'dataMax + 50']} />
                <Tooltip
                    contentStyle={{ display: 'none' }}
                    cursor={{fill: 'rgba(0,0,0,0.1)', rx: 10}}
                />
                <Bar
                  dataKey="value"
                  radius={[10, 10, 10, 10]}
                  label={<CustomBarLabel />}
                >
                    {
                        purchaseData.items.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="black" />
                        ))
                    }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-4xl font-bold text-black">₹{purchaseData.total.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="icon" className="rounded-full w-12 h-12 border-black">
                <Link href={`/edit/${transactions.find(t => t.category === slug)?.id || ''}`}>
                    <Pencil className="h-5 w-5 text-black" />
                </Link>
              </Button>
               <Button variant="secondary" size="icon" className="rounded-full w-12 h-12 bg-black text-white hover:bg-neutral-800">
                    <Check className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
