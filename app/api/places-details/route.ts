import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get('place_id');
  if (!placeId) return NextResponse.json({ error: 'Missing place_id' }, { status: 400 });

  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) return NextResponse.json({ error: 'Maps key not configured' }, { status: 500 });

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('key', key);
  url.searchParams.set('fields', 'geometry,formatted_address');

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  const data = await res.json();
  return NextResponse.json(data.result ?? {});
}
