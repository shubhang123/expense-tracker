import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

export function AiTipsCard() {
  return (
    <Card className="glassmorphic-card col-span-1 lg:col-span-2 flex flex-col justify-between bg-[linear-gradient(135deg,#1a5c3a,hsl(158,41%,33%))] text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-yellow-400" />
          AI-Powered Financial Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-200 mb-4">
          Get personalized advice based on your spending habits to improve your financial health.
        </p>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-bold transition-transform hover:scale-105">
          <Link href="/ai-tips">Get Tips</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
