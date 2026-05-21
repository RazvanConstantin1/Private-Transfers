import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDistance } from '@/lib/google-maps';
import { calculatePrice } from '@/lib/pricing';
import { sendBookingEmails } from '@/lib/email';
import { createServiceClient } from '@/lib/supabase/server';

const bookingSchema = z.object({
  pickup_address: z.string().min(3),
  pickup_lat: z.number(),
  pickup_lng: z.number(),
  pickup_datetime: z.string().datetime(),
  dropoff_address: z.string().min(3),
  dropoff_lat: z.number(),
  dropoff_lng: z.number(),
  vehicle_id: z.enum(['hyundai_kona', 'tesla_model_3', 'ford_capri']),
  passengers: z.number().int().min(1).max(4),
  trip_type: z.enum(['one_way', 'round_trip']),
  return_datetime: z.string().datetime().nullable().optional(),
  client_total: z.number(),
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_phone: z.string().min(7),
  flight_number: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  locale: z.enum(['en', 'ro']).default('en'),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking data', details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Server-side distance re-verification
  let distanceResult: { distanceKm: number; durationMinutes: number };
  try {
    distanceResult = await getDistance(
      { lat: data.pickup_lat, lng: data.pickup_lng },
      { lat: data.dropoff_lat, lng: data.dropoff_lng }
    );
  } catch {
    return NextResponse.json({ error: 'Could not verify route distance' }, { status: 502 });
  }

  // Server-side price re-calculation
  const priceBreakdown = calculatePrice({
    vehicleId: data.vehicle_id,
    distanceKm: distanceResult.distanceKm,
    tripType: data.trip_type,
    pickupDateTime: new Date(data.pickup_datetime),
  });

  // Price mismatch check
  if (Math.abs(priceBreakdown.total - data.client_total) > 5) {
    return NextResponse.json(
      { error: 'Price mismatch', server_total: priceBreakdown.total, client_total: data.client_total },
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: booking, error } = await (supabase as any)
    .from('bookings')
    .insert({
      pickup_address: data.pickup_address,
      pickup_lat: data.pickup_lat,
      pickup_lng: data.pickup_lng,
      pickup_datetime: data.pickup_datetime,
      dropoff_address: data.dropoff_address,
      dropoff_lat: data.dropoff_lat,
      dropoff_lng: data.dropoff_lng,
      vehicle_id: data.vehicle_id,
      passengers: data.passengers,
      trip_type: data.trip_type,
      return_datetime: data.return_datetime ?? null,
      distance_km: distanceResult.distanceKm,
      duration_minutes: distanceResult.durationMinutes,
      price_per_km: priceBreakdown.pricePerKm,
      base_price_eur: priceBreakdown.basePrice,
      round_trip_multiplier: priceBreakdown.roundTripMultiplier,
      long_distance_multiplier: priceBreakdown.longDistanceMultiplier,
      peak_surcharge_eur: priceBreakdown.peakSurcharge,
      total_price_eur: priceBreakdown.total,
      is_peak_hour: priceBreakdown.isPeakHour,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      flight_number: data.flight_number ?? null,
      notes: data.notes ?? null,
      status: 'pending',
      locale: data.locale,
    })
    .select()
    .single();

  if (error || !booking) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
  }

  // Send emails (non-blocking — don't fail booking if email fails)
  sendBookingEmails(booking).catch((err) => console.error('Email send error:', err));

  return NextResponse.json({ id: booking.id, status: 'pending' });
}
