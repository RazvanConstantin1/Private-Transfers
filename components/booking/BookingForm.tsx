'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import type { VehicleId } from '@/lib/fleet';
import { calculateAllPrices, type PriceBreakdown } from '@/lib/pricing';
import { formatEur } from '@/lib/utils';
import AddressAutocomplete from './AddressAutocomplete';
import VehicleSelector from './VehicleSelector';
import DateTimePicker from './DateTimePicker';
import { toast } from 'sonner';

interface AddressValue {
  address: string;
  lat: number;
  lng: number;
  placeId: string;
}

const schema = z.object({
  tripType: z.enum(['one_way', 'round_trip']),
  pickupAddress: z.string().min(3, 'Pickup address required'),
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffAddress: z.string().min(3, 'Dropoff address required'),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  pickupDatetime: z.string().min(1, 'Date and time required'),
  returnDatetime: z.string().optional(),
  passengers: z.number().int().min(1).max(4),
  flightNumber: z.string().optional(),
  vehicleId: z.enum(['hyundai_kona', 'tesla_model_3', 'ford_capri']),
  customerName: z.string().min(2, 'Name required (min 2 chars)'),
  customerEmail: z.string().email('Valid email required'),
  customerPhone: z.string().refine((v) => {
    try { return isValidPhoneNumber(v, 'RO'); } catch { return false; }
  }, 'Valid phone number required'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const distanceCache = new Map<string, { distanceKm: number; durationMinutes: number }>();

function isAirport(address: string) {
  return /otopeni|henri coan[dă]|OTP/i.test(address);
}

function getMinDatetime(base?: Date, offsetHours = 2): string {
  const d = new Date((base || new Date()).getTime() + offsetHours * 3600 * 1000);
  return d.toISOString().slice(0, 16);
}

export default function BookingForm() {
  const t = useTranslations('booking');
  const locale = useLocale();
  const router = useRouter();

  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [loadingDistance, setLoadingDistance] = useState(false);
  const [prices, setPrices] = useState<Record<VehicleId, PriceBreakdown> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tripType: 'one_way',
      passengers: 2,
      pickupLat: 0,
      pickupLng: 0,
      dropoffLat: 0,
      dropoffLng: 0,
    },
  });

  const tripType = watch('tripType');
  const pickupAddress = watch('pickupAddress');
  const dropoffAddress = watch('dropoffAddress');
  const pickupLat = watch('pickupLat');
  const pickupLng = watch('pickupLng');
  const dropoffLat = watch('dropoffLat');
  const dropoffLng = watch('dropoffLng');
  const pickupDatetime = watch('pickupDatetime');
  const vehicleId = watch('vehicleId');

  const showFlight = pickupAddress && dropoffAddress &&
    (isAirport(pickupAddress) || isAirport(dropoffAddress));

  // Fetch distance when both addresses are set
  const fetchDistance = useCallback(async (
    oLat: number, oLng: number,
    dLat: number, dLng: number,
  ) => {
    const cacheKey = `${oLat.toFixed(6)},${oLng.toFixed(6)}-${dLat.toFixed(6)},${dLng.toFixed(6)}`;
    if (distanceCache.has(cacheKey)) {
      const cached = distanceCache.get(cacheKey)!;
      setDistanceKm(cached.distanceKm);
      setDurationMinutes(cached.durationMinutes);
      return cached;
    }

    setLoadingDistance(true);
    try {
      const res = await fetch('/api/distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: { lat: oLat, lng: oLng },
          destination: { lat: dLat, lng: dLng },
        }),
      });
      if (!res.ok) throw new Error('Distance API error');
      const data = await res.json();
      distanceCache.set(cacheKey, data);
      setDistanceKm(data.distanceKm);
      setDurationMinutes(data.durationMinutes);
      return data;
    } catch {
      toast.error('Could not calculate distance. Please check addresses.');
      return null;
    } finally {
      setLoadingDistance(false);
    }
  }, []);

  // Debounced distance fetch
  useEffect(() => {
    if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng, fetchDistance]);

  // Recalculate prices when distance or datetime changes
  useEffect(() => {
    if (!distanceKm || !pickupDatetime) { setPrices(null); return; }
    const breakdown = calculateAllPrices({
      distanceKm,
      tripType,
      pickupDateTime: new Date(pickupDatetime),
    });
    setPrices(breakdown);
  }, [distanceKm, pickupDatetime, tripType]);

  // Show customer info when vehicle selected
  useEffect(() => {
    if (vehicleId) setShowCustomerInfo(true);
  }, [vehicleId]);

  const onSubmit = async (values: FormValues) => {
    if (!prices || !distanceKm || !durationMinutes) {
      toast.error(t('errors.priceMismatch'));
      return;
    }
    const selectedPrice = prices[values.vehicleId];
    setSubmitting(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_address: values.pickupAddress,
          pickup_lat: values.pickupLat,
          pickup_lng: values.pickupLng,
          pickup_datetime: new Date(values.pickupDatetime).toISOString(),
          dropoff_address: values.dropoffAddress,
          dropoff_lat: values.dropoffLat,
          dropoff_lng: values.dropoffLng,
          vehicle_id: values.vehicleId,
          passengers: values.passengers,
          trip_type: values.tripType,
          return_datetime: values.returnDatetime
            ? new Date(values.returnDatetime).toISOString()
            : null,
          client_total: selectedPrice.total,
          customer_name: values.customerName,
          customer_email: values.customerEmail,
          customer_phone: values.customerPhone,
          flight_number: values.flightNumber || null,
          notes: values.notes || null,
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400 && data.server_total) {
          toast.error(`Price updated to €${data.server_total}. Please review and resubmit.`);
        } else {
          toast.error(data.error || t('errors.bookingFailed'));
        }
        return;
      }
      router.push(`/${locale}/booking/success?id=${data.id}`);
    } catch {
      toast.error(t('errors.bookingFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBreakdown = vehicleId && prices ? prices[vehicleId] : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 items-start">
        {/* LEFT: form fields */}
        <div className="space-y-6">
          {/* Trip type */}
          <fieldset>
            <legend
              className="text-sm font-600 mb-3 block"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('tripType')}
            </legend>
            <div className="flex gap-3">
              {(['one_way', 'round_trip'] as const).map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    value={type}
                    {...register('tripType')}
                    className="sr-only"
                  />
                  <span
                    className="px-5 py-2.5 text-sm font-500 rounded-full border transition-vl cursor-pointer"
                    style={{
                      background: tripType === type ? 'var(--accent-volt)' : 'var(--bg-elevated)',
                      borderColor: tripType === type ? 'var(--accent-volt)' : 'var(--border)',
                      color: tripType === type ? '#0A0A0B' : 'var(--text-secondary)',
                    }}
                  >
                    {t(type === 'one_way' ? 'oneWay' : 'roundTrip')}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Pickup */}
          <div>
            <label htmlFor="pickup" className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
              {t('pickup')}
            </label>
            <AddressAutocomplete
              id="pickup"
              placeholder={t('pickupPlaceholder')}
              value={pickupAddress}
              onSelect={(place) => {
                setValue('pickupAddress', place.address, { shouldValidate: true });
                setValue('pickupLat', place.lat);
                setValue('pickupLng', place.lng);
              }}
              aria-label={t('pickup')}
            />
            {errors.pickupAddress && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.pickupAddress.message}</p>
            )}
          </div>

          {/* Dropoff */}
          <div>
            <label htmlFor="dropoff" className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
              {t('dropoff')}
            </label>
            <AddressAutocomplete
              id="dropoff"
              placeholder={t('dropoffPlaceholder')}
              value={dropoffAddress}
              onSelect={(place) => {
                setValue('dropoffAddress', place.address, { shouldValidate: true });
                setValue('dropoffLat', place.lat);
                setValue('dropoffLng', place.lng);
              }}
              aria-label={t('dropoff')}
            />
            {errors.dropoffAddress && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.dropoffAddress.message}</p>
            )}
          </div>

          {/* Pickup datetime */}
          <div>
            <label htmlFor="pickupDatetime" className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
              {t('pickupDate')}
            </label>
            <Controller
              name="pickupDatetime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  id="pickupDatetime"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  min={getMinDatetime()}
                  placeholder={t('pickupDate')}
                  hasError={!!errors.pickupDatetime}
                />
              )}
            />
            {errors.pickupDatetime && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.pickupDatetime.message}</p>
            )}
          </div>

          {/* Return datetime (round trip only) */}
          {tripType === 'round_trip' && (
            <div>
              <label htmlFor="returnDatetime" className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
                {t('returnDate')}
              </label>
              <Controller
                name="returnDatetime"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    id="returnDatetime"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    min={pickupDatetime ? getMinDatetime(new Date(pickupDatetime), 1) : getMinDatetime()}
                    placeholder={t('returnDate')}
                  />
                )}
              />
            </div>
          )}

          {/* Passengers */}
          <div>
            <label className="block text-sm font-600 mb-3" style={{ color: 'var(--text-secondary)' }}>
              {t('passengers')}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <label key={n} className="cursor-pointer">
                  <Controller
                    name="passengers"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="radio"
                        value={n}
                        checked={field.value === n}
                        onChange={() => field.onChange(n)}
                        className="sr-only"
                      />
                    )}
                  />
                  <span
                    className="flex items-center justify-center w-12 h-12 rounded-xl border text-sm font-600 transition-vl cursor-pointer"
                    style={{
                      background: watch('passengers') === n ? 'var(--accent-volt)' : 'var(--bg-elevated)',
                      borderColor: watch('passengers') === n ? 'var(--accent-volt)' : 'var(--border)',
                      color: watch('passengers') === n ? '#0A0A0B' : 'var(--text-secondary)',
                    }}
                  >
                    {n}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Flight number (airport only) */}
          {showFlight && (
            <div>
              <label htmlFor="flightNumber" className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
                {t('flightNumber')}
              </label>
              <input
                id="flightNumber"
                type="text"
                placeholder={t('flightNumberPlaceholder')}
                {...register('flightNumber')}
                className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] placeholder:text-[var(--text-muted)]"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          )}

          {/* Customer info — revealed after vehicle selection */}
          {showCustomerInfo && (
            <div
              className="space-y-5 pt-6 border-t"
              style={{ borderColor: 'var(--border-soft)' }}
            >
              {/* Name */}
              <div>
                <label htmlFor="customerName" className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {t('name')}
                </label>
                <input
                  id="customerName"
                  type="text"
                  placeholder={t('namePlaceholder')}
                  {...register('customerName')}
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] placeholder:text-[var(--text-muted)]"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: errors.customerName ? '#ef4444' : 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                {errors.customerName && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.customerName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="customerEmail" className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {t('email')}
                </label>
                <input
                  id="customerEmail"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  {...register('customerEmail')}
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] placeholder:text-[var(--text-muted)]"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: errors.customerEmail ? '#ef4444' : 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                {errors.customerEmail && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.customerEmail.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {t('phone')}
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  placeholder={t('phonePlaceholder')}
                  {...register('customerPhone')}
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] placeholder:text-[var(--text-muted)]"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: errors.customerPhone ? '#ef4444' : 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                {errors.customerPhone && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.customerPhone.message}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {t('notes')}
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder={t('notesPlaceholder')}
                  {...register('notes')}
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] placeholder:text-[var(--text-muted)] resize-none"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 text-base font-600 rounded-full transition-vl hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
              >
                {submitting
                  ? t('calculating')
                  : `${t('submit')}${selectedBreakdown ? selectedBreakdown.total : '...'}`}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: vehicle selector (sticky) */}
        <div className="lg:sticky lg:top-24">
          <h2
            className="text-sm font-600 mb-4 uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
          >
            {t('selectVehicle')}
          </h2>
          <Controller
            name="vehicleId"
            control={control}
            render={({ field }) => (
              <VehicleSelector
                prices={prices}
                selectedId={field.value || null}
                onSelect={(id) => field.onChange(id)}
                loading={loadingDistance}
                distanceKm={distanceKm || undefined}
                durationMinutes={durationMinutes || undefined}
              />
            )}
          />
          {errors.vehicleId && (
            <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{t('errors.vehicleRequired')}</p>
          )}
          {distanceKm && !loadingDistance && (
            <p
              className="text-xs mt-3 text-center"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
            >
              {distanceKm} km · {durationMinutes && Math.round(durationMinutes / 60)}h {durationMinutes && durationMinutes % 60}min driving
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
