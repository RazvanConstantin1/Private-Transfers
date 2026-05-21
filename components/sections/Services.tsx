'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

const icons = {
  airport: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  intercity: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  hourly: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

export default function Services() {
  const t = useTranslations('services');
  const locale = useLocale();

  const cards = [
    {
      key: 'airport',
      href: `/${locale}/airport-transfers`,
      icon: icons.airport,
      title: t('airport.title'),
      description: t('airport.description'),
      from: t('airport.from'),
    },
    {
      key: 'intercity',
      href: `/${locale}/intercity`,
      icon: icons.intercity,
      title: t('intercity.title'),
      description: t('intercity.description'),
      from: t('intercity.from'),
    },
    {
      key: 'hourly',
      href: `/${locale}/hourly`,
      icon: icons.hourly,
      title: t('hourly.title'),
      description: t('hourly.description'),
      from: t('hourly.from'),
    },
  ];

  return (
    <section className="py-14 md:py-24 px-4 md:px-6" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-16 text-center">
          <h2
            id="services-heading"
            className="font-display text-4xl md:text-5xl font-300 tracking-tight mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <Link
              key={card.key}
              href={card.href}
              className="group flex flex-col rounded-2xl border p-6 md:p-8 transition-vl hover:border-[var(--accent-volt)] hover:bg-[var(--bg-card-hover)]"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-vl group-hover:bg-[var(--accent-volt-dim)]"
                style={{
                  background: 'var(--bg-elevated)',
                  color: 'var(--accent-volt)',
                }}
              >
                {card.icon}
              </div>

              {/* Content */}
              <h3
                className="font-display text-xl font-400 mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {card.title}
              </h3>
              <p
                className="text-sm leading-relaxed flex-1 mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                {card.description}
              </p>

              {/* From price */}
              <div className="flex items-center justify-between">
                <span
                  className="font-display text-lg font-400"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  {card.from}
                </span>
                <span
                  className="text-sm transition-vl group-hover:text-[var(--accent-volt)] group-hover:translate-x-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
