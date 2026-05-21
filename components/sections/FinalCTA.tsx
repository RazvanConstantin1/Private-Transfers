'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function FinalCTA() {
  const t = useTranslations('cta');
  const locale = useLocale();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '40700000000';

  return (
    <section
      className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 50%, rgba(126,255,161,0.06) 0%, transparent 70%)
          `,
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <h2
          id="cta-heading"
          className="font-display text-4xl md:text-6xl font-300 tracking-tight mb-6 leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('headline')}{' '}
          <em className="not-italic" style={{ color: 'var(--accent-volt)' }}>
            {t('headlineAccent')}
          </em>{' '}
          {t('headlineEnd')}
        </h2>
        <p
          className="text-lg mb-12 max-w-2xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/booking`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-600 rounded-full transition-vl hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
          >
            {t('button')}
          </Link>
          <a
            href={`https://wa.me/${whatsapp.replace(/^\+/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-600 rounded-full border transition-vl hover:border-[var(--accent-volt)] hover:text-[var(--accent-volt)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            {t('whatsapp')}
          </a>
        </div>
      </div>
    </section>
  );
}
