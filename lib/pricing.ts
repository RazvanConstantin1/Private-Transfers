import { VehicleId, getVehicle } from './fleet';

export type TripType = 'one_way' | 'round_trip';

export interface PriceInput {
  vehicleId: VehicleId;
  distanceKm: number;
  tripType: TripType;
  pickupDateTime: Date;
  returnDateTime?: Date;
}

export interface PriceBreakdown {
  vehicleId: VehicleId;
  pricePerKm: number;
  basePrice: number;
  roundTripMultiplier: number;
  longDistanceMultiplier: number;
  peakSurcharge: number;
  sameDayDiscount: number;
  subtotal: number;
  total: number;
  isPeakHour: boolean;
  isLongDistance: boolean;
  isSameDayReturn: boolean;
}

const BASE_FEE_EUR = 30;
const ROUND_TRIP_MULTIPLIER = 1.8;
const LONG_DISTANCE_THRESHOLD_KM = 250;
const LONG_DISTANCE_MULTIPLIER = 1.5;
const PEAK_SURCHARGE_EUR = 20;
const SAME_DAY_RETURN_DISCOUNT_EUR = 70;

function isSameCalendarDay(a: Date, b: Date): boolean {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  return fmt(a) === fmt(b);
}

/**
 * Peak hours in Europe/Bucharest:
 * 07:00–09:00 morning rush, 16:00–20:00 evening rush, 00:00–06:00 night premium
 */
export function isPeakHour(date: Date): boolean {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Bucharest',
    hour: 'numeric',
    hour12: false,
  });
  const hour = parseInt(formatter.format(date), 10);
  return (
    (hour >= 7 && hour < 9) ||
    (hour >= 16 && hour < 20) ||
    (hour >= 0 && hour < 6)
  );
}

export function calculatePrice(input: PriceInput): PriceBreakdown {
  const { vehicleId, distanceKm, tripType, pickupDateTime, returnDateTime } = input;
  const vehicle = getVehicle(vehicleId);

  const basePrice = BASE_FEE_EUR + vehicle.pricePerKm * distanceKm;
  const roundTripMultiplier = tripType === 'round_trip' ? ROUND_TRIP_MULTIPLIER : 1.0;
  const isLongDistance = distanceKm > LONG_DISTANCE_THRESHOLD_KM;
  const longDistanceMultiplier = isLongDistance ? LONG_DISTANCE_MULTIPLIER : 1.0;
  const peak = isPeakHour(pickupDateTime);
  const peakSurcharge = peak ? PEAK_SURCHARGE_EUR : 0;

  const sameDayReturn =
    tripType === 'round_trip' &&
    returnDateTime != null &&
    isSameCalendarDay(pickupDateTime, returnDateTime);
  const sameDayDiscount = sameDayReturn ? SAME_DAY_RETURN_DISCOUNT_EUR : 0;

  const subtotal = basePrice * roundTripMultiplier * longDistanceMultiplier;
  const total = Math.round(subtotal + peakSurcharge - sameDayDiscount);

  return {
    vehicleId,
    pricePerKm: vehicle.pricePerKm,
    basePrice,
    roundTripMultiplier,
    longDistanceMultiplier,
    peakSurcharge,
    sameDayDiscount,
    subtotal,
    total,
    isPeakHour: peak,
    isLongDistance,
    isSameDayReturn: sameDayReturn,
  };
}

export function calculateAllPrices(
  input: Omit<PriceInput, 'vehicleId'>
): Record<VehicleId, PriceBreakdown> {
  return {
    hyundai_kona: calculatePrice({ ...input, vehicleId: 'hyundai_kona' }),
    tesla_model_3: calculatePrice({ ...input, vehicleId: 'tesla_model_3' }),
    ford_capri: calculatePrice({ ...input, vehicleId: 'ford_capri' }),
  };
}
