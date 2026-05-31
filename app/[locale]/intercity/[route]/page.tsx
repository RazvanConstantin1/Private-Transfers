import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRoute, getAllRouteSlugs } from '@/lib/content/routes';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  breadcrumbSchema,
  routeServiceSchema,
  faqSchema,
} from '@/lib/seo/schemas';
import { SITE } from '@/lib/seo/config';

interface RouteParams {
  locale: string;
  route: string;
}

export async function generateStaticParams() {
  const slugs = getAllRouteSlugs();
  return ['en', 'ro'].flatMap((locale) =>
    slugs.map((route) => ({ locale, route }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { route, locale } = await params;
  const data = getRoute(route, locale);
  if (!data) return {};
  const { frontmatter: fm } = data;
  return generatePageMetadata({
    pageKey: 'intercity',
    locale,
    path: `/intercity/${route}`,
    override: {
      title: fm.metaTitle,
      description: fm.metaDescription,
      keywords: fm.keywords,
    },
  });
}

function renderMarkdown(content: string): string {
  return content
    .replace(
      /^## (.+)$/gm,
      '<h2 class="font-display text-2xl font-400 mb-4 mt-12" style="color:var(--text-primary)">$1</h2>'
    )
    .replace(
      /^### (.+)$/gm,
      '<h3 class="font-600 text-lg mb-3 mt-8" style="color:var(--text-primary)">$1</h3>'
    )
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong style="color:var(--text-primary)">$1</strong>'
    )
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(
      /^- (.+)$/gm,
      '<li class="mb-2 pl-2">$1</li>'
    )
    .replace(
      /(<li.*<\/li>\n?)+/g,
      (m) =>
        `<ul class="list-disc pl-6 mb-4 space-y-1" style="color:var(--text-secondary)">${m}</ul>`
    )
    .replace(/^\|(.+)\|$/gm, (line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());
      return `<tr>${cells
        .map(
          (c) =>
            `<td class="px-4 py-2 text-sm border-b" style="border-color:var(--border-soft);color:var(--text-secondary)">${c}</td>`
        )
        .join('')}</tr>`;
    })
    .replace(
      /(<tr>[\s\S]*?<\/tr>\n?)+/g,
      (m) =>
        `<div class="overflow-x-auto mb-6"><table class="w-full border-collapse rounded-xl overflow-hidden" style="border:1px solid var(--border)">${m}</table></div>`
    )
    .replace(
      /^(?!<[h|u|l|t|d]|$)(.+)$/gm,
      '<p class="mb-4 leading-relaxed" style="color:var(--text-secondary)">$1</p>'
    );
}

const ALL_ROUTES = [
  { slug: 'bucharest-brasov', en: 'Bucharest → Brașov', ro: 'București → Brașov', priceKona: 166, priceTesla: 196 },
  { slug: 'bucharest-sinaia', en: 'Bucharest → Sinaia', ro: 'București → Sinaia', priceKona: 130, priceTesla: 155 },
  { slug: 'bucharest-bran-castle', en: 'Bucharest → Bran Castle', ro: 'București → Castelul Bran', priceKona: 170, priceTesla: 205 },
  { slug: 'bucharest-sibiu', en: 'Bucharest → Sibiu', ro: 'București → Sibiu', priceKona: 390, priceTesla: 465 },
  { slug: 'bucharest-constanta', en: 'Bucharest → Constanța', ro: 'București → Constanța', priceKona: 210, priceTesla: 255 },
  { slug: 'bucharest-cluj-napoca', en: 'Bucharest → Cluj-Napoca', ro: 'București → Cluj-Napoca', priceKona: 630, priceTesla: 758 },
  { slug: 'bucharest-iasi', en: 'Bucharest → Iași', ro: 'București → Iași', priceKona: 528, priceTesla: 630 },
];

export default async function RoutePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { route, locale } = await params;
  const data = getRoute(route, locale);
  if (!data) notFound();

  const { frontmatter: fm, content } = data;
  const html = renderMarkdown(content);
  const isRo = locale === 'ro';

  const pageUrl = `${SITE.url}/${locale}/intercity/${route}`;
  const relatedRoutes = ALL_ROUTES.filter(
    (r) => r.slug !== route && (fm.relatedRoutes ?? []).includes(r.slug)
  ).slice(0, 4);

  const schemas = [
    breadcrumbSchema([
      { name: isRo ? 'Acasă' : 'Home', url: `${SITE.url}/${locale}` },
      {
        name: isRo ? 'Curse Intercity' : 'Intercity Routes',
        url: `${SITE.url}/${locale}/intercity`,
      },
      {
        name: `${fm.fromCity} → ${fm.toCity}`,
        url: pageUrl,
      },
    ]),
    routeServiceSchema({
      fromCity: fm.fromCity,
      toCity: fm.toCity,
      distanceKm: fm.distanceKm,
      durationMinutes: fm.durationMinutes,
      priceFromEur: fm.priceKona,
      description: fm.metaDescription,
      url: pageUrl,
    }),
    ...(fm.faq?.length ? [faqSchema(fm.faq)] : []),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="min-h-screen pt-24 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm mb-8 flex-wrap"
            style={{ color: 'var(--text-muted)' }}
          >
            <Link href={`/${locale}`} className="hover:text-[var(--text-secondary)] transition-vl">
              {isRo ? 'Acasă' : 'Home'}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/intercity`} className="hover:text-[var(--text-secondary)] transition-vl">
              {isRo ? 'Curse Intercity' : 'Intercity'}
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {fm.fromCity} → {fm.toCity}
            </span>
          </nav>

          {/* Hero */}
          <div className="mb-10">
            <h1
              className="font-display text-4xl md:text-5xl font-300 tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {isRo
                ? `Transfer Privat ${fm.fromCity} → ${fm.toCity}`
                : `Private Transfer from ${fm.fromCity} to ${fm.toCity}`}
            </h1>
            <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
              {isRo
                ? `Door-to-door în ${fm.durationLabel} · De la €${fm.priceKona}`
                : `Door-to-door in ${fm.durationLabel} · From €${fm.priceKona}`}
            </p>

            {/* Quick facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: isRo ? 'Distanță' : 'Distance', value: `${fm.distanceKm} km` },
                { label: isRo ? 'Durată' : 'Duration', value: fm.durationLabel },
                { label: isRo ? 'De la' : 'From', value: `€${fm.priceKona}` },
                { label: isRo ? 'Vehicule' : 'Vehicles', value: '3 EV' },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl border p-4 text-center"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  <p className="font-display text-2xl font-300 mb-1" style={{ color: 'var(--accent-gold)' }}>
                    {fact.value}
                  </p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
                    {fact.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {(isRo
                ? ['⚡ 100% Electric', '🔒 Preț Fix', '🇬🇧 Șofer EN/RO', '✈️ Tracking zbor', '📍 Door-to-door']
                : ['⚡ 100% Electric', '🔒 Fixed Price', '🇬🇧 English Driver', '✈️ Flight Tracking', '📍 Door-to-door']
              ).map((b) => (
                <span
                  key={b}
                  className="text-xs px-3 py-1.5 rounded-full border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  {b}
                </span>
              ))}
            </div>

            <Link
              href={`/${locale}/booking?from=Bucharest&to=${encodeURIComponent(fm.toCity)}`}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-600 rounded-full transition-vl hover:opacity-90"
              style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
            >
              {isRo ? `Rezervă Transfer spre ${fm.toCity} →` : `Book ${fm.toCity} Transfer →`}
            </Link>
          </div>

          {/* Narrative content from markdown */}
          <article className="prose-voltlane mb-16">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>

          {/* Vehicle pricing */}
          <section className="mb-16">
            <h2
              className="font-display text-2xl font-400 mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {isRo
                ? `Alege Vehiculul tău pentru ${fm.fromCity} → ${fm.toCity}`
                : `Choose Your Vehicle for ${fm.fromCity} → ${fm.toCity}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  id: 'kona',
                  name: 'Hyundai Kona Electric',
                  tag: isRo ? 'Eficient' : 'Efficient',
                  price: fm.priceKona,
                  passengers: 4,
                  luggage: 2,
                  features: isRo
                    ? ['Climatizare', 'USB-C', 'Apă plată', 'Cabină silențioasă']
                    : ['Climate control', 'USB-C charging', 'Still water', 'Quiet cabin'],
                },
                {
                  id: 'tesla',
                  name: 'Tesla Model 3 LR',
                  tag: 'Signature',
                  price: fm.priceTesla,
                  passengers: 4,
                  luggage: 3,
                  features: isRo
                    ? ['Interior premium', 'WiFi la bord', 'Plafon de sticlă', 'Apă plată']
                    : ['Premium interior', 'WiFi onboard', 'Glass roof', 'Still water'],
                  highlighted: true,
                },
                {
                  id: 'capri',
                  name: 'Ford Capri SUV',
                  tag: isRo ? 'Spațios' : 'Spacious',
                  price: fm.priceCapri,
                  passengers: 4,
                  luggage: 4,
                  features: isRo
                    ? ['SUV premium', 'Spațiu extra', 'WiFi la bord', 'Apă plată']
                    : ['Premium SUV', 'Extra legroom', 'WiFi onboard', 'Still water'],
                },
              ].map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl border p-6 flex flex-col"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: v.highlighted ? 'var(--accent-volt)' : 'var(--border)',
                  }}
                >
                  {v.highlighted && (
                    <span
                      className="text-xs font-600 uppercase tracking-widest mb-3 self-start px-2 py-1 rounded-full"
                      style={{ background: 'var(--accent-volt-dim)', color: 'var(--accent-volt)', fontFamily: 'var(--font-jetbrains)' }}
                    >
                      {isRo ? 'Popular' : 'Popular'}
                    </span>
                  )}
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
                    {v.tag}
                  </p>
                  <h3 className="font-display text-lg font-400 mb-1" style={{ color: 'var(--text-primary)' }}>
                    {v.name}
                  </h3>
                  <p className="font-display text-3xl mb-4" style={{ color: 'var(--accent-gold)' }}>
                    €{v.price}
                  </p>
                  <div className="flex gap-4 mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span>👥 {v.passengers} {isRo ? 'pasageri' : 'passengers'}</span>
                    <span>🧳 {v.luggage} {isRo ? 'bagaje' : 'bags'}</span>
                  </div>
                  <ul className="space-y-1.5 mb-6 flex-1">
                    {v.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-volt)' }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${locale}/booking?vehicle=${v.id}&to=${encodeURIComponent(fm.toCity)}`}
                    className="text-center px-4 py-2.5 text-sm font-600 rounded-full border transition-vl hover:border-[var(--accent-volt)] hover:text-[var(--accent-volt)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  >
                    {isRo ? 'Selectează' : 'Select'}
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
              {isRo
                ? 'Prețuri pentru sens unic, off-peak. Orele de vârf (+€20): 07–09, 16–20, 00–06 ora Bucureștiului.'
                : 'Prices for one-way, off-peak transfer. Peak hours (+€20): 07–09, 16–20, 00–06 Bucharest time.'}
            </p>
          </section>

          {/* Optional stops */}
          {fm.stops && fm.stops.length > 0 && (
            <section className="mb-16">
              <h2
                className="font-display text-2xl font-400 mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                {isRo ? 'Opriri Opționale pe Traseu' : 'Stops You Can Add Along the Way'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fm.stops.map((stop) => (
                  <div
                    key={stop.name}
                    className="rounded-xl border p-5"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-display text-base font-400" style={{ color: 'var(--text-primary)' }}>
                        {stop.name}
                      </h3>
                      {stop.addedCost > 0 ? (
                        <span
                          className="text-xs px-2 py-1 rounded-full shrink-0"
                          style={{ background: 'var(--accent-volt-dim)', color: 'var(--accent-volt)', fontFamily: 'var(--font-jetbrains)' }}
                        >
                          +€{stop.addedCost}
                        </span>
                      ) : (
                        <span
                          className="text-xs px-2 py-1 rounded-full shrink-0"
                          style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
                        >
                          {isRo ? 'Gratuit' : 'Free'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {stop.description}
                    </p>
                    {stop.hours > 0 && (
                      <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                        ⏱ {stop.hours}h {isRo ? 'recomandat' : 'recommended'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
                {isRo
                  ? 'Menționează opririle dorite în notele de rezervare. Costul suplimentar se adaugă la prețul transferului.'
                  : 'Mention desired stops in the booking notes. The additional cost is added to the transfer price.'}
              </p>
            </section>
          )}

          {/* FAQ */}
          {fm.faq && fm.faq.length > 0 && (
            <section className="mb-16">
              <h2
                className="font-display text-2xl font-400 mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                {isRo ? 'Întrebări Frecvente' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-0 rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                {fm.faq.map((item, idx) => (
                  <details
                    key={idx}
                    className="group border-b last:border-0"
                    style={{ borderColor: 'var(--border-soft)' }}
                  >
                    <summary
                      className="flex items-center justify-between px-6 py-4 cursor-pointer list-none"
                      style={{ background: 'var(--bg-card)' }}
                    >
                      <span className="font-500 text-sm pr-4" style={{ color: 'var(--text-primary)' }}>
                        {item.question}
                      </span>
                      <span className="shrink-0 text-lg transition-transform group-open:rotate-45" style={{ color: 'var(--accent-volt)' }}>+</span>
                    </summary>
                    <div className="px-6 pb-4 pt-2" style={{ background: 'var(--bg-card)' }}>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related routes */}
          {relatedRoutes.length > 0 && (
            <section className="mb-16">
              <h2
                className="font-display text-2xl font-400 mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                {isRo ? 'Alte Rute Populare din București' : 'Other Popular Routes from Bucharest'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedRoutes.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/${locale}/intercity/${r.slug}`}
                    className="group rounded-xl border p-4 flex items-center justify-between transition-vl hover:border-[var(--accent-volt)]"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                  >
                    <div>
                      <p className="font-500 transition-vl group-hover:text-[var(--accent-volt)]" style={{ color: 'var(--text-primary)' }}>
                        {isRo ? r.ro : r.en}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {isRo ? 'de la' : 'from'} €{r.priceKona} · Tesla €{r.priceTesla}
                      </p>
                    </div>
                    <span className="text-xl transition-vl group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }}>→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Final CTA */}
          <div
            className="rounded-2xl border p-8 text-center"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h2
              className="font-display text-2xl font-300 mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              {isRo
                ? `Gata să călătorești spre ${fm.toCity}?`
                : `Ready to travel to ${fm.toCity}?`}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {isRo
                ? `Obțineți un preț real pentru ${fm.fromCity} → ${fm.toCity} în sub 2 minute.`
                : `Get a real-time price for ${fm.fromCity} → ${fm.toCity} in under 2 minutes.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/booking?to=${encodeURIComponent(fm.toCity)}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-600 rounded-full transition-vl hover:opacity-90"
                style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
              >
                {isRo ? 'Rezervă Acum →' : 'Book Now →'}
              </Link>
              <a
                href="https://wa.me/40700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-600 rounded-full border transition-vl hover:border-[#25D366] hover:text-[#25D366]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
