'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { buildWhatsAppLink, formatEur, formatDuration } from '@/lib/utils';
import type { BookingRow, BookingStatus } from '@/lib/supabase/types';

type Booking = BookingRow;

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-0.5">
      <span className="text-sm shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="text-sm text-right break-all" style={{ color: 'var(--text-secondary)' }}>{value}</span>
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
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const id = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
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

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    const res = await fetch(`/api/booking/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Booking deleted');
      router.push(`/${locale}/admin`);
    } else {
      toast.error('Failed to delete');
      setDeleting(false);
      setConfirmDelete(false);
    }
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
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href={`/${locale}/admin`}
          className="text-sm transition-vl hover:text-[var(--accent-volt)] flex items-center gap-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          ← Back
        </Link>
        <span
          className="text-xs px-3 py-1 rounded-full font-600 capitalize"
          style={{
            background: `${STATUS_COLORS[booking.status]}22`,
            color: STATUS_COLORS[booking.status],
          }}
        >
          {booking.status.replace('_', ' ')}
        </span>
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-300 mb-6" style={{ color: 'var(--text-primary)' }}>
        {booking.customer_name}
        <span className="block text-base font-sans font-400 mt-1" style={{ color: 'var(--text-muted)' }}>
          {booking.pickup_address.split(',')[0]} → {booking.dropoff_address.split(',')[0]}
        </span>
      </h1>

      {/* Booking Details */}
      <div
        className="rounded-2xl border p-5 mb-4 space-y-2.5"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-xs font-600 uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
          Trip
        </h2>
        <DetailRow label="ID" value={<span style={{ fontFamily: 'var(--font-jetbrains)', color: 'var(--accent-volt)', fontSize: '12px' }}>{booking.id}</span>} />
        <DetailRow label="Created" value={new Date(booking.created_at).toLocaleString('en-GB')} />
        <DetailRow label="Pickup" value={booking.pickup_address} />
        <DetailRow label="Dropoff" value={booking.dropoff_address} />
        <DetailRow label="Date" value={new Date(booking.pickup_datetime).toLocaleString('en-GB', { timeZone: 'Europe/Bucharest' })} />
        {booking.return_datetime && (
          <DetailRow label="Return" value={new Date(booking.return_datetime).toLocaleString('en-GB', { timeZone: 'Europe/Bucharest' })} />
        )}
        <DetailRow label="Vehicle" value={<span className="capitalize">{booking.vehicle_id.replace(/_/g, ' ')}</span>} />
        <DetailRow label="Passengers" value={String(booking.passengers)} />
        <DetailRow label="Trip Type" value={<span className="capitalize">{booking.trip_type.replace('_', ' ')}</span>} />
        {booking.distance_km > 0 && (
          <DetailRow label="Distance" value={`${booking.distance_km} km · ${formatDuration(booking.duration_minutes)}`} />
        )}
        <DetailRow label="Total" value={<span className="font-display text-xl" style={{ color: 'var(--accent-gold)' }}>{formatEur(booking.total_price_eur)}</span>} />
        {booking.flight_number && <DetailRow label="Flight" value={booking.flight_number} />}
        {booking.notes && <DetailRow label="Notes" value={booking.notes} />}
      </div>

      {/* Customer */}
      <div
        className="rounded-2xl border p-5 mb-4 space-y-2.5"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-xs font-600 uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
          Customer
        </h2>
        <DetailRow label="Name" value={booking.customer_name} />
        <DetailRow label="Email" value={<a href={`mailto:${booking.customer_email}`} style={{ color: 'var(--accent-volt)' }}>{booking.customer_email}</a>} />
        <DetailRow label="Phone" value={<a href={`tel:${booking.customer_phone}`} style={{ color: 'var(--accent-volt)' }}>{booking.customer_phone}</a>} />

        <div className="pt-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-600 rounded-full transition-vl hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#25D366', color: '#fff' }}
          >
            💬 WhatsApp Customer
          </a>
        </div>
      </div>

      {/* Admin actions */}
      <div
        className="rounded-2xl border p-5 mb-4"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-xs font-600 uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
          Update Status
        </h2>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setNewStatus(s)}
              className="py-3 px-4 text-xs font-600 rounded-xl border transition-vl capitalize text-center"
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

        <div className="mb-5">
          <label className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
            Admin Notes
          </label>
          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Internal notes..."
            className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] resize-none"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full sm:w-auto px-8 py-3.5 text-sm font-600 rounded-full transition-vl hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Danger zone — delete */}
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
      >
        <h2 className="text-xs font-600 uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
          Danger Zone
        </h2>

        {confirmDelete ? (
          <div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Permanently delete this booking? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 sm:flex-none px-6 py-3 text-sm font-600 rounded-full transition-vl hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ background: '#ef4444', color: '#fff' }}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 sm:flex-none px-6 py-3 text-sm font-600 rounded-full border transition-vl"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="px-6 py-3 text-sm font-600 rounded-full border transition-vl hover:border-red-500 hover:text-red-400 active:scale-[0.98]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            Delete Booking
          </button>
        )}
      </div>
    </div>
  );
}
