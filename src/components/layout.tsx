import Link from 'next/link';
import { Home, Bell, Plus, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="flex items-center justify-between p-4">
        <Avatar>
          <AvatarImage src="https://picsum.photos/100/100" alt="User" data-ai-hint="person avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </header>
      
      <main className="flex-1 overflow-y-auto px-4">{children}</main>

      <footer className="sticky bottom-0 left-0 right-0 bg-black">
        <div className="flex justify-around items-center p-4 max-w-md mx-auto relative">
          <Link href="/" className="p-2">
            <Home className="h-7 w-7 text-muted-foreground" />
          </Link>
          <Link href="/add" className="absolute -top-6">
            <div className="bg-primary rounded-full p-4 shadow-lg shadow-primary/30">
              <Plus className="h-8 w-8 text-black" />
            </div>
          </Link>
          <Link href="#" className="p-2">
            <Bell className="h-7 w-7 text-muted-foreground" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
