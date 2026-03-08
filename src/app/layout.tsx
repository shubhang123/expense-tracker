import type { Metadata } from 'next';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/jost/600.css';
import '@fontsource/jost/700.css';
import '@fontsource/inter/400.css';
import './globals.css';
import { AppLayout } from '@/components/layout';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Emerald Finance | The Artistic Gallery',
  description: 'A soft, premium finance app UI that feels like a living art piece.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen font-ui">
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
