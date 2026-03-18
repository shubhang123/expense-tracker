'use client';

import dynamic from 'next/dynamic';

// Dynamically import the entire app with no SSR
const ClientApp = dynamic(() => import('./client-app'), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
});

export default function Home() {
  return <ClientApp />;
}
