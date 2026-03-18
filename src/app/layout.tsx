import type { Metadata } from 'next';
import './globals.css';
import { LayoutWrapper } from '@/components/layout-wrapper';

export const metadata: Metadata = {
  title: 'BLOOM',
  description: 'Your financial landscape refined.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@200;300;400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface-dim text-on-background font-body selection:bg-tertiary/30 min-h-screen relative overflow-x-hidden antialiased">
        <div className="fixed inset-0 noise-overlay z-[100]"></div>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
