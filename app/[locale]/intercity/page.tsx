import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Intercity Transfers Romania — Bucharest to Brașov, Cluj, Sibiu & More',
  description: 'Private electric transfers from Bucharest to any Romanian city. Fixed prices, no surge. Brașov, Cluj-Napoca, Sibiu, Constanța, Iași and more.',
};

const ROUTES = [
  { slug: 'bucharest-brasov', name: 'Bucharest → Brașov', distance: '166 km', teslaPrice: '€196', konaPrice: '€166' },
  { slug: 'bucharest-sinaia', name: 'Bucharest → Sinaia', distance: '125 km', teslaPrice: '€155', konaPrice: '€130' },
  { slug: 'bucharest-sibiu', name: 'Bucharest → Sibiu', distance: '280 km', teslaPrice: '€465', konaPrice: '€390' },
  { slug: 'bucharest-constanta', name: 'Bucharest → Constanța', distance: '225 km', teslaPrice: '€255', konaPrice: '€210' },
  { slug: 'bucharest-cluj-napoca', name: 'Bucharest → Cluj-Napoca', distance: '460 km', teslaPrice: '€758', konaPrice: '€630' },
  { slug: 'bucharest-iasi', name: 'Bucharest → Iași', distance: '390 km', teslaPrice: '€630', konaPrice: '€528' },
];

export default async function IntercityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <h1
            className="font-display text-4xl md:text-6xl font-300 tracking-tight mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Intercity Routes
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Door-to-door private transfers from Bucharest. Fixed pricing, no surge, ever.
          </p>
        </div>

        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div
            className="grid grid-cols-[1fr_100px_120px_120px] gap-4 px-6 py-3 text-xs font-600 uppercase tracking-widest border-b"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
          >
            <span>Route</span>
            <span className="text-right">Distance</span>
            <span className="text-right">Tesla</span>
            <span className="text-right">Kona</span>
          </div>
          {ROUTES.map((r) => (
            <Link
              key={r.slug}
              href={`/${locale}/intercity/${r.slug}`}
              className="group grid grid-cols-[1fr_100px_120px_120px] gap-4 px-6 py-5 border-b transition-vl hover:bg-[var(--bg-card-hover)] last:border-0"
              style={{ borderColor: 'var(--border-soft)' }}
            >
              <span
                className="font-500 transition-vl group-hover:text-[var(--accent-volt)]"
                style={{ color: 'var(--text-primary)' }}
              >
                {r.name}
              </span>
              <span className="text-sm text-right" style={{ color: 'var(--text-muted)' }}>{r.distance}</span>
              <span className="font-display text-lg text-right" style={{ color: 'var(--accent-gold)' }}>{r.teslaPrice}</span>
              <span className="text-sm text-right" style={{ color: 'var(--text-secondary)' }}>{r.konaPrice}</span>
            </Link>
          ))}
        </div>

        <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
          Prices shown for off-peak, one-way. Peak hours (07–09, 16–20, 00–06) include +€20 surcharge. Distances over 250km include long-distance rate.
        </p>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/booking`}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-600 rounded-full transition-vl hover:opacity-90"
            style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
          >
            Book Your Route →
          </Link>
        </div>
      </div>
    </div>
  );
}
