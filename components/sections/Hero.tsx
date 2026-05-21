'use client';

import { useTranslations } from 'next-intl';
import BookingWidget from '@/components/booking/BookingWidget';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      className="relative min-h-screen flex items-center pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-6"
      aria-label="Hero"
    >
      {/* Atmospheric gradient orbs */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 85% 10%, rgba(126,255,161,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 15% 90%, rgba(229,198,135,0.05) 0%, transparent 60%)
          `,
        }}
      />

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-10 lg:gap-16 items-center">

          {/* Left: brand text */}
          <div>
            {/* Eyebrow badge */}
            <div className="mb-7">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-600 tracking-widest uppercase border"
                style={{
                  background: 'var(--accent-volt-dim)',
                  borderColor: 'rgba(126,255,161,0.25)',
                  color: 'var(--accent-volt)',
                  fontFamily: 'var(--font-jetbrains)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: 'var(--accent-volt)' }}
                />
                {t('eyebrow')}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-300 leading-[1.05] tracking-tight mb-5 md:mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('headline')}{' '}
              <em className="not-italic font-400" style={{ color: 'var(--accent-volt)' }}>
                {t('headlineAccent')}
              </em>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg font-400 mb-10 max-w-lg leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('subtitle')}
            </p>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {[
                { icon: '⚡', label: t('trust.electric') },
                { icon: '🛞', label: t('trust.englishDriver') },
                { icon: '🔒', label: t('trust.fixedPrice') },
                { icon: '🕐', label: t('trust.available') },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span aria-hidden>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: booking widget */}
          <div className="w-full">
            <BookingWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
