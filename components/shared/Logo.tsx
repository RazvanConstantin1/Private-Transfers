'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  return (
    <Link
      href={`/${locale}`}
      className={cn('flex items-center gap-2 group select-none', className)}
      aria-label="VOLTLANE home"
    >
      <span
        className="text-xl font-display font-700 tracking-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        VOLT
        <span
          className="inline-flex items-center justify-center w-[6px] h-[6px] rounded-full mx-[2px] align-middle animate-pulse"
          style={{ background: 'var(--accent-volt)', boxShadow: '0 0 8px var(--accent-volt)' }}
          aria-hidden
        />
        LANE
      </span>
    </Link>
  );
}
