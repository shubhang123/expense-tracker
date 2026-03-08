
'use client';

import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { transactions as initialTransactions, categories as initialCategories } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function ExportPage() {
  const [transactions] = useLocalStorage('transactions', initialTransactions);
  const [categories] = useLocalStorage('categories', initialCategories);
  const { toast } = useToast();

  const getCategoryName = (id: string) => {
    const category = categories.find((c: any) => c.id.toLowerCase() === id.toLowerCase());
    return category ? category.name : 'N/A';
  }

  const handleExport = () => {
    const header = ['Date', 'Merchant', 'Amount', 'Category', 'Subcategory', 'Notes'];
    const escapeCSV = (str: string | null | undefined) => {
      if (str === null || str === undefined) return '';
      const sanitized = String(str);
      if (sanitized.includes(',')) {
        return `"${sanitized.replace(/"/g, '""')}"`;
      }
      return sanitized;
    };

    const rows = transactions.map((t: any) => [
      new Date(t.date).toISOString().split('T')[0],
      escapeCSV(t.merchant),
      t.amount,
      getCategoryName(t.category),
      escapeCSV(t.subcategory),
      escapeCSV(t.notes)
    ].join(','));

    const csvContent = [header.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export Successful!',
      description: 'Your transaction data has been downloaded.',
    });
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
          <h1 className="text-fluid-2xl font-headline font-bold">Export</h1>
          <p className="text-sm text-muted-foreground">Download your data</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="font-headline text-base">Export Transactions</CardTitle>
          <CardDescription>
            Download all your transaction data as a CSV file for backup or use in other apps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} className="w-full" size="lg">
            <Download className="mr-2 h-4 w-4" /> Export All Transactions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}