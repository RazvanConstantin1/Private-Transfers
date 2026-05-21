'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { FLEET } from '@/lib/fleet';

export default function FleetShowcase() {
  const t = useTranslations('fleet');
  const locale = useLocale();

  return (
    <section
      className="py-14 md:py-24 px-4 md:px-6"
      aria-labelledby="fleet-heading"
      style={{ background: 'var(--bg-elevated)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-16 text-center">
          <h2
            id="fleet-heading"
            className="font-display text-4xl md:text-5xl font-300 tracking-tight mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}{' '}
            <em
              className="not-italic"
              style={{ color: 'var(--accent-gold)' }}
            >
              {t('titleAccent')}
            </em>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FLEET.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group rounded-2xl border overflow-hidden transition-vl hover:border-[var(--accent-volt)]"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              {/* Vehicle photo */}
              <div className="aspect-[4/3] relative overflow-hidden bg-[var(--bg-elevated)]">
                <Image
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  fill
                  className="object-cover transition-vl group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-6">
                <h3
                  className="font-display text-xl font-400 mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {vehicle.name}
                </h3>
                <p
                  className="text-xs tracking-widest uppercase mb-4"
                  style={{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                >
                  {vehicle.tagline[locale === 'ro' ? 'ro' : 'en']}
                </p>

                {/* Capacity */}
                <div className="flex items-center gap-4 mb-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {vehicle.maxPassengers} {t('passengers')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    {vehicle.maxLuggage} {t('luggage')}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className="text-xs uppercase tracking-widest"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
                    >
                      {t('from')}{' '}
                    </span>
                    <span
                      className="font-display text-2xl font-400"
                      style={{ color: 'var(--accent-gold)' }}
                    >
                      €{vehicle.pricePerKm}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {t('perKm')}
                    </span>
                  </div>
                  <Link
                    href={`/${locale}/booking`}
                    className="px-5 py-2 text-sm font-600 rounded-full border transition-vl hover:bg-[var(--accent-volt-dim)] hover:border-[var(--accent-volt)] hover:text-[var(--accent-volt)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  >
                    {t('selectVehicle')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
