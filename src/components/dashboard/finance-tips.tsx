
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFinanceTips } from '@/ai/flows/finance-tips';
import { Loader2, Sparkles, Volume2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function FinanceTips({ spendingPatterns }: { spendingPatterns: string }) {
  const [tips, setTips] = useState('');
  const [audio, setAudio] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const handleGetTips = async () => {
    setLoading(true);
    setShowCard(true);
    try {
      const response = await getFinanceTips({ spendingPatterns });
      setTips(response.tips);
      if (response.audio) {
        setAudio(response.audio);
      }
    } catch (error) {
      console.error('Error getting finance tips:', error);
      setTips('Sorry, I couldn\'t fetch any tips right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const playAudio = () => {
    if (audio) {
      const audioPlayer = new Audio(audio);
      audioPlayer.play();
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleGetTips} disabled={loading} className="w-full" size="lg">
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles /> Get AI-Powered Tips
          </div>
        )}
      </Button>

      {showCard && (
        <Card className="bg-neutral-900 border-primary">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Personal Finance Tips</CardTitle>
            {!loading && audio && (
                <Button onClick={playAudio} variant="ghost" size="icon">
                    <Volume2 />
                </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-muted-foreground">{tips}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
