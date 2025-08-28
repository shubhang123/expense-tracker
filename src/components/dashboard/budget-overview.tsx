import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const budgets = [
  { name: 'Groceries', spent: 350, total: 500 },
  { name: 'Dining Out', spent: 280, total: 300 },
  { name: 'Shopping', spent: 550, total: 500 },
  { name: 'Transport', spent: 100, total: 150 },
];

export function BudgetOverview() {
  return (
    <Card className="glassmorphic-card">
      <CardHeader>
        <CardTitle className="text-white">Budget Progress</CardTitle>
        <CardDescription className="text-muted-foreground">Your performance against your budgets this month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {budgets.map((budget, index) => {
          const progress = (budget.spent / budget.total) * 100;
          return (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-white">{budget.name}</span>
                <span className="text-sm text-muted-foreground">${budget.spent} / ${budget.total}</span>
              </div>
              <Progress value={progress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
               {progress > 90 && (
                <p className="text-xs text-yellow-400 mt-1">{progress > 100 ? 'Over budget!' : 'Nearing budget limit'}</p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
