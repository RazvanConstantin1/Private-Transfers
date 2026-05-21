'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { FLEET, type VehicleId } from '@/lib/fleet';
import type { PriceBreakdown } from '@/lib/pricing';
import { formatEur } from '@/lib/utils';
import PriceBreakdownCard from './PriceBreakdownCard';
import { cn } from '@/lib/utils';

interface VehicleSelectorProps {
  prices: Record<VehicleId, PriceBreakdown> | null;
  selectedId: VehicleId | null;
  onSelect: (id: VehicleId) => void;
  loading: boolean;
  distanceKm?: number;
  durationMinutes?: number;
}

export default function VehicleSelector({
  prices,
  selectedId,
  onSelect,
  loading,
  distanceKm,
  durationMinutes,
}: VehicleSelectorProps) {
  const t = useTranslations('fleet');
  const locale = useLocale();

  return (
    <div className="space-y-4">
      {FLEET.map((vehicle, index) => {
        const isSelected = selectedId === vehicle.id;
        const breakdown = prices?.[vehicle.id];

        return (
          <div
            key={vehicle.id}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onClick={() => onSelect(vehicle.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(vehicle.id)}
            className={cn(
              'rounded-2xl border cursor-pointer transition-vl overflow-hidden',
              isSelected ? 'volt-glow' : 'hover:border-[var(--border-soft)] hover:bg-[var(--bg-card-hover)]'
            )}
            style={{
              background: 'var(--bg-card)',
              borderColor: isSelected ? 'var(--accent-volt)' : 'var(--border)',
            }}
          >
            {/* Vehicle photo */}
            <div className="aspect-[4/3] relative overflow-hidden bg-[var(--bg-elevated)]">
              <Image
                src={vehicle.imageUrl}
                alt={vehicle.name}
                fill
                className="object-cover"
                priority={index === 1}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3
                  className="font-display text-lg font-400"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {vehicle.name}
                </h3>
                {/* Live price */}
                <div className="text-right flex-shrink-0">
                  {loading ? (
                    <div
                      className="h-7 w-16 rounded shimmer"
                      aria-label="Calculating price..."
                    />
                  ) : breakdown ? (
                    <span
                      className="font-display text-2xl font-400"
                      style={{
                        color: 'var(--accent-gold)',
                        animation: 'fadeIn 0.2s ease forwards',
                        animationDelay: `${index * 200}ms`,
                        opacity: 0,
                      }}
                    >
                      {formatEur(breakdown.total)}
                    </span>
                  ) : (
                    <span
                      className="font-display text-lg"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      €{vehicle.pricePerKm}/km
                    </span>
                  )}
                </div>
              </div>

              <p
                className="text-xs tracking-widest uppercase mb-3"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
              >
                {vehicle.tagline[locale === 'ro' ? 'ro' : 'en']}
              </p>

              {/* Capacity */}
              <div
                className="flex items-center gap-4 text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {vehicle.maxPassengers}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  {vehicle.maxLuggage}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  {vehicle.rangeKm} km
                </span>
              </div>

              {/* Expanded: features + breakdown */}
              {isSelected && breakdown && distanceKm && durationMinutes && (
                <div className="mt-4">
                  <ul className="flex flex-wrap gap-2 mb-4">
                    {vehicle.features[locale === 'ro' ? 'ro' : 'en'].map((f) => (
                      <li
                        key={f}
                        className="text-xs px-3 py-1 rounded-full border"
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--text-secondary)',
                          background: 'var(--bg-elevated)',
                        }}
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                  <PriceBreakdownCard
                    breakdown={breakdown}
                    distanceKm={distanceKm}
                    durationMinutes={durationMinutes}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
