import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import type { BookingStatus, BookingRow } from '@/lib/supabase/types';

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: '#E5C687',
  confirmed: '#7EFFA1',
  in_progress: '#60a5fa',
  completed: '#6A6A75',
  cancelled: '#ef4444',
};

export default async function AdminDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status } = await searchParams;

  const supabase = createServiceClient();
  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: bookingsRaw } = await query.limit(100);
  const bookings = bookingsRaw as BookingRow[] | null;

  const statuses: (BookingStatus | 'all')[] = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-300" style={{ color: 'var(--text-primary)' }}>
          Bookings
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {bookings?.length || 0} shown
        </p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/${locale}/admin${s !== 'all' ? `?status=${s}` : ''}`}
            className="px-4 py-1.5 text-xs font-600 rounded-full border transition-vl capitalize"
            style={{
              borderColor: (status || 'all') === s ? 'var(--accent-volt)' : 'var(--border)',
              color: (status || 'all') === s ? 'var(--accent-volt)' : 'var(--text-muted)',
              background: (status || 'all') === s ? 'var(--accent-volt-dim)' : 'transparent',
            }}
          >
            {s.replace('_', ' ')}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div
          className="hidden md:grid grid-cols-[1fr_140px_100px_120px_80px_100px] gap-4 px-6 py-3 text-xs font-600 uppercase tracking-widest border-b"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
        >
          <span>Customer / Route</span>
          <span>Date</span>
          <span>Vehicle</span>
          <span className="text-right">Total</span>
          <span>Status</span>
          <span></span>
        </div>

        {bookings?.length === 0 ? (
          <div className="px-6 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
            No bookings found.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
            {bookings?.map((b) => (
              <div
                key={b.id}
                className="flex flex-col md:grid md:grid-cols-[1fr_140px_100px_120px_80px_100px] gap-2 md:gap-4 px-6 py-4 transition-vl hover:bg-[var(--bg-card-hover)]"
              >
                <div>
                  <p className="text-sm font-500" style={{ color: 'var(--text-primary)' }}>{b.customer_name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {b.pickup_address.split(',')[0]} → {b.dropoff_address.split(',')[0]}
                  </p>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(b.pickup_datetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                  {b.vehicle_id.replace(/_/g, ' ')}
                </p>
                <p
                  className="font-display text-base md:text-right"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  €{b.total_price_eur}
                </p>
                <span
                  className="inline-block text-xs px-2 py-1 rounded-full font-600 w-fit"
                  style={{
                    background: `${STATUS_COLORS[b.status as BookingStatus]}22`,
                    color: STATUS_COLORS[b.status as BookingStatus],
                  }}
                >
                  {b.status.replace('_', ' ')}
                </span>
                <Link
                  href={`/${locale}/admin/bookings/${b.id}`}
                  className="text-xs font-600 transition-vl hover:text-[var(--accent-volt)] md:text-right"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
