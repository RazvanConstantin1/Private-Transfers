export type VehicleId = 'hyundai_kona' | 'tesla_model_3' | 'ford_capri';

export interface Vehicle {
  id: VehicleId;
  name: string;
  tagline: { en: string; ro: string };
  pricePerKm: number;
  maxPassengers: number;
  maxLuggage: number;
  rangeKm: number;
  features: { en: string[]; ro: string[] };
  imageUrl: string;
}

export const FLEET: Vehicle[] = [
  {
    id: 'hyundai_kona',
    name: 'Hyundai Kona Electric',
    tagline: { en: 'Efficient · Smart Choice', ro: 'Eficient · Alegerea Smart' },
    pricePerKm: 0.8,
    maxPassengers: 4,
    maxLuggage: 2,
    rangeKm: 484,
    features: {
      en: ['Climate control', 'USB-C charging', 'Bottled water', 'Quiet ride'],
      ro: ['Climatizare', 'Încărcare USB-C', 'Apă plată', 'Cabină silențioasă'],
    },
    imageUrl: '/fleet/hyundai-kona.jpg',
  },
  {
    id: 'tesla_model_3',
    name: 'Tesla Model 3 Long Range',
    tagline: { en: 'Signature · Premium Experience', ro: 'Signature · Experiență Premium' },
    pricePerKm: 1.0,
    maxPassengers: 4,
    maxLuggage: 3,
    rangeKm: 580,
    features: {
      en: ['Premium interior', 'Autopilot safety', 'WiFi onboard', 'Glass roof', 'Bottled water'],
      ro: ['Interior premium', 'Autopilot pentru siguranță', 'WiFi la bord', 'Plafon de sticlă', 'Apă plată'],
    },
    imageUrl: '/fleet/tesla-model-3.jpg',
  },
  {
    id: 'ford_capri',
    name: 'Ford Capri',
    tagline: { en: 'Spacious · Top-Tier SUV', ro: 'Spațios · SUV Top-Tier' },
    pricePerKm: 1.2,
    maxPassengers: 4,
    maxLuggage: 4,
    rangeKm: 627,
    features: {
      en: ['Premium SUV interior', 'Extra legroom', 'Large luggage capacity', 'WiFi onboard', 'Bottled water'],
      ro: ['Interior SUV premium', 'Spațiu extra pentru picioare', 'Capacitate mare bagaje', 'WiFi la bord', 'Apă plată'],
    },
    imageUrl: '/fleet/ford-capri.jpg',
  },
];

export function getVehicle(id: VehicleId): Vehicle {
  const v = FLEET.find((v) => v.id === id);
  if (!v) throw new Error(`Unknown vehicle: ${id}`);
  return v;
}
