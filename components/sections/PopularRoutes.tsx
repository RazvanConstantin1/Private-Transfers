'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

type RouteKey = 'brasov' | 'sinaia' | 'sibiu' | 'constanta';
const ROUTE_SLUGS: Record<RouteKey, string> = {
  brasov: 'bucharest-brasov',
  sinaia: 'bucharest-sinaia',
  sibiu: 'bucharest-sibiu',
  constanta: 'bucharest-constanta',
};

export default function PopularRoutes() {
  const t = useTranslations('routes');
  const locale = useLocale();

  const routeKeys: RouteKey[] = ['brasov', 'sinaia', 'sibiu', 'constanta'];

  return (
    <section
      className="py-14 md:py-24 px-4 md:px-6"
      aria-labelledby="routes-heading"
      style={{ background: 'var(--bg-elevated)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2
              id="routes-heading"
              className="font-display text-4xl md:text-5xl font-300 tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('title')}
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              {t('subtitle')}
            </p>
          </div>
          <Link
            href={`/${locale}/intercity`}
            className="inline-flex items-center gap-2 text-sm font-600 transition-vl hover:gap-3 whitespace-nowrap"
            style={{ color: 'var(--accent-volt)' }}
          >
            {t('viewAll')} →
          </Link>
        </div>

        {/* Table header */}
        <div
          className="hidden md:grid grid-cols-[1fr_120px_120px_140px] gap-4 px-6 pb-3 text-xs font-600 uppercase tracking-widest border-b"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)', borderColor: 'var(--border-soft)' }}
        >
          <span>Route</span>
          <span className="text-right">Distance</span>
          <span className="text-right">Duration</span>
          <span className="text-right">{t('vehicle')}</span>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
          {routeKeys.map((key) => {
            const route = {
              name: t(`routes.${key}.name`),
              distance: t(`routes.${key}.distance`),
              duration: t(`routes.${key}.duration`),
              price: t(`routes.${key}.price`),
            };

            return (
              <Link
                key={key}
                href={`/${locale}/intercity/${ROUTE_SLUGS[key]}`}
                className="group flex flex-col md:grid md:grid-cols-[1fr_120px_120px_140px] gap-2 md:gap-4 px-6 py-5 transition-vl hover:bg-[var(--bg-card)]"
              >
                <span
                  className="font-500 text-base transition-vl group-hover:text-[var(--accent-volt)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {route.name}
                </span>
                <span
                  className="text-sm md:text-right"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {route.distance}
                </span>
                <span
                  className="text-sm md:text-right"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {route.duration}
                </span>
                <div className="md:text-right">
                  <span
                    className="font-display text-lg font-400"
                    style={{ color: 'var(--accent-gold)' }}
                  >
                    {route.price}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
