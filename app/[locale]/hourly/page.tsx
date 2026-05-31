import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ pageKey: 'hourly', locale, path: '/hourly' });
}

export default async function HourlyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-display text-4xl md:text-6xl font-300 tracking-tight mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Hourly Booking
        </h1>
        <p className="text-xl mb-16" style={{ color: 'var(--text-secondary)' }}>
          Your personal driver for a day, half-day, or a few hours. Business-ready, flexible, and always electric.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            { icon: '🏢', title: 'Business Meetings', desc: 'Multiple stops across the city with a professional, discreet driver. Never worry about parking again.' },
            { icon: '🏙️', title: 'City Tours', desc: 'Discover Bucharest at your pace. Your driver doubles as a knowledgeable local guide.' },
            { icon: '🎭', title: 'Events & Evenings', desc: 'Opera, concerts, dinners — arrive and depart in comfort without the taxi wait.' },
            { icon: '✈️', title: 'Airport + City', desc: 'Land, collect luggage, check in to the hotel, attend a meeting — all in one seamless booking.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-display text-xl font-400 mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          Hourly bookings are handled directly — please contact us via WhatsApp or email to arrange.
        </p>

        <div className="flex gap-4">
          <a
            href="https://wa.me/40700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-600 rounded-full transition-vl hover:opacity-90"
            style={{ background: '#25D366', color: '#fff' }}
          >
            WhatsApp Us
          </a>
          <a
            href="mailto:hello@voltlane.com"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-600 rounded-full border transition-vl hover:border-[var(--accent-volt)] hover:text-[var(--accent-volt)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}
