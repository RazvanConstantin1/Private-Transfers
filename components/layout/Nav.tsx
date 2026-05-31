'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Logo from '@/components/shared/Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { cn } from '@/lib/utils';

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { href: `/${locale}/airport-transfers`, label: t('services') },
    { href: `/${locale}/fleet`, label: t('fleet') },
    { href: `/${locale}/intercity`, label: t('routes') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-vl',
        scrolled
          ? 'border-b'
          : ''
      )}
      style={{
        background: scrolled ? 'rgba(10,10,11,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderColor: scrolled ? 'var(--border-soft)' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-500 transition-vl',
                pathname === link.href
                  ? 'text-[var(--accent-volt)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href={`/${locale}/booking`}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-600 rounded-full transition-vl hover:opacity-90"
            style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
          >
            {t('bookNow')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={cn('block w-6 h-0.5 transition-vl', menuOpen ? 'rotate-45 translate-y-2' : '')}
            style={{ background: 'var(--text-primary)' }}
          />
          <span
            className={cn('block w-6 h-0.5 transition-vl', menuOpen ? 'opacity-0' : '')}
            style={{ background: 'var(--text-primary)' }}
          />
          <span
            className={cn('block w-6 h-0.5 transition-vl', menuOpen ? '-rotate-45 -translate-y-2' : '')}
            style={{ background: 'var(--text-primary)' }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-6 py-6 flex flex-col gap-4"
          style={{ background: 'rgba(10,10,11,0.97)', borderColor: 'var(--border-soft)' }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-base font-500 py-1 transition-vl text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border-soft)' }}>
            <LanguageSwitcher />
            <Link
              href={`/${locale}/booking`}
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center px-6 py-2.5 text-sm font-600 rounded-full transition-vl hover:opacity-90"
              style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
            >
              {t('bookNow')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
