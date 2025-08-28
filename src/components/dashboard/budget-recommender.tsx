
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBudgetRecommendations } from '@/ai/flows/budget-recommendation';
import { Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function BudgetRecommender() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [error, setError] = useState('');

  const [transactions] = useLocalStorage('transactions', initialTransactions);
  const [categories] = useLocalStorage('categories', initialCategories);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setShowCard(true);
    setError('');
    try {
      // Filter transactions from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentTransactions = transactions.filter(
        (t: any) => new Date(t.date) > thirtyDaysAgo
      );
      
      const response = await getBudgetRecommendations({
        spendingHistory: JSON.stringify(recentTransactions, null, 2),
        categories: JSON.stringify(categories, null, 2),
      });

      if (response.recommendations) {
        setRecommendations(response.recommendations);
      } else {
        setError('Could not get recommendations. The AI model might be unavailable.');
      }

    } catch (e) {
      console.error('Error getting budget recommendations:', e);
      setError('Sorry, I couldn\'t fetch any recommendations right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGetRecommendations} disabled={loading} className="w-full" size="lg">
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles /> Get AI Budget Recommendations
          </div>
        )}
      </Button>

      {showCard && (
        <Card className="bg-neutral-900 border-primary">
          <CardHeader>
            <CardTitle>AI Budget Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            ) : error ? (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-3 bg-neutral-800 rounded-lg">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-lg">{rec.category}</p>
                        <p className="font-bold text-lg">${rec.budget.toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{rec.reasoning}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
