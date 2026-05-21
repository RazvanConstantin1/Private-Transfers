'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { isValidPhoneNumber } from 'libphonenumber-js';
import Image from 'next/image';
import { FLEET, type VehicleId } from '@/lib/fleet';
import { calculateAllPrices, type PriceBreakdown } from '@/lib/pricing';
import { formatEur, formatDuration } from '@/lib/utils';
import AddressAutocomplete from './AddressAutocomplete';
import { toast } from 'sonner';

type TripType = 'one_way' | 'round_trip';
type Step = 1 | 2 | 3;

interface RouteData {
  tripType: TripType;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  pickupDatetime: string;
  returnDatetime: string;
  passengers: number;
  flightNumber: string;
}

interface ContactData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
}

const distanceCache = new Map<string, { distanceKm: number; durationMinutes: number }>();

function isAirport(address: string) {
  return /otopeni|henri coan[dă]|OTP/i.test(address);
}

function getMinDatetime(base?: Date, offsetHours = 2): string {
  const d = new Date((base || new Date()).getTime() + offsetHours * 3_600_000);
  return d.toISOString().slice(0, 16);
}

// Apple-style segmented control
function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', width: '100%', background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: 3, gap: 2 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 9,
              background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
              boxShadow: active ? '0 1px 4px rgba(0,0,0,0.5), inset 0 0 0 0.5px rgba(255,255,255,0.1)' : 'none',
              color: active ? 'var(--text-primary)' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// 3-step stepper
