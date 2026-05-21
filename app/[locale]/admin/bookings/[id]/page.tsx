'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { buildWhatsAppLink, formatEur, formatDuration } from '@/lib/utils';
import type { BookingRow, BookingStatus } from '@/lib/supabase/types';

type Booking = BookingRow;

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="text-sm text-right" style={{ color: 'var(--text-secondary)' }}>{value}</span>
    </div>
  );
}

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: '#E5C687',
  confirmed: '#7EFFA1',
  in_progress: '#60a5fa',
  completed: '#6A6A75',
  cancelled: '#ef4444',
};

const STATUSES: BookingStatus[] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export default function BookingDetailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const id = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState<BookingStatus>('pending');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetch(`/api/booking/${id}`)
      .then((r) => r.json())
      .then((b) => {
        setBooking(b);
        setNewStatus(b.status);
        setAdminNotes(b.admin_notes || '');
        setLoading(false);
      });
  }, [id]);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/booking/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, admin_notes: adminNotes }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBooking(updated);
      toast.success('Booking updated');
    } else {
      toast.error('Failed to update');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-volt)' }} />
      </div>
    );
  }

  if (!booking) {
    return <div style={{ color: 'var(--text-muted)' }}>Booking not found.</div>;
  }

  const waMsg = `Hi ${booking.customer_name}, your VOLTLANE transfer (${booking.pickup_address.split(',')[0]} → ${booking.dropoff_address.split(',')[0]}) is confirmed ✅`;
  const waLink = buildWhatsAppLink(booking.customer_phone, waMsg);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/${locale}/admin`}
          className="text-sm transition-vl hover:text-[var(--accent-volt)]"
          style={{ color: 'var(--text-muted)' }}
        >
          ← Back
        </Link>
        <span
          className="text-xs px-3 py-1 rounded-full font-600"
          style={{
            background: `${STATUS_COLORS[booking.status]}22`,
            color: STATUS_COLORS[booking.status],
          }}
        >
          {booking.status.replace('_', ' ')}
        </span>
      </div>

      <h1 className="font-display text-3xl font-300 mb-8" style={{ color: 'var(--text-primary)' }}>
        Booking Detail
      </h1>

      <div
        className="rounded-2xl border p-6 mb-6 space-y-3"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-xs font-600 uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
          Booking Details
        </h2>
        <DetailRow label="ID" value={<span style={{ fontFamily: 'var(--font-jetbrains)', color: 'var(--accent-volt)', fontSize: '13px' }}>{booking.id}</span>} />
        <DetailRow label="Created" value={new Date(booking.created_at).toLocaleString('en-GB')} />
        <DetailRow label="Pickup" value={booking.pickup_address} />
        <DetailRow label="Dropoff" value={booking.dropoff_address} />
        <DetailRow label="Date" value={new Date(booking.pickup_datetime).toLocaleString('en-GB', { timeZone: 'Europe/Bucharest' })} />
        <DetailRow label="Vehicle" value={booking.vehicle_id.replace(/_/g, ' ')} />
        <DetailRow label="Passengers" value={String(booking.passengers)} />
        <DetailRow label="Trip Type" value={booking.trip_type.replace('_', ' ')} />
        <DetailRow label="Distance" value={`${booking.distance_km} km · ${formatDuration(booking.duration_minutes)}`} />
        <DetailRow label="Total" value={<span className="font-display text-xl" style={{ color: 'var(--accent-gold)' }}>{formatEur(booking.total_price_eur)}</span>} />
        {booking.flight_number && <DetailRow label="Flight" value={booking.flight_number} />}
        {booking.notes && <DetailRow label="Notes" value={booking.notes} />}
      </div>

      {/* Customer */}
      <div
        className="rounded-2xl border p-6 mb-6 space-y-3"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-xs font-600 uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
          Customer
        </h2>
        <DetailRow label="Name" value={booking.customer_name} />
        <DetailRow label="Email" value={<a href={`mailto:${booking.customer_email}`} style={{ color: 'var(--accent-volt)' }}>{booking.customer_email}</a>} />
        <DetailRow label="Phone" value={booking.customer_phone} />

        <div className="pt-4">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-600 rounded-full transition-vl hover:opacity-90"
            style={{ background: '#25D366', color: '#fff' }}
          >
            💬 WhatsApp Customer
          </a>
        </div>
      </div>

      {/* Admin actions */}
      <div
        className="rounded-2xl border p-6"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-xs font-600 uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
          Update Status
        </h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setNewStatus(s)}
              className="px-4 py-2 text-xs font-600 rounded-full border transition-vl capitalize"
              style={{
                borderColor: newStatus === s ? STATUS_COLORS[s] : 'var(--border)',
                color: newStatus === s ? STATUS_COLORS[s] : 'var(--text-muted)',
                background: newStatus === s ? `${STATUS_COLORS[s]}18` : 'transparent',
              }}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
            Admin Notes
          </label>
          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] resize-none"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="px-8 py-3 text-sm font-600 rounded-full transition-vl hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
