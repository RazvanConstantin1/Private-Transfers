'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: string) {
    // Replace the current locale segment in the pathname
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'ro') {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join('/') || '/');
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-full border p-1',
        className
      )}
      style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
    >
      {(['en', 'ro'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => switchLocale(lang)}
          className={cn(
            'px-3 py-1 text-sm font-600 rounded-full transition-vl cursor-pointer',
            locale === lang
              ? 'text-[#0A0A0B]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          )}
          style={locale === lang ? { background: 'var(--accent-volt)' } : undefined}
          aria-label={`Switch to ${lang.toUpperCase()}`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
