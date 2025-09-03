
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, QrCode, Pencil } from 'lucide-react';
import { Button } from './ui/button';

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={toggleMenu}
        ></div>
      )}
      <div className="relative z-50 flex flex-col items-center">
        <div
          className={`transition-all duration-300 ease-in-out flex flex-col items-center space-y-3 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          style={{ marginBottom: isOpen ? '1rem' : '-1rem' }}
        >
          <Link href="/scan" passHref>
            <Button
              className="rounded-full bg-secondary text-secondary-foreground w-14 h-14"
              size="icon"
              aria-label="Scan QR Code"
              onClick={toggleMenu}
            >
              <QrCode className="h-6 w-6" />
            </Button>
          </Link>
          <Link href="/add" passHref>
            <Button
              className="rounded-full bg-secondary text-secondary-foreground w-14 h-14"
              size="icon"
              aria-label="Add Expense"
              onClick={toggleMenu}
            >
              <Pencil className="h-6 w-6" />
            </Button>
          </Link>
        </div>
        
        <Button
          className="rounded-full bg-primary w-20 h-20 shadow-lg shadow-primary/30 relative mt-[-2.5rem]"
          size="icon"
          onClick={toggleMenu}
          aria-expanded={isOpen}
        >
          <Plus className={`h-10 w-10 text-black transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
        </Button>
      </div>
    </div>
  );
}
