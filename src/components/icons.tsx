import type { SVGProps } from 'react';

export function EmeraldLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
          <stop offset="100%" style={{ stopColor: 'hsl(151, 56%, 35%))' }} />
        </linearGradient>
      </defs>
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#emeraldGradient)" stroke="none" />
      <path d="M2 17l10 5 10-5" fill="url(#emeraldGradient)" stroke="none" />
      <path d="M2 12l10 5 10-5" fill="url(#emeraldGradient)" stroke="none" />
    </svg>
  );
}
