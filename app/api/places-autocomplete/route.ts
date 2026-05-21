import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get('input') ?? '';
  if (input.length < 2) return NextResponse.json({ predictions: [] });

  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) return NextResponse.json({ predictions: [], error: 'Maps key not configured' });

  const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
  url.searchParams.set('input', input);
  url.searchParams.set('key', key);
  url.searchParams.set('components', 'country:ro');
  url.searchParams.set('language', 'ro');

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  const data = await res.json();
  return NextResponse.json({ predictions: data.predictions ?? [] });
}
