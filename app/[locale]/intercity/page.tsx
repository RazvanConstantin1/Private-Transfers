import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo/schemas';
import { SITE } from '@/lib/seo/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ pageKey: 'intercity', locale, path: '/intercity' });
}

const ROUTES = [
  { slug: 'bucharest-brasov', en: 'Bucharest → Brașov', ro: 'București → Brașov', distance: '166 km', duration: '2h 30min', teslaPrice: '€196', konaPrice: '€166' },
  { slug: 'bucharest-sinaia', en: 'Bucharest → Sinaia', ro: 'București → Sinaia', distance: '125 km', duration: '1h 45min', teslaPrice: '€155', konaPrice: '€130' },
  { slug: 'bucharest-bran-castle', en: 'Bucharest → Bran Castle', ro: 'București → Castelul Bran', distance: '175 km', duration: '2h 45min', teslaPrice: '€205', konaPrice: '€170' },
  { slug: 'bucharest-sibiu', en: 'Bucharest → Sibiu', ro: 'București → Sibiu', distance: '280 km', duration: '3h 15min', teslaPrice: '€465', konaPrice: '€390' },
  { slug: 'bucharest-constanta', en: 'Bucharest → Constanța', ro: 'București → Constanța', distance: '225 km', duration: '2h 30min', teslaPrice: '€255', konaPrice: '€210' },
  { slug: 'bucharest-cluj-napoca', en: 'Bucharest → Cluj-Napoca', ro: 'București → Cluj-Napoca', distance: '460 km', duration: '5h 30min', teslaPrice: '€758', konaPrice: '€630' },
  { slug: 'bucharest-iasi', en: 'Bucharest → Iași', ro: 'București → Iași', distance: '390 km', duration: '5h 10min', teslaPrice: '€630', konaPrice: '€528' },
];

export default async function IntercityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRo = locale === 'ro';

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: isRo ? 'Acasă' : 'Home', url: `${SITE.url}/${locale}` },
          { name: isRo ? 'Curse Intercity' : 'Intercity Routes', url: `${SITE.url}/${locale}/intercity` },
        ])}
      />
      <div className="min-h-screen pt-24 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h1
              className="font-display text-4xl md:text-6xl font-300 tracking-tight mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {isRo ? 'Curse Intercity' : 'Intercity Routes'}
            </h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              {isRo
                ? 'Transferuri private door-to-door din București. Prețuri fixe, fără surge, niciodată.'
                : 'Door-to-door private transfers from Bucharest. Fixed pricing, no surge, ever.'}
            </p>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div
              className="grid grid-cols-[1fr_90px_80px_120px_120px] gap-4 px-6 py-3 text-xs font-600 uppercase tracking-widest border-b"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
            >
              <span>{isRo ? 'Rută' : 'Route'}</span>
              <span className="text-right">{isRo ? 'Distanță' : 'Distance'}</span>
              <span className="text-right">{isRo ? 'Durată' : 'Duration'}</span>
              <span className="text-right">Tesla</span>
              <span className="text-right">Kona</span>
            </div>
            {ROUTES.map((r) => (
              <Link
                key={r.slug}
                href={`/${locale}/intercity/${r.slug}`}
                className="group grid grid-cols-[1fr_90px_80px_120px_120px] gap-4 px-6 py-5 border-b transition-vl hover:bg-[var(--bg-card-hover)] last:border-0"
                style={{ borderColor: 'var(--border-soft)' }}
              >
                <span
                  className="font-500 transition-vl group-hover:text-[var(--accent-volt)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {isRo ? r.ro : r.en}
                </span>
                <span className="text-sm text-right" style={{ color: 'var(--text-muted)' }}>{r.distance}</span>
                <span className="text-sm text-right" style={{ color: 'var(--text-muted)' }}>{r.duration}</span>
                <span className="font-display text-lg text-right" style={{ color: 'var(--accent-gold)' }}>{r.teslaPrice}</span>
                <span className="text-sm text-right" style={{ color: 'var(--text-secondary)' }}>{r.konaPrice}</span>
              </Link>
            ))}
          </div>

          <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            {isRo
              ? 'Prețuri afișate sunt pentru sens unic, în afara orelor de vârf. Orele de vârf (07–09, 16–20, 00–06) includ suprataxă €20. Distanțe peste 250 km includ tarif long-distance.'
              : 'Prices shown for off-peak, one-way. Peak hours (07–09, 16–20, 00–06) include +€20 surcharge. Distances over 250 km include long-distance rate.'}
          </p>

          <div className="mt-12 text-center">
            <Link
              href={`/${locale}/booking`}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-600 rounded-full transition-vl hover:opacity-90"
              style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
            >
              {isRo ? 'Rezervă Ruta Ta →' : 'Book Your Route →'}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
