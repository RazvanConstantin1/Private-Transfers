'use client';

import type { PriceBreakdown } from '@/lib/pricing';
import { formatEur, formatDuration } from '@/lib/utils';

interface PriceBreakdownCardProps {
  breakdown: PriceBreakdown;
  distanceKm: number;
  durationMinutes: number;
}

export default function PriceBreakdownCard({
  breakdown,
  distanceKm,
  durationMinutes,
}: PriceBreakdownCardProps) {
  const rows = [
    {
      label: 'Distance',
      value: `${distanceKm} km · ${formatDuration(durationMinutes)}`,
      highlight: false,
    },
    {
      label: `Base (€30 + €${breakdown.pricePerKm} × ${distanceKm})`,
      value: formatEur(breakdown.basePrice),
      highlight: false,
    },
    ...(breakdown.roundTripMultiplier > 1
      ? [{ label: `Round-trip ×${breakdown.roundTripMultiplier}`, value: `+${formatEur(breakdown.subtotal / breakdown.roundTripMultiplier * (breakdown.roundTripMultiplier - 1))}`, highlight: false }]
      : []),
    ...(breakdown.isLongDistance
      ? [{ label: `Long-distance ×${breakdown.longDistanceMultiplier}`, value: '+included', highlight: false }]
      : []),
    ...(breakdown.isPeakHour
      ? [{ label: 'Peak hour surcharge', value: `+${formatEur(breakdown.peakSurcharge)}`, highlight: false }]
      : []),
  ];

  return (
    <div
      className="rounded-xl border p-4 text-sm mt-4"
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-soft)' }}
    >
      <div className="space-y-2 mb-3">
        {rows.map((row, i) => (
          <div key={i} className="flex justify-between gap-4">
            <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{row.value}</span>
          </div>
        ))}
      </div>
      <div
        className="flex justify-between items-center pt-3 border-t font-600"
        style={{ borderColor: 'var(--border)' }}
      >
        <span style={{ color: 'var(--text-primary)' }}>TOTAL</span>
        <span
          className="font-display text-2xl font-400"
          style={{ color: 'var(--accent-gold)' }}
        >
          {formatEur(breakdown.total)}
        </span>
      </div>
      {breakdown.isPeakHour && (
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          ⚡ Peak hour surcharge applied
        </p>
      )}
    </div>
  );
}
