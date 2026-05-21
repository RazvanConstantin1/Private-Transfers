'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Logo from '@/components/shared/Logo';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const services = [
    { href: `/${locale}/airport-transfers`, label: t('airport') },
    { href: `/${locale}/intercity`, label: t('intercity') },
    { href: `/${locale}/hourly`, label: t('hourly') },
    { href: `/${locale}/fleet`, label: t('fleet') },
  ];

  const company = [
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contactPage') },
  ];

  const legal = [
    { href: `/${locale}/privacy`, label: t('privacy') },
    { href: `/${locale}/terms`, label: t('terms') },
  ];

  return (
    <footer
      className="border-t mt-24"
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-soft)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('tagline')}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3
              className="text-xs font-700 tracking-widest uppercase mb-4"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
            >
              {t('services')}
            </h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-sm transition-vl hover:text-[var(--accent-volt)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3
              className="text-xs font-700 tracking-widest uppercase mb-4"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
            >
              {t('company')}
            </h3>
            <ul className="space-y-3">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm transition-vl hover:text-[var(--accent-volt)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Legal */}
          <div>
            <h3
              className="text-xs font-700 tracking-widest uppercase mb-4"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
            >
              {t('contact')}
            </h3>
            <ul className="space-y-3 mb-8">
              <li>
                <a
                  href="https://wa.me/40700000000"
                  className="text-sm transition-vl hover:text-[var(--accent-volt)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@voltlane.com"
                  className="text-sm transition-vl hover:text-[var(--accent-volt)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  hello@voltlane.com
                </a>
              </li>
            </ul>

            <h3
              className="text-xs font-700 tracking-widest uppercase mb-4"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
            >
              {t('legal')}
            </h3>
            <ul className="space-y-3">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-vl hover:text-[var(--accent-volt)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('copyright')}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('madeWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}
