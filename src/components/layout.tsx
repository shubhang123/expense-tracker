'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Bell,
  Menu,
  Settings,
  FolderKanban,
  Upload,
  Download,
  User,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Profile } from '@/lib/types';
import { FloatingActionButton } from './floating-action-button';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [profile] = useLocalStorage<Profile>('user-profile', {
    avatarUrl: 'https://picsum.photos/100/100',
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isDark = true;
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const menuItems = [
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/categories', icon: FolderKanban, label: 'Categories' },
    { href: '/import', icon: Upload, label: 'Import' },
    { href: '/export', icon: Download, label: 'Export' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/notifications', icon: Bell, label: 'Alerts' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-screen bg-surface-void bg-noise relative overflow-hidden text-foreground selection:bg-primary/30">
      {/* ── v3: Atmospheric Art Piece Layer ── */}
      <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
      <div className="absolute inset-0 arc-grid opacity-20 pointer-events-none" />

      {/* Geometric Artifacts: Blueprints */}
      <div className="absolute top-10 left-10 coord">SYS.CORE // [ 52.1 | 09.4 ]</div>
      <div className="absolute top-10 right-10 coord">MTX.ALPHA // {new Date().getFullYear()}</div>
      <div className="absolute bottom-10 left-10 coord">BAUHAUS.V3 // SEED.0911</div>
      <div className="absolute bottom-10 right-10 coord">EMERALD.FIN // INFRA.SEC</div>

      {/* Bauhaus Accent Blocks */}
      <div className="absolute top-1/4 left-5 w-1 h-32 bauhaus-red opacity-20" />
      <div className="absolute bottom-1/4 right-5 w-1 h-32 bauhaus-blue opacity-20" />
      <div className="absolute top-1/2 right-0 w-8 h-[1px] bg-white/10" />
      <div className="absolute bottom-[10%] left-0 w-8 h-[1px] bg-white/10" />

      {/* ── Background Blobs (Legacy Atmosphere) ── */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] blob blob-emerald opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] blob blob-violet opacity-10 pointer-events-none" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-surface-base/80 border-b border-white/10">
        <div className="flex items-center justify-between px-6 h-20 max-w-7xl mx-auto w-full">
          <Link href="/profile" className="flex items-center gap-4 group">
            <Avatar className="h-12 w-12 border border-white/20 transition-transform group-hover:scale-105">
              <AvatarImage src={profile.avatarUrl} alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground font-black">
                {profile.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <span className="t-label">Account</span>
              <h1 className="text-lg font-black tracking-tight leading-none text-white/90 group-hover:text-primary transition-colors">
                {profile.name || 'User'}
              </h1>
            </div>
          </Link>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={isMobile ? 'bottom' : 'right'}
              className="bg-surface-raised border-white/10 text-foreground"
            >
              <SheetHeader className="mb-8">
                <SheetTitle className="t-h1 text-left">Explore</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map(item => (
                  <Link
                    href={item.href}
                    key={item.label}
                    onClick={() => setIsSheetOpen(false)}
                    className="p-6 bg-white/5 border border-white/5 hover:border-primary/50 transition-all group"
                  >
                    <item.icon className="h-8 w-8 mb-4 text-white/40 group-hover:text-primary transition-colors" />
                    <span className="t-label group-hover:opacity-100 transition-opacity">{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-auto pt-8 border-t border-white/10">
                <Button variant="destructive" className="w-full h-14 t-label opacity-100 tracking-widest bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white">
                  <LogOut className="mr-3 h-5 w-5" /> Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto z-10 px-6 py-10 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* ── Navigation (Structural Tab Bar) ── */}
      <footer className="sticky bottom-0 left-0 right-0 z-50 bg-surface-raised/80 backdrop-blur-2xl border-t border-white/10 pb-safe">
        <nav className="flex justify-around items-center h-20 max-w-md mx-auto px-4">
          {navItems.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1.5 px-6 group transition-all duration-300 ${active ? 'text-primary' : 'text-white/40 hover:text-white/70'}`}
              >
                <div className="relative">
                  <item.icon className={`h-6 w-6 transition-transform group-hover:scale-110 ${active ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                  {active && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(168,255,62,0.5)]" />
                  )}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] font-body transition-all ${active ? 'opacity-100' : 'opacity-40'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </footer>

      <FloatingActionButton />
    </div>
  );
}
