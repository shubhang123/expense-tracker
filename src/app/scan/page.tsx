
'use client';

import { ArrowLeft, QrCode } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ScanPage() {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-fluid-2xl font-headline font-bold">Scan QR Code</h1>
          <p className="text-sm text-muted-foreground">Quick expense entry</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="font-headline text-base">QR Code Scanner</CardTitle>
          <CardDescription>This feature is coming soon.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground py-12 space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
            <QrCode className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-headline font-semibold text-foreground">Scan to Add Expense</p>
            <p className="text-sm">Point your camera at a QR code to automatically add a transaction.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
