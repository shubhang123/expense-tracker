'use client';

import { LayoutWrapper } from './layout-wrapper';

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LayoutWrapper>
      {children}
    </LayoutWrapper>
  );
}