import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Airport Transfers Bucharest (OTP) — VOLTLANE',
  description: 'Premium electric airport transfers to/from Henri Coandă International Airport (OTP). Fixed pricing, flight tracking, English-speaking driver.',
};

export default async function AirportTransfersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <span
            className="inline-block text-xs font-600 uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ background: 'var(--accent-volt-dim)', color: 'var(--accent-volt)', fontFamily: 'var(--font-jetbrains)' }}
          >
            Service
          </span>
          <h1
            className="font-display text-4xl md:text-6xl font-300 tracking-tight mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Airport Transfers
          </h1>
          <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Stress-free pickups and drop-offs at Henri Coandă International Airport (OTP). Flight tracking included at no extra charge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            { icon: '✈️', title: 'Flight Tracking', desc: 'We monitor your flight in real time. Early landing? We\'ll be there. Delayed? No extra charge.' },
            { icon: '🔒', title: 'Fixed Pricing', desc: 'The price you see is the price you pay. No meter, no surge, no surprises at the end.' },
            { icon: '🇬🇧', title: 'Meet & Greet', desc: 'Your driver waits at arrivals with a name sign, ready to assist with luggage.' },
            { icon: '⚡', title: '100% Electric', desc: 'Three fully electric vehicles — quiet, clean, comfortable from the moment you land.' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border p-6"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-display text-lg font-400 mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/booking`}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-600 rounded-full transition-vl hover:opacity-90"
            style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
          >
            Book Airport Transfer →
          </Link>
        </div>
      </div>
    </div>
  );
}
