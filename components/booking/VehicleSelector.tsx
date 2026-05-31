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
    <div className="space-y-2">
      {FLEET.map((vehicle, index) => {
        const isSelected = selectedId === vehicle.id;
        const breakdown = prices?.[vehicle.id];
        const isPopular = vehicle.id === 'tesla_model_3';

        return (
          <div
            key={vehicle.id}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onClick={() => onSelect(vehicle.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(vehicle.id)}
            className={cn(
              'rounded-xl border cursor-pointer transition-vl overflow-hidden',
              isSelected
                ? 'volt-glow'
                : 'hover:border-[var(--border-soft)] hover:bg-[var(--bg-card-hover)]'
            )}
            style={{
              background: 'var(--bg-card)',
              borderColor: isSelected ? 'var(--accent-volt)' : 'var(--border)',
            }}
          >
            {/* Main row */}
            <div className="flex items-center gap-4 p-3">

              {/* Selection indicator */}
              <div
                className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-vl"
                style={{
                  borderColor: isSelected ? 'var(--accent-volt)' : 'var(--border)',
                  background: isSelected ? 'var(--accent-volt)' : 'transparent',
                }}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#0A0A0B]" />
                )}
              </div>

              {/* Thumbnail */}
              <div className="relative shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-[var(--bg-elevated)]">
                <Image
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                  priority={index === 1}
                />
              </div>

              {/* Name + specs */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-500 text-sm truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {vehicle.name}
                  </span>
                  {isPopular && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-600 shrink-0"
                      style={{
                        background: 'var(--accent-volt-dim)',
                        color: 'var(--accent-volt)',
                        fontFamily: 'var(--font-jetbrains)',
                      }}
                    >
                      Popular
                    </span>
                  )}
                </div>
                <div
                  className="flex items-center gap-3 mt-1 text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span className="flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {vehicle.maxPassengers}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    {vehicle.maxLuggage}
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    {vehicle.rangeKm} km
                  </span>
                </div>
              </div>

              {/* Price — right-aligned */}
              <div className="shrink-0 text-right">
                {loading ? (
                  <div className="h-6 w-14 rounded shimmer" aria-label="Calculating…" />
                ) : breakdown ? (
                  <span
                    className="font-display text-xl font-400"
                    style={{
                      color: 'var(--accent-gold)',
                      animation: 'fadeIn 0.2s ease forwards',
                      animationDelay: `${index * 150}ms`,
                      opacity: 0,
                    }}
                  >
                    {formatEur(breakdown.total)}
                  </span>
                ) : (
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    €{vehicle.pricePerKm}/km
                  </span>
                )}
              </div>
            </div>

            {/* Expanded: features + price breakdown */}
            {isSelected && (
              <div
                className="px-3 pb-3 border-t"
                style={{ borderColor: 'var(--border-soft)' }}
              >
                <ul className="flex flex-wrap gap-1.5 pt-3 mb-3">
                  {vehicle.features[locale === 'ro' ? 'ro' : 'en'].map((f) => (
                    <li
                      key={f}
                      className="text-xs px-2.5 py-1 rounded-full border"
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
                {breakdown && distanceKm && durationMinutes && (
                  <PriceBreakdownCard
                    breakdown={breakdown}
                    distanceKm={distanceKm}
                    durationMinutes={durationMinutes}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(3px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </div>
  );
}
