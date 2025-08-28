import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingBag, Film, Utensils, Bus } from 'lucide-react';

const transactions = [
  { name: 'Amazon', category: 'Shopping', amount: -79.99, icon: <ShoppingBag className="size-5" />, date: 'Today' },
  { name: 'Netflix', category: 'Entertainment', amount: -15.49, icon: <Film className="size-5" />, date: 'Yesterday' },
  { name: 'Starbucks', category: 'Dining', amount: -6.50, icon: <Utensils className="size-5" />, date: 'Yesterday' },
  { name: 'Uber', category: 'Transport', amount: -22.30, icon: <Bus className="size-5" />, date: '2 days ago' },
  { name: 'Whole Foods', category: 'Groceries', amount: -124.50, icon: <ShoppingBag className="size-5" />, date: '2 days ago' },
  { name: 'Apple', category: 'Shopping', amount: -999.00, icon: <ShoppingBag className="size-5" />, date: '3 days ago' },
];

export function RecentTransactions() {
  return (
    <Card className="glassmorphic-card">
      <CardHeader>
        <CardTitle className="text-white">Recent Transactions</CardTitle>
        <CardDescription className="text-gray-400">Your latest transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={index} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/20 text-primary">{transaction.icon}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{transaction.name}</p>
                  <p className="text-sm text-gray-400">{transaction.category}</p>
                </div>
                <div className="ml-auto text-right">
                    <p className="font-medium text-sm text-red-400">
                        {transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
