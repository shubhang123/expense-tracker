
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FinanceTips({ spendingPatterns }: { spendingPatterns: string }) {
  return (
    <Card className="bg-neutral-900 border-primary">
      <CardHeader>
        <CardTitle>Finance Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">AI-powered finance tips feature has been removed.</p>
      </CardContent>
    </Card>
  );
}
