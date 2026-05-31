import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ pageKey: 'about', locale, path: '/about' });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1
          className="font-display text-4xl md:text-6xl font-300 tracking-tight mb-8"
          style={{ color: 'var(--text-primary)' }}
        >
          About
        </h1>

        <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <p>
            VOLTLANE started with a simple observation: international visitors to Romania deserved better than unreliable taxis, confusing apps, and drivers who didn&apos;t speak English. We set out to build the service we&apos;d want to use ourselves.
          </p>
          <p>
            We operate a small fleet of three electric vehicles in and around Bucharest, offering airport transfers, intercity routes, and hourly bookings. Every booking is handled personally — no algorithm, no surge pricing, no surprises.
          </p>
          <p>
            Our driver speaks fluent English and knows Romania deeply: the best mountain routes, the monasteries worth a detour, the restaurants that aren&apos;t on TripAdvisor yet. We&apos;re as much a local concierge as a transfer service.
          </p>
          <p>
            The electric fleet is a deliberate choice. Romania&apos;s roads, mountains, and cities deserve to be experienced quietly — without fumes, without engine noise, without the cognitive dissonance of travelling a beautiful country while contributing to its pollution.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-16">
          {[
            { value: '3', label: 'Electric vehicles' },
            { value: '100%', label: 'Zero emissions' },
            { value: 'Fixed', label: 'Pricing always' },
            { value: '24/7', label: 'Available' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl font-300" style={{ color: 'var(--accent-volt)' }}>{s.value}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <Link
          href={`/${locale}/booking`}
          className="inline-flex items-center gap-2 px-8 py-4 text-base font-600 rounded-full transition-vl hover:opacity-90"
          style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
        >
          Book a Transfer →
        </Link>
      </div>
    </div>
  );
}
