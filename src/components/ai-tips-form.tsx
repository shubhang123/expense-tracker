"use client";

import { useState, useRef, useEffect } from 'react';
import { getFinanceTips, FinanceTipsOutput } from '@/ai/flows/finance-tips';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader, Play, Pause } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const FormSchema = z.object({
  spendingPatterns: z.string().min(50, {
    message: "Please provide at least 50 characters to get a good tip.",
  }),
});

export function AiTipsForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FinanceTipsOutput | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        spendingPatterns: ""
    }
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setResult(null);
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsPlaying(false);
    }
    try {
      const response = await getFinanceTips(data);
      setResult(response);
    } catch (error) {
      console.error(error);
      // You can add toast notifications here for errors
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (result?.audio) {
      audioRef.current = new Audio(result.audio);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [result]);

  const toggleAudio = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  }

  return (
    <>
      <Card className="glassmorphic-card">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="spendingPatterns"
                render={({ field }) => (
                  <FormItem>
                    <Textarea
                      placeholder="e.g., I spend about $400/month on groceries, $200 on dining out, and my biggest expense is my car payment of $500..."
                      className="min-h-[120px] bg-background/50 border-white/20 focus:ring-accent"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-full">
                {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : 'Get My Tips'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <Card className="glassmorphic-card mt-6">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="glassmorphic-card mt-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-white mb-4">Your Personalized Tips</h3>
              {result.audio && (
                <Button variant="ghost" size="icon" onClick={toggleAudio} className="text-accent hover:bg-accent/20 hover:text-accent rounded-full">
                    {isPlaying ? <Pause /> : <Play />}
                </Button>
              )}
            </div>
            <p className="text-muted-foreground whitespace-pre-wrap">{result.tips}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
