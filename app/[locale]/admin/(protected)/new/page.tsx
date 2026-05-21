'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

const VEHICLES = [
  { id: 'hyundai_kona', label: 'Hyundai Kona' },
  { id: 'tesla_model_3', label: 'Tesla Model 3' },
  { id: 'ford_capri', label: 'Ford Capri' },
] as const;

const STATUSES = [
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
] as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-600 uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass = 'w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)]';
const inputStyle = { background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' };

export default function NewBookingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    pickup_address: '',
    dropoff_address: '',
    pickup_datetime: '',
    return_datetime: '',
    vehicle_id: 'tesla_model_3' as typeof VEHICLES[number]['id'],
    passengers: '1',
    trip_type: 'one_way' as 'one_way' | 'round_trip',
    total_price_eur: '',
    status: 'confirmed' as typeof STATUSES[number]['id'],
    flight_number: '',
    notes: '',
    locale: 'en' as 'en' | 'ro',
  });

  function set(k: keyof typeof form, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.customer_name || !form.customer_email || !form.customer_phone ||
        !form.pickup_address || !form.dropoff_address || !form.pickup_datetime ||
        !form.total_price_eur) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (form.trip_type === 'round_trip' && !form.return_datetime) {
      toast.error('Return datetime is required for round trips');
      return;
    }

    setSaving(true);

    const payload = {
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      pickup_address: form.pickup_address,
      dropoff_address: form.dropoff_address,
      pickup_datetime: new Date(form.pickup_datetime).toISOString(),
      return_datetime: form.trip_type === 'round_trip' && form.return_datetime
        ? new Date(form.return_datetime).toISOString()
        : null,
      vehicle_id: form.vehicle_id,
      passengers: parseInt(form.passengers, 10),
      trip_type: form.trip_type,
      total_price_eur: parseFloat(form.total_price_eur),
      status: form.status,
      flight_number: form.flight_number || null,
      notes: form.notes || null,
      locale: form.locale,
    };

    const res = await fetch('/api/admin/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const { id } = await res.json();
      toast.success('Booking created');
      router.push(`/${locale}/admin/bookings/${id}`);
    } else {
      const err = await res.json().catch(() => ({}));
      toast.error(err?.error || 'Failed to create booking');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/${locale}/admin`}
          className="text-sm transition-vl hover:text-[var(--accent-volt)]"
          style={{ color: 'var(--text-muted)' }}
        >
          ← Back
        </Link>
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-300 mb-6" style={{ color: 'var(--text-primary)' }}>
        New Booking
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer */}
        <div
          className="rounded-2xl border p-5 space-y-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-xs font-600 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
            Customer
          </h2>
          <Field label="Full Name *">
            <input
              type="text"
              value={form.customer_name}
              onChange={(e) => set('customer_name', e.target.value)}
              placeholder="John Doe"
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email *">
              <input
                type="email"
                value={form.customer_email}
                onChange={(e) => set('customer_email', e.target.value)}
                placeholder="john@example.com"
                className={inputClass}
                style={inputStyle}
              />
            </Field>
            <Field label="Phone *">
              <input
                type="tel"
                value={form.customer_phone}
                onChange={(e) => set('customer_phone', e.target.value)}
                placeholder="+40 700 000 000"
                className={inputClass}
                style={inputStyle}
              />
            </Field>
          </div>
        </div>

        {/* Trip */}
        <div
          className="rounded-2xl border p-5 space-y-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-xs font-600 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
            Trip
          </h2>
          <Field label="Pickup Address *">
            <input
              type="text"
              value={form.pickup_address}
              onChange={(e) => set('pickup_address', e.target.value)}
              placeholder="Otopeni Airport, Bucharest"
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Dropoff Address *">
            <input
              type="text"
              value={form.dropoff_address}
              onChange={(e) => set('dropoff_address', e.target.value)}
              placeholder="Sinaia, Prahova"
              className={inputClass}
              style={inputStyle}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Pickup Date & Time *">
              <input
                type="datetime-local"
                value={form.pickup_datetime}
                onChange={(e) => set('pickup_datetime', e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </Field>
            <Field label="Trip Type">
              <select
                value={form.trip_type}
                onChange={(e) => set('trip_type', e.target.value as 'one_way' | 'round_trip')}
                className={inputClass}
                style={inputStyle}
              >
                <option value="one_way">One Way</option>
                <option value="round_trip">Round Trip</option>
              </select>
            </Field>
          </div>

          {form.trip_type === 'round_trip' && (
            <Field label="Return Date & Time *">
              <input
                type="datetime-local"
                value={form.return_datetime}
                onChange={(e) => set('return_datetime', e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </Field>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Vehicle">
              <select
                value={form.vehicle_id}
                onChange={(e) => set('vehicle_id', e.target.value as typeof VEHICLES[number]['id'])}
                className={inputClass}
                style={inputStyle}
              >
                {VEHICLES.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Passengers">
              <select
                value={form.passengers}
                onChange={(e) => set('passengers', e.target.value)}
                className={inputClass}
                style={inputStyle}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Flight Number (optional)">
            <input
              type="text"
              value={form.flight_number}
              onChange={(e) => set('flight_number', e.target.value)}
              placeholder="RO1234"
              className={inputClass}
              style={inputStyle}
            />
          </Field>

          <Field label="Notes (optional)">
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Special requests..."
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </Field>
        </div>

        {/* Pricing & Status */}
        <div
          className="rounded-2xl border p-5 space-y-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-xs font-600 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
            Pricing & Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Total Price (€) *">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-600" style={{ color: 'var(--text-muted)' }}>€</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.total_price_eur}
                  onChange={(e) => set('total_price_eur', e.target.value)}
                  placeholder="0.00"
                  className={`${inputClass} pl-8`}
                  style={inputStyle}
                />
              </div>
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as typeof STATUSES[number]['id'])}
                className={inputClass}
                style={inputStyle}
              >
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Language">
            <select
              value={form.locale}
              onChange={(e) => set('locale', e.target.value as 'en' | 'ro')}
              className={inputClass}
              style={inputStyle}
            >
              <option value="en">English</option>
              <option value="ro">Romanian</option>
            </select>
          </Field>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 text-sm font-600 rounded-full transition-vl hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
        >
          {saving ? 'Creating...' : 'Create Booking'}
        </button>
      </form>
    </div>
  );
}
