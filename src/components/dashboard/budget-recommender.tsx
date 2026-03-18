
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function BudgetRecommender() {
  return (
    <Card className="bg-neutral-900 border-primary">
      <CardHeader>
        <CardTitle>Budget Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">AI-powered budget recommendations feature has been removed.</p>
      </CardContent>
    </Card>
  );
}
