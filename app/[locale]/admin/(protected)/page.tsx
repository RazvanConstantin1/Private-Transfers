import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import type { BookingStatus, BookingRow } from '@/lib/supabase/types';
import VehicleStats from '@/components/admin/VehicleStats';
import { FLEET } from '@/lib/fleet';

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: '#E5C687',
  confirmed: '#7EFFA1',
  in_progress: '#60a5fa',
  completed: '#6A6A75',
  cancelled: '#ef4444',
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  // Filtered list for the table
  let query = sb.from('bookings').select('*').order('created_at', { ascending: false });
  if (status && status !== 'all') query = query.eq('status', status);
  const { data: bookings } = await query.limit(100) as { data: BookingRow[] | null };

  // All bookings for stats (no limit, no status filter)
  const { data: allBookings } = await sb
    .from('bookings')
    .select('vehicle_id, total_price_eur, status') as { data: { vehicle_id: string; total_price_eur: number; status: string }[] | null };

  const nonCancelled = allBookings?.filter((b) => b.status !== 'cancelled') ?? [];
  const pending = allBookings?.filter((b) => b.status === 'pending') ?? [];
  const totalRevenue = nonCancelled.reduce((s, b) => s + b.total_price_eur, 0);

  const overall = {
    total: nonCancelled.length,
    revenue: totalRevenue,
    pending: pending.length,
    avgPrice: nonCancelled.length > 0 ? totalRevenue / nonCancelled.length : 0,
  };

  const vehicleStats = FLEET.map((v) => {
    const rows = nonCancelled.filter((b) => b.vehicle_id === v.id);
    const revenue = rows.reduce((s, b) => s + b.total_price_eur, 0);
    return {
      vehicle_id: v.id,
      name: v.name,
      trips: rows.length,
      revenue,
      avg: rows.length > 0 ? revenue / rows.length : 0,
      pending: pending.filter((b) => b.vehicle_id === v.id).length,
    };
  });

  const statuses: (BookingStatus | 'all')[] = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  const activeStatus = status || 'all';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-300" style={{ color: 'var(--text-primary)' }}>
            Bookings
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {bookings?.length || 0} {activeStatus !== 'all' ? activeStatus.replace('_', ' ') : 'total'}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/new`}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-600 rounded-full transition-vl hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          <span className="hidden sm:inline">New Booking</span>
        </Link>
      </div>

      {/* Stats */}
      <VehicleStats overall={overall} vehicles={vehicleStats} />

      {/* Status filters — scrollable on mobile */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/${locale}/admin${s !== 'all' ? `?status=${s}` : ''}`}
            className="px-3 py-1.5 text-xs font-600 rounded-full border transition-vl capitalize whitespace-nowrap flex-shrink-0"
            style={{
              borderColor: activeStatus === s ? 'var(--accent-volt)' : 'var(--border)',
              color: activeStatus === s ? 'var(--accent-volt)' : 'var(--text-muted)',
              background: activeStatus === s ? 'var(--accent-volt-dim)' : 'transparent',
            }}
          >
            {s.replace('_', ' ')}
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {!bookings?.length ? (
        <div
          className="rounded-2xl border px-6 py-16 text-center"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          No bookings found.
        </div>
      ) : (
        <>
          {/* Desktop table header */}
          <div
            className="hidden md:grid grid-cols-[1fr_130px_110px_90px_110px_48px] gap-4 px-4 py-2 text-xs font-600 uppercase tracking-widest rounded-xl mb-1"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
          >
            <span>Customer / Route</span>
            <span>Date</span>
            <span>Vehicle</span>
            <span className="text-right">Total</span>
            <span>Status</span>
            <span />
          </div>

          {/* Rows */}
          <div className="space-y-2 md:space-y-0 md:divide-y rounded-2xl md:border md:overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            {bookings.map((b) => (
              <Link
                key={b.id}
                href={`/${locale}/admin/bookings/${b.id}`}
                className="group block md:grid md:grid-cols-[1fr_130px_110px_90px_110px_48px] md:gap-4 md:items-center px-4 py-3.5 rounded-2xl md:rounded-none border md:border-0 transition-vl hover:bg-[var(--bg-card-hover)] active:bg-[var(--bg-card-hover)]"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                {/* Mobile layout */}
                <div className="flex items-start justify-between gap-3 md:contents">
                  {/* Name + route */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-500 truncate" style={{ color: 'var(--text-primary)' }}>
                      {b.customer_name}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                      {b.pickup_address.split(',')[0]} → {b.dropoff_address.split(',')[0]}
                    </p>
                    {/* Mobile-only meta */}
                    <div className="flex items-center gap-2 mt-1.5 md:hidden">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(b.pickup_datetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                      <span style={{ color: 'var(--border)' }}>·</span>
                      <span className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
                        {b.vehicle_id.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Mobile: price + status */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 md:hidden">
                    <span className="font-display text-base" style={{ color: 'var(--accent-gold)' }}>
                      €{b.total_price_eur}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-600"
                      style={{
                        background: `${STATUS_COLORS[b.status as BookingStatus]}22`,
                        color: STATUS_COLORS[b.status as BookingStatus],
                      }}
                    >
                      {STATUS_LABELS[b.status as BookingStatus]}
                    </span>
                  </div>

                  {/* Desktop-only columns */}
                  <p className="hidden md:block text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(b.pickup_datetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="hidden md:block text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                    {b.vehicle_id.replace(/_/g, ' ')}
                  </p>
                  <p className="hidden md:block font-display text-base text-right" style={{ color: 'var(--accent-gold)' }}>
                    €{b.total_price_eur}
                  </p>
                  <span
                    className="hidden md:inline-block text-xs px-2 py-1 rounded-full font-600 w-fit"
                    style={{
                      background: `${STATUS_COLORS[b.status as BookingStatus]}22`,
                      color: STATUS_COLORS[b.status as BookingStatus],
                    }}
                  >
                    {STATUS_LABELS[b.status as BookingStatus]}
                  </span>
                  <span
                    className="hidden md:block text-xs font-600 text-right transition-vl group-hover:text-[var(--accent-volt)]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
