import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createServiceClient } from '@/lib/supabase/server';

const schema = z.object({
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_phone: z.string().min(7),
  pickup_address: z.string().min(3),
  dropoff_address: z.string().min(3),
  pickup_datetime: z.string().datetime(),
  return_datetime: z.string().datetime().nullable().optional(),
  vehicle_id: z.enum(['hyundai_kona', 'tesla_model_3', 'ford_capri']),
  passengers: z.number().int().min(1).max(4),
  trip_type: z.enum(['one_way', 'round_trip']),
  total_price_eur: z.number().positive(),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).default('pending'),
  flight_number: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  locale: z.enum(['en', 'ro']).default('en'),
});

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && user.email !== adminEmail) return false;
  return true;
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });

  const d = parsed.data;
  const supabase = createServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: booking, error } = await (supabase as any).from('bookings').insert({
    pickup_address: d.pickup_address,
    pickup_lat: 0, pickup_lng: 0,
    pickup_datetime: d.pickup_datetime,
    dropoff_address: d.dropoff_address,
    dropoff_lat: 0, dropoff_lng: 0,
    vehicle_id: d.vehicle_id,
    passengers: d.passengers,
    trip_type: d.trip_type,
    return_datetime: d.return_datetime ?? null,
    distance_km: 0, duration_minutes: 0,
    price_per_km: 0, base_price_eur: d.total_price_eur,
    round_trip_multiplier: 1, long_distance_multiplier: 1, peak_surcharge_eur: 0,
    total_price_eur: d.total_price_eur,
    is_peak_hour: false,
    customer_name: d.customer_name,
    customer_email: d.customer_email,
    customer_phone: d.customer_phone,
    flight_number: d.flight_number ?? null,
    notes: d.notes ?? null,
    status: d.status,
    locale: d.locale,
    confirmed_at: d.status === 'confirmed' ? new Date().toISOString() : null,
    cancelled_at: d.status === 'cancelled' ? new Date().toISOString() : null,
  }).select().single();

  if (error || !booking) {
    console.error('Admin insert error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }

  return NextResponse.json({ id: booking.id });
}
