import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your VOLTLANE transfer has been received. We will confirm within 1 hour.',
};

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await params;
  const { id } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-24">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: 'var(--accent-volt-dim)', border: '1px solid rgba(126,255,161,0.3)' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-volt)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1
          className="font-display text-4xl font-300 tracking-tight mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Booking Confirmed!
        </h1>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          We&apos;ll confirm your booking within 1 hour via email and WhatsApp.
        </p>

        {id && (
          <div
            className="rounded-xl border px-6 py-4 mb-8 inline-block"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-soft)' }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
            >
              Booking ID
            </p>
            <p
              className="text-sm"
              style={{ color: 'var(--accent-volt)', fontFamily: 'var(--font-jetbrains)' }}
            >
              {id}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/40700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 font-600 rounded-full transition-vl hover:opacity-90"
            style={{ background: '#25D366', color: '#fff' }}
          >
            Chat on WhatsApp
          </a>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center px-7 py-3 font-600 rounded-full border transition-vl hover:border-[var(--accent-volt)] hover:text-[var(--accent-volt)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
