import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — VOLTLANE',
  description: 'VOLTLANE terms and conditions for electric transfer services in Romania.',
};

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-300 tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
          Terms & Conditions
        </h1>
        <p className="text-sm mb-12" style={{ color: 'var(--text-muted)' }}>Last updated: January 2026 · Subject to Romanian law</p>

        <div className="space-y-8 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>1. Service</h2>
            <p>VOLTLANE provides private electric chauffeur transfer services in Romania. Bookings are subject to availability and confirmed by email/WhatsApp within 1 hour of submission.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>2. Pricing</h2>
            <p>All prices displayed are in Euros (EUR) and include VAT where applicable. Prices are calculated at the time of booking and guaranteed once confirmed. The base fee, per-kilometre rate, round-trip multiplier, long-distance multiplier, and peak-hour surcharge are applied as described in the booking form.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>3. Cancellation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cancellations more than 24 hours before pickup: full refund.</li>
              <li>Cancellations 6–24 hours before pickup: 50% refund.</li>
              <li>Cancellations less than 6 hours before pickup: no refund.</li>
              <li>No-shows: no refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>4. Waiting Time</h2>
            <p>For airport pickups, we track your flight and provide up to 60 minutes of free waiting time after landing. For other pickups, 15 minutes of waiting time is included. Additional waiting time is charged at €10 per 15 minutes.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>5. Passenger Conduct</h2>
            <p>Passengers must not smoke, consume alcohol, or engage in conduct that disturbs the driver or damages the vehicle. VOLTLANE reserves the right to terminate a journey if these conditions are violated, with no refund.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>6. Liability</h2>
            <p>VOLTLANE carries full commercial passenger liability insurance as required by Romanian law. We are not liable for delays caused by traffic, weather, road closures, or other circumstances outside our control.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-400 mb-3" style={{ color: 'var(--text-primary)' }}>7. Governing Law</h2>
            <p>These terms are governed by Romanian law. Disputes shall be resolved in the courts of Bucharest, Romania.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
