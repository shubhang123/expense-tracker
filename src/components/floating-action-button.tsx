'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, QrCode, Pencil } from 'lucide-react';
import { Button } from './ui/button';

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Dark overlay */}
      <div
        className={`fixed inset-0 bg-background/90 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={toggleMenu}
        aria-hidden="true"
      />

      {/* FAB + Menu */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center justify-center z-50">
        <div className="relative flex items-center justify-center">
          {/* Add Expense (top-left arc) */}
          <div
            className={`absolute ${isOpen
              ? 'translate-x-[-100px] translate-y-[-100px] opacity-100'
              : 'translate-x-0 translate-y-0 opacity-0'
              } transition-all duration-300 ease-out`}
          >
            <Link href="/add" passHref>
              <Button
                className="rounded-full bg-card text-foreground border-2 border-foreground w-14 h-14 shadow-bauhaus-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-secondary transition-all"
                size="icon"
                aria-label="Add Expense"
                onClick={toggleMenu}
              >
                <Pencil className="h-5 w-5 text-primary" />
              </Button>
            </Link>
            <span className="block text-center text-[10px] font-headline font-bold uppercase tracking-widest mt-2 text-foreground">
              Add
            </span>
          </div>

          {/* Scan QR (top-right arc) */}
          <div
            className={`absolute ${isOpen
              ? 'translate-x-[100px] translate-y-[-100px] opacity-100'
              : 'translate-x-0 translate-y-0 opacity-0'
              } transition-all duration-300 ease-out`}
          >
            <Link href="/scan" passHref>
              <Button
                className="rounded-full bg-card text-foreground border-2 border-foreground w-14 h-14 shadow-bauhaus-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-secondary transition-all"
                size="icon"
                aria-label="Scan QR Code"
                onClick={toggleMenu}
              >
                <QrCode className="h-5 w-5 text-primary" />
              </Button>
            </Link>
            <span className="block text-center text-[10px] font-headline font-bold uppercase tracking-widest mt-2 text-foreground">
              Scan
            </span>
          </div>

          {/* Main FAB */}
          <Button
            className={`rounded-full border-2 border-foreground shadow-bauhaus w-16 h-16 transition-all duration-300 z-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${isOpen ? 'bg-secondary text-foreground rotate-45' : 'bg-primary text-primary-foreground'}`}
            size="icon"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label="Quick Actions"
          >
            <Plus
              className={`h-7 w-7 transition-transform duration-300`}
            />
          </Button>
        </div>
      </div>
    </>
  );
}
