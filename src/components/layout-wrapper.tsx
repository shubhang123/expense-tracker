'use client';

import { AppLayout } from './layout';
import { Toaster } from '@/components/ui/toaster';
import { ClientOnly } from './client-only';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <AppLayout>
        {children}
        <Toaster />
      </AppLayout>
    </ClientOnly>
  );
}
