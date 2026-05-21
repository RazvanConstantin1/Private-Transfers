import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — VOLTLANE',
  description: 'VOLTLANE privacy policy. How we collect, use, and protect your personal data in compliance with GDPR.',
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-300 tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
          Privacy Policy
        </h1>
        <p className="text-sm mb-12" style={{ color: 'var(--text-muted)' }}>Last updated: January 2026</p>

        <div className="space-y-8 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>1. Data Controller</h2>
            <p>VOLTLANE is the data controller for personal data collected through this website. Contact: hello@voltlane.com</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>2. Data We Collect</h2>
            <p>When you make a booking, we collect: full name, email address, phone number, pickup and dropoff addresses, travel date and time, passenger count, and any optional notes you provide (e.g. flight number, special requests).</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>3. How We Use Your Data</h2>
            <p>We use your data exclusively to: (a) fulfil your booking and communicate about your transfer; (b) send you booking confirmation and receipt emails; (c) contact you if we need to discuss your booking. We do not use your data for marketing without explicit consent.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>4. Third-Party Processors</h2>
            <p>We use the following third-party services that process your data:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong style={{ color: 'var(--text-primary)' }}>Supabase</strong> — Database hosting (EU region). Booking data is stored here.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Resend</strong> — Transactional email delivery. Used to send booking confirmations.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Google Maps Platform</strong> — Address autocomplete and route distance calculation. Location data is processed per Google&apos;s privacy policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>5. Data Retention</h2>
            <p>We retain booking data for 3 years for accounting and legal compliance purposes. You may request deletion of your data at any time by contacting hello@voltlane.com.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>6. Your Rights (GDPR)</h2>
            <p>Under GDPR you have the right to: access your data, correct inaccurate data, request deletion, restrict processing, and data portability. Submit requests to hello@voltlane.com. You also have the right to lodge a complaint with the Romanian National Supervisory Authority for Personal Data Processing (ANSPDCP).</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>7. Cookies</h2>
            <p>This website uses only essential cookies required for functionality (session management, language preference). We do not use advertising or analytics tracking cookies.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
