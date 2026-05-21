'use client';

import { useTranslations } from 'next-intl';

const pillars = [
  {
    key: 'electric',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    key: 'driver',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    key: 'pricing',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    key: 'onTime',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
] as const;

export default function WhyVoltlane() {
  const t = useTranslations('why');

  return (
    <section className="py-14 md:py-24 px-4 md:px-6" aria-labelledby="why-heading">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-16 text-center">
          <h2
            id="why-heading"
            className="font-display text-4xl md:text-5xl font-300 tracking-tight mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.key}
              className="rounded-2xl border p-6 md:p-8 flex flex-col gap-4"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div style={{ color: 'var(--accent-volt)' }}>{pillar.icon}</div>
              <h3
                className="font-display text-xl font-400"
                style={{ color: 'var(--text-primary)' }}
              >
                {t(`${pillar.key}.title`)}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t(`${pillar.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