function Stepper({ current, total }: { current: Step; total: number }) {
  const labels = ['Route', 'Details', 'Choose'];
  return (
    <div className="flex items-start mb-6">
      {Array.from({ length: total }, (_, i) => {
        const step = (i + 1) as Step;
        const done = current > step;
        const active = current === step;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600,
                background: done || active ? 'var(--accent-volt)' : 'var(--bg-elevated)',
                color: done || active ? '#0A0A0B' : 'var(--text-muted)',
                border: `1.5px solid ${done || active ? 'var(--accent-volt)' : 'var(--border)'}`,
                transition: 'all 0.2s', flexShrink: 0,
              }}>
                {done ? (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : step}
              </div>
              <span style={{
                fontSize: 10, marginTop: 4,
                color: active ? 'var(--accent-volt)' : done ? 'var(--text-secondary)' : 'var(--text-muted)',
                fontWeight: active ? 600 : 400, whiteSpace: 'nowrap',
              }}>
                {labels[i]}
              </span>
            </div>
            {i < total - 1 && (
              <div style={{
                flex: 1, height: 1,
                background: current > step ? 'var(--accent-volt)' : 'var(--border)',
                margin: '0 4px', marginBottom: 18, transition: 'background 0.3s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BookingWidget() {
  const t = useTranslations('booking');
  const locale = useLocale();
  const router = useRouter();
  const isRo = locale === 'ro';

  const [step, setStep] = useState<Step>(1);
  const [route, setRoute] = useState<RouteData>({
    tripType: 'one_way',
    pickupAddress: '', pickupLat: 0, pickupLng: 0,
    dropoffAddress: '', dropoffLat: 0, dropoffLng: 0,
    pickupDatetime: '', returnDatetime: '',
    passengers: 2, flightNumber: '',
  });
  const [contact, setContact] = useState<ContactData>({
    customerName: '', customerEmail: '', customerPhone: '', notes: '',
  });
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleId | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [loadingDistance, setLoadingDistance] = useState(false);
  const [prices, setPrices] = useState<Record<VehicleId, PriceBreakdown> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchDistance = useCallback(async (oLat: number, oLng: number, dLat: number, dLng: number) => {
    const key = `${oLat.toFixed(6)},${oLng.toFixed(6)}-${dLat.toFixed(6)},${dLng.toFixed(6)}`;
    if (distanceCache.has(key)) {
      const c = distanceCache.get(key)!;
      setDistanceKm(c.distanceKm);
      setDurationMinutes(c.durationMinutes);
      return c;
    }
    setLoadingDistance(true);
    try {
      const res = await fetch('/api/distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: { lat: oLat, lng: oLng }, destination: { lat: dLat, lng: dLng } }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      distanceCache.set(key, data);
      setDistanceKm(data.distanceKm);
      setDurationMinutes(data.durationMinutes);
      return data;
    } catch {
      toast.error(isRo ? 'Nu s-a putut calcula distanța.' : 'Could not calculate distance.');
      return null;
    } finally {
      setLoadingDistance(false);
    }
  }, [isRo]);

  // Auto-fetch distance when both coords available
  useEffect(() => {
    if (!route.pickupLat || !route.pickupLng || !route.dropoffLat || !route.dropoffLng) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchDistance(route.pickupLat, route.pickupLng, route.dropoffLat, route.dropoffLng);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [route.pickupLat, route.pickupLng, route.dropoffLat, route.dropoffLng, fetchDistance]);

  // Recalculate prices when distance or datetime changes
  useEffect(() => {
    if (!distanceKm || !route.pickupDatetime) { setPrices(null); return; }
    setPrices(calculateAllPrices({
      distanceKm,
      tripType: route.tripType,
      pickupDateTime: new Date(route.pickupDatetime),
      returnDateTime: route.returnDatetime ? new Date(route.returnDatetime) : undefined,
    }));
  }, [distanceKm, route.pickupDatetime, route.tripType, route.returnDatetime]);

  const showFlight = !!(
    route.pickupAddress && route.dropoffAddress &&
    (isAirport(route.pickupAddress) || isAirport(route.dropoffAddress))
  );

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!route.pickupAddress) e.pickup = t('errors.pickupRequired');
    if (!route.dropoffAddress) e.dropoff = t('errors.dropoffRequired');
    if (!route.pickupDatetime) e.datetime = t('errors.dateRequired');
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!contact.customerName || contact.customerName.length < 2) e.name = t('errors.nameRequired');
    if (!contact.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.customerEmail)) e.email = t('errors.emailRequired');
    if (!contact.customerPhone) {
      e.phone = t('errors.phoneRequired');
    } else {
      try {
        if (!isValidPhoneNumber(contact.customerPhone, 'RO')) e.phone = t('errors.phoneRequired');
      } catch { e.phone = t('errors.phoneRequired'); }
    }
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setFieldErrors({});
    setStep((s) => (s + 1) as Step);
  };

  const handleSubmit = async () => {
    if (!selectedVehicle) { toast.error(t('errors.vehicleRequired')); return; }
    if (!prices || !distanceKm || !durationMinutes) {
      toast.error(isRo ? 'Prețul nu a putut fi calculat. Verifică adresele.' : 'Price could not be calculated. Check addresses.');
      return;
    }
    const selectedPrice = prices[selectedVehicle];
    setSubmitting(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_address: route.pickupAddress,
          pickup_lat: route.pickupLat,
          pickup_lng: route.pickupLng,
          pickup_datetime: new Date(route.pickupDatetime).toISOString(),
          dropoff_address: route.dropoffAddress,
          dropoff_lat: route.dropoffLat,
          dropoff_lng: route.dropoffLng,
          vehicle_id: selectedVehicle,
          passengers: route.passengers,
          trip_type: route.tripType,
          return_datetime: route.returnDatetime ? new Date(route.returnDatetime).toISOString() : null,
          client_total: selectedPrice.total,
          customer_name: contact.customerName,
          customer_email: contact.customerEmail,
          customer_phone: contact.customerPhone,
          flight_number: route.flightNumber || null,
          notes: contact.notes || null,
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || t('errors.bookingFailed')); return; }
      router.push(`/${locale}/booking/success?id=${data.id}`);
    } catch {
      toast.error(t('errors.bookingFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBreakdown = selectedVehicle && prices ? prices[selectedVehicle] : null;

  return (
    <div className="rounded-2xl border overflow-hidden w-full" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="p-5 sm:p-6">
        <Stepper current={step} total={3} />

        {/* ── STEP 1: Route ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            <SegmentedControl
              options={[
                { value: 'one_way', label: t('oneWay') },
                { value: 'round_trip', label: t('roundTrip') },
              ]}
              value={route.tripType}
              onChange={(v) => setRoute((r) => ({ ...r, tripType: v as TripType }))}
            />

            <div>
              <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t('pickup')}
              </label>
              <AddressAutocomplete
                id="widget-pickup"
                placeholder={t('pickupPlaceholder')}
                value={route.pickupAddress}
                onChange={(text) => setRoute((r) => ({ ...r, pickupAddress: text, pickupLat: 0, pickupLng: 0 }))}
                onSelect={(place) => setRoute((r) => ({ ...r, pickupAddress: place.address, pickupLat: place.lat, pickupLng: place.lng }))}
                aria-label={t('pickup')}
              />
              {fieldErrors.pickup && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.pickup}</p>}
            </div>

            <div>
              <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t('dropoff')}
              </label>
              <AddressAutocomplete
                id="widget-dropoff"
                placeholder={t('dropoffPlaceholder')}
                value={route.dropoffAddress}
                onChange={(text) => setRoute((r) => ({ ...r, dropoffAddress: text, dropoffLat: 0, dropoffLng: 0 }))}
                onSelect={(place) => setRoute((r) => ({ ...r, dropoffAddress: place.address, dropoffLat: place.lat, dropoffLng: place.lng }))}
                aria-label={t('dropoff')}
              />
              {fieldErrors.dropoff && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.dropoff}</p>}
            </div>

            <div>
              <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t('pickupDate')}
              </label>
              <input
                type="datetime-local"
                min={getMinDatetime()}
                value={route.pickupDatetime}
                onChange={(e) => setRoute((r) => ({ ...r, pickupDatetime: e.target.value }))}
                onClick={(e) => { try { (e.target as HTMLInputElement).showPicker(); } catch { /* unsupported */ } }}
                className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] cursor-pointer"
                style={{ background: 'var(--bg-elevated)', borderColor: fieldErrors.datetime ? '#ef4444' : 'var(--border)', color: 'var(--text-primary)', colorScheme: 'dark' }}
              />
              {fieldErrors.datetime && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.datetime}</p>}
            </div>

            {route.tripType === 'round_trip' && (
              <div>
                <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {t('returnDate')}
                </label>
                <input
                  type="datetime-local"
                  min={route.pickupDatetime ? getMinDatetime(new Date(route.pickupDatetime), 1) : getMinDatetime()}
                  value={route.returnDatetime}
                  onChange={(e) => setRoute((r) => ({ ...r, returnDatetime: e.target.value }))}
                  onClick={(e) => { try { (e.target as HTMLInputElement).showPicker(); } catch { /* unsupported */ } }}
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] cursor-pointer"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)', colorScheme: 'dark' }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-600 mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t('passengers')}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRoute((r) => ({ ...r, passengers: n }))}
                    className="flex items-center justify-center w-12 h-10 rounded-xl border text-sm font-600 transition-vl"
                    style={{
                      background: route.passengers === n ? 'rgba(126,255,161,0.12)' : 'var(--bg-elevated)',
                      borderColor: route.passengers === n ? 'var(--accent-volt)' : 'var(--border)',
                      color: route.passengers === n ? 'var(--accent-volt)' : 'var(--text-secondary)',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {showFlight && (
              <div>
                <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {t('flightNumber')}{' '}
                  <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                    ({isRo ? 'opțional' : 'optional'})
                  </span>
                </label>
                <input
                  type="text"
                  placeholder={t('flightNumberPlaceholder')}
                  value={route.flightNumber}
                  onChange={(e) => setRoute((r) => ({ ...r, flightNumber: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] placeholder:text-[var(--text-muted)]"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 text-sm font-600 rounded-full transition-vl hover:opacity-90 active:scale-[0.99]"
              style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
            >
              {t('continue')} →
            </button>
          </div>
        )}

        {/* ── STEP 2: Contact details ───────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Mini route summary */}
            <div
              className="rounded-xl p-3 text-xs"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-volt)', flexShrink: 0 }} />
                <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{route.pickupAddress || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ width: 6, height: 6, borderRadius: 1, background: 'var(--accent-gold)', flexShrink: 0 }} />
                <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{route.dropoffAddress || '—'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t('name')}
              </label>
              <input
                type="text"
                placeholder={t('namePlaceholder')}
                value={contact.customerName}
                onChange={(e) => setContact((c) => ({ ...c, customerName: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] placeholder:text-[var(--text-muted)]"
                style={{ background: 'var(--bg-elevated)', borderColor: fieldErrors.name ? '#ef4444' : 'var(--border)', color: 'var(--text-primary)' }}
              />
              {fieldErrors.name && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t('email')}
              </label>
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                value={contact.customerEmail}
                onChange={(e) => setContact((c) => ({ ...c, customerEmail: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] placeholder:text-[var(--text-muted)]"
                style={{ background: 'var(--bg-elevated)', borderColor: fieldErrors.email ? '#ef4444' : 'var(--border)', color: 'var(--text-primary)' }}
              />
              {fieldErrors.email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t('phone')}
              </label>
              <input
                type="tel"
                placeholder={t('phonePlaceholder')}
                value={contact.customerPhone}
                onChange={(e) => setContact((c) => ({ ...c, customerPhone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] placeholder:text-[var(--text-muted)]"
                style={{ background: 'var(--bg-elevated)', borderColor: fieldErrors.phone ? '#ef4444' : 'var(--border)', color: 'var(--text-primary)' }}
              />
              {fieldErrors.phone && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t('notes')}{' '}
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({isRo ? 'opțional' : 'optional'})</span>
              </label>
              <textarea
                rows={2}
                placeholder={t('notesPlaceholder')}
                value={contact.notes}
                onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] placeholder:text-[var(--text-muted)] resize-none"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => { setStep(1); setFieldErrors({}); }}
                className="flex-1 py-3 text-sm font-500 rounded-full border transition-vl hover:border-[var(--text-muted)]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                ← {t('back')}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-[2] py-3 text-sm font-600 rounded-full transition-vl hover:opacity-90"
                style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
              >
                {isRo ? 'Vezi Prețurile →' : 'See Prices →'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Choose vehicle + prices ──────────────────── */}
        {step === 3 && (
          <div className="space-y-3">
            {/* Route + distance summary */}
            <div
              className="rounded-xl p-3"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1 flex-shrink-0">
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-volt)' }} />
                  <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '2px 0' }} />
                  <div style={{ width: 7, height: 7, borderRadius: 1, background: 'var(--accent-gold)' }} />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{route.pickupAddress}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{route.dropoffAddress}</p>
                </div>
                {distanceKm && durationMinutes && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-600" style={{ color: 'var(--text-primary)' }}>{distanceKm} km</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDuration(durationMinutes)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Loading state */}
            {loadingDistance && (
              <div className="text-xs text-center py-3 rounded-xl" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                <span className="inline-flex items-center gap-2">
                  <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--accent-volt)', animation: 'acSpin 0.7s linear infinite' }} />
                  {isRo ? 'Se calculează prețul...' : 'Calculating prices...'}
                </span>
              </div>
            )}

            {/* No coords warning */}
            {!route.pickupLat && !loadingDistance && !distanceKm && (
              <div
                className="text-xs text-center py-2.5 px-3 rounded-xl"
                style={{ background: 'rgba(229,198,135,0.08)', border: '1px solid rgba(229,198,135,0.2)', color: 'var(--accent-gold)' }}
              >
                {isRo
                  ? '💡 Revino la pasul 1 și selectează adresele din sugestii'
                  : '💡 Go back to step 1 and select addresses from suggestions'}
              </div>
            )}

            {/* Vehicle cards */}
            {FLEET.map((vehicle, index) => {
              const isSelected = selectedVehicle === vehicle.id;
              const breakdown = prices?.[vehicle.id];
              return (
                <div
                  key={vehicle.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedVehicle(vehicle.id)}
                  className="rounded-xl border cursor-pointer transition-vl overflow-hidden"
                  style={{
                    background: isSelected ? 'rgba(126,255,161,0.05)' : 'var(--bg-elevated)',
                    borderColor: isSelected ? 'var(--accent-volt)' : 'var(--border)',
                    outline: 'none',
                  }}
                >
                  <div className="flex items-center gap-3 p-3.5">
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#f0f1f2' }}>
                      <Image src={vehicle.imageUrl} alt={vehicle.name} fill className="object-contain p-0" sizes="80px" priority={index === 0} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-400" style={{ color: 'var(--text-primary)' }}>{vehicle.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {vehicle.maxPassengers} {isRo ? 'pasageri' : 'pax'} · {vehicle.maxLuggage} {isRo ? 'bagaje' : 'bags'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Price */}
                      <div className="text-right">
                        {loadingDistance ? (
                          <div className="h-6 w-14 rounded shimmer" />
                        ) : breakdown ? (
                          <>
                            <span
                              className="font-display text-lg font-400"
                              style={{
                                color: 'var(--accent-gold)',
                                opacity: 0,
                                animation: 'wFadeIn 0.25s ease forwards',
                                animationDelay: `${index * 80}ms`,
                              }}
                            >
                              {formatEur(breakdown.total)}
                            </span>
                            {breakdown.isSameDayReturn && (
                              <p className="text-[10px] mt-0.5" style={{ color: 'var(--accent-volt)' }}>
                                {isRo ? '-€70 retur aceeași zi' : '-€70 same-day return'}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </div>
                      {/* Radio dot */}
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        border: `2px solid ${isSelected ? 'var(--accent-volt)' : 'var(--border)'}`,
                        background: isSelected ? 'var(--accent-volt)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                        {isSelected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0A0A0B' }} />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Trust */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 px-1 py-1">
              {[
                isRo ? '✓ Preț fix' : '✓ Fixed price',
                isRo ? '✓ Anulare gratuită' : '✓ Free cancellation',
                isRo ? '✓ Monitorizare zbor' : '✓ Flight tracking',
              ].map((item) => (
                <span key={item} className="text-xs" style={{ color: 'var(--text-muted)' }}>{item}</span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => { setStep(2); setFieldErrors({}); }}
                className="flex-1 py-3 text-sm font-500 rounded-full border transition-vl hover:border-[var(--text-muted)]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                ← {t('back')}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !selectedVehicle}
                className="flex-[2] py-3 text-sm font-600 rounded-full transition-vl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
              >
                {submitting
                  ? t('calculating')
                  : selectedBreakdown
                  ? `${isRo ? 'Confirmă' : 'Confirm'} · ${formatEur(selectedBreakdown.total)}`
                  : (isRo ? 'Selectează o mașină' : 'Select a vehicle')}
              </button>
            </div>

            <style>{`
              @keyframes wFadeIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
              @keyframes acSpin{to{transform:rotate(360deg)}}
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
