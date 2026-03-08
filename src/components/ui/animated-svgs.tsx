'use client';

import { motion } from 'framer-motion';

export function BrutalistStar({ className = "" }: { className?: string }) {
    return (
        <motion.svg
            viewBox="0 0 100 100"
            className={`w-12 h-12 text-primary ${className}`}
            fill="currentColor"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
            <polygon points="50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40" />
        </motion.svg>
    );
}

export function BauhausCirclePair({ className = "" }: { className?: string }) {
    return (
        <div className={`relative w-16 h-16 ${className}`}>
            <motion.div
                className="absolute inset-0 bg-primary geo-circle mix-blend-multiply dark:mix-blend-screen"
                animate={{ x: [-5, 5, -5], y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute inset-0 bg-accent geo-circle mix-blend-multiply dark:mix-blend-screen"
                animate={{ x: [5, -5, 5], y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}

export function GridLinesBg() {
    return (
        <div className="absolute inset-0 pointer-events-none z-[-1] opacity-20"
            style={{
                backgroundImage: `
          linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
        `,
                backgroundSize: '40px 40px'
            }}
        />
    );
}
