import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, taxiServiceSchema } from '@/lib/seo/schemas';
import { SITE } from '@/lib/seo/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'airport-transfers',
    locale,
    path: '/airport-transfers',
  });
}

export default async function AirportTransfersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const schemas = [
    breadcrumbSchema([
      { name: 'Home', url: `${SITE.url}/${locale}` },
      {
        name: 'Airport Transfers',
        url: `${SITE.url}/${locale}/airport-transfers`,
      },
    ]),
    taxiServiceSchema(),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="min-h-screen pt-24 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            <Link
              href={`/${locale}`}
              className="hover:text-[var(--text-secondary)] transition-vl"
            >
              {locale === 'ro' ? 'Acasă' : 'Home'}
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {locale === 'ro' ? 'Transfer Aeroport' : 'Airport Transfers'}
            </span>
          </nav>

          <div className="mb-12">
            <span
              className="inline-block text-xs font-600 uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
              style={{
                background: 'var(--accent-volt-dim)',
                color: 'var(--accent-volt)',
                fontFamily: 'var(--font-jetbrains)',
              }}
            >
              {locale === 'ro' ? 'Serviciu' : 'Service'}
            </span>
            <h1
              className="font-display text-4xl md:text-6xl font-300 tracking-tight mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {locale === 'ro'
                ? 'Transfer Aeroport București'
                : 'Bucharest Airport Transfer'}
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              {locale === 'ro'
                ? 'Transfer privat de la Aeroportul Henri Coandă (OTP) direct la destinația ta — hotel, centrul orașului sau oriunde în România. Preț fix, urmărire zbor inclusă.'
                : 'Private transfer from Henri Coandă International Airport (OTP) direct to your destination — city hotel, Airbnb, or anywhere in Romania. Fixed price, flight tracking included at no extra charge.'}
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mb-12">
            {(locale === 'ro'
              ? ['✈️ Urmărire zbor', '🔒 Preț fix', '🇬🇧 Șofer EN/RO', '⚡ 100% Electric', '🪧 Meet & Greet']
              : ['✈️ Flight Tracking', '🔒 Fixed Price', '🇬🇧 English Driver', '⚡ 100% Electric', '🪧 Meet & Greet']
            ).map((badge) => (
              <span
                key={badge}
                className="text-sm px-4 py-2 rounded-full border"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {(locale === 'ro'
              ? [
                  {
                    icon: '✈️',
                    title: 'Urmărire zbor automată',
                    desc: 'Monitorizăm zborul tău în timp real. Aterizare mai devreme? Suntem acolo. Întârziere? Fără costuri suplimentare.',
                  },
                  {
                    icon: '🔒',
                    title: 'Preț fix garantat',
                    desc: 'Prețul afișat este cel plătit. Fără contor, fără surge pricing, fără surprize la final.',
                  },
                  {
                    icon: '🪧',
                    title: 'Meet & Greet la sosiri',
                    desc: 'Șoferul te întâmpină la zona de sosiri cu un panou cu numele tău și te ajută cu bagajele.',
                  },
                  {
                    icon: '⚡',
                    title: '100% Electric',
                    desc: 'Tesla Model 3, Hyundai Kona Electric, Ford Capri — silențioase, curate, confortabile.',
                  },
                  {
                    icon: '🌐',
                    title: 'Șofer bilingv',
                    desc: 'Șoferul nostru vorbește fluent engleza și română — comunicare fără bariere de la aeroport la destinație.',
                  },
                  {
                    icon: '📍',
                    title: 'Door-to-door',
                    desc: 'De la ieșirea aeroport direct la ușa ta — hotel, apartament, sau orice adresă.',
                  },
                ]
              : [
                  {
                    icon: '✈️',
                    title: 'Automatic Flight Tracking',
                    desc: "We monitor your flight in real time. Early landing? We'll be there. Delayed? No extra charge — ever.",
                  },
                  {
                    icon: '🔒',
                    title: 'Fixed Pricing, No Surprises',
                    desc: 'The price you see at booking is the price you pay. No meter running, no surge, no hidden fees.',
                  },
                  {
                    icon: '🪧',
                    title: 'Arrivals Meet & Greet',
                    desc: 'Your driver waits at the arrivals exit with a name sign, ready to assist with luggage from the moment you land.',
                  },
                  {
                    icon: '⚡',
                    title: '100% Electric Fleet',
                    desc: 'Tesla Model 3, Hyundai Kona Electric, Ford Capri — whisper-quiet, zero-emission, premium comfort.',
                  },
                  {
                    icon: '🌐',
                    title: 'English-Speaking Driver',
                    desc: 'Fluent English. No language barrier, no confusion. Ask us anything about Romania, Bucharest, or your route.',
                  },
                  {
                    icon: '📍',
                    title: 'Door-to-Door Service',
                    desc: 'From the airport arrivals hall directly to your hotel lobby, apartment, or any Bucharest address.',
                  },
                ]
            ).map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border p-6"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3
                  className="font-display text-lg font-400 mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing info */}
          <div
            className="rounded-2xl border p-8 mb-12"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h2
              className="font-display text-2xl font-300 mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {locale === 'ro' ? 'Prețuri Transfer Aeroport' : 'Airport Transfer Pricing'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  vehicle: 'Hyundai Kona Electric',
                  tag: locale === 'ro' ? 'Eficient' : 'Efficient',
                  price: '€48',
                  note: locale === 'ro' ? '4 pasageri · 2 bagaje' : '4 passengers · 2 bags',
                },
                {
                  vehicle: 'Tesla Model 3',
                  tag: locale === 'ro' ? 'Signature' : 'Signature',
                  price: '€58',
                  note: locale === 'ro' ? '4 pasageri · 3 bagaje · WiFi' : '4 passengers · 3 bags · WiFi',
                },
                {
                  vehicle: 'Ford Capri SUV',
                  tag: locale === 'ro' ? 'Spațios' : 'Spacious',
                  price: '€69',
                  note: locale === 'ro' ? '4 pasageri · 4 bagaje · WiFi' : '4 passengers · 4 bags · WiFi',
                },
              ].map((v) => (
                <div
                  key={v.vehicle}
                  className="rounded-xl border p-4"
                  style={{ borderColor: 'var(--border-soft)' }}
                >
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
                    {v.tag}
                  </p>
                  <p className="font-display text-lg font-400 mb-1" style={{ color: 'var(--text-primary)' }}>
                    {v.vehicle}
                  </p>
                  <p className="font-display text-3xl mb-2" style={{ color: 'var(--accent-gold)' }}>
                    {v.price}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.note}</p>
                </div>
              ))}
            </div>
            <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
              {locale === 'ro'
                ? 'Prețuri pentru transfer Otopeni (OTP) → centrul Bucureștiului, sens unic, în afara orelor de vârf. Orele de vârf (07–09, 16–20, 00–06) includ suprataxă €20.'
                : 'Prices for Otopeni (OTP) → Bucharest city center, one-way, off-peak. Peak hours (07–09, 16–20, 00–06) include a €20 surcharge.'}
            </p>
          </div>

          {/* Internal links */}
          <div className="mb-12">
            <h2
              className="font-display text-xl font-300 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {locale === 'ro' ? 'De la OTP direct la destinație' : 'From OTP Direct to Your Destination'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: locale === 'ro' ? 'Brașov din aeroport' : 'OTP → Brașov', href: `/${locale}/intercity/bucharest-brasov` },
                { label: locale === 'ro' ? 'Sinaia din aeroport' : 'OTP → Sinaia', href: `/${locale}/intercity/bucharest-sinaia` },
                { label: locale === 'ro' ? 'Sibiu din aeroport' : 'OTP → Sibiu', href: `/${locale}/intercity/bucharest-sibiu` },
                { label: locale === 'ro' ? 'Constanța din aeroport' : 'OTP → Constanța', href: `/${locale}/intercity/bucharest-constanta` },
                { label: locale === 'ro' ? 'Cluj din aeroport' : 'OTP → Cluj-Napoca', href: `/${locale}/intercity/bucharest-cluj-napoca` },
                { label: locale === 'ro' ? 'Castelul Bran' : 'OTP → Bran Castle', href: `/${locale}/intercity/bucharest-bran-castle` },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm px-4 py-3 rounded-xl border text-center transition-vl hover:border-[var(--accent-volt)] hover:text-[var(--accent-volt)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}/booking`}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-600 rounded-full transition-vl hover:opacity-90"
              style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
            >
              {locale === 'ro' ? 'Rezervă Transfer Aeroport →' : 'Book Airport Transfer →'}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
