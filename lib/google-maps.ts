export interface DistanceResult {
  distanceKm: number;
  durationMinutes: number;
}

export async function getDistance(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<DistanceResult> {
  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
  url.searchParams.set('origins', `${origin.lat},${origin.lng}`);
  url.searchParams.set('destinations', `${destination.lat},${destination.lng}`);
  url.searchParams.set('mode', 'driving');
  url.searchParams.set('units', 'metric');
  url.searchParams.set('key', process.env.GOOGLE_MAPS_SERVER_KEY!);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.status !== 'OK' || data.rows[0].elements[0].status !== 'OK') {
    throw new Error('Distance calculation failed');
  }
  const element = data.rows[0].elements[0];
  return {
    distanceKm: Math.round((element.distance.value / 1000) * 100) / 100,
    durationMinutes: Math.round(element.duration.value / 60),
  };
}
