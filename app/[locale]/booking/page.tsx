import type { Metadata } from 'next';
import BookingForm from '@/components/booking/BookingForm';

export const metadata: Metadata = {
  title: 'Book a Transfer',
  description: 'Book your premium electric transfer in Romania. Real-time pricing, 3 vehicle options, fixed rates.',
};

export default function BookingPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1
            className="font-display text-4xl md:text-5xl font-300 tracking-tight mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Book Your Transfer
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Real-time pricing. No surprises.
          </p>
        </div>
        <BookingForm />
      </div>
    </div>
  );
}
