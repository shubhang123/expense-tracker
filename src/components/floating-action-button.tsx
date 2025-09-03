'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, QrCode, Pencil } from 'lucide-react';
import { Button } from './ui/button';

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const menuButtonClasses =
    "rounded-full bg-secondary text-secondary-foreground w-24 h-24 shadow-xl hover:scale-110 transition-transform";

  return (
    <>
      {/* Dark overlay - with fade animation */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
        aria-hidden="true"
      />

      {/* FAB + Menu */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center z-50">
        <div className="relative flex items-center justify-center">
          {/* Add Expense (top-left arc) */}
          <div
            className={`absolute ${
              isOpen
                ? "translate-x-[-130px] translate-y-[-130px] opacity-100"
                : "translate-x-0 translate-y-0 opacity-0"
            } transition-all duration-300 ease-out`}
          >
            <Link href="/add" passHref>
              <Button
                className={menuButtonClasses}
                size="icon"
                aria-label="Add Expense"
                onClick={toggleMenu}
              >
                <Pencil className="h-10 w-10" />
              </Button>
            </Link>
          </div>

          {/* Scan QR (top-right arc) */}
          <div
            className={`absolute ${
              isOpen
                ? "translate-x-[130px] translate-y-[-130px] opacity-100"
                : "translate-x-0 translate-y-0 opacity-0"
            } transition-all duration-300 ease-out`}
          >
            <Link href="/scan" passHref>
              <Button
                className={menuButtonClasses}
                size="icon"
                aria-label="Scan QR Code"
                onClick={toggleMenu}
              >
                <QrCode className="h-10 w-10" />
              </Button>
            </Link>
          </div>

          {/* Main FAB */}
          <Button
            className="rounded-full bg-primary w-20 h-20 shadow-2xl shadow-primary/40 relative hover:scale-110 transition-transform"
            size="icon"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label="Main Action Button"
          >
            <Plus
              className={`h-14 w-14 text-black transition-transform duration-300 ${
                isOpen ? "rotate-45" : "rotate-0"
              }`}
            />
          </Button>
        </div>
      </div>
    </>
  );
}
