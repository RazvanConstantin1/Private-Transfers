import { describe, it, expect } from 'vitest';
import { calculatePrice } from './pricing';

describe('calculatePrice', () => {
  const offPeak = new Date('2026-06-15T11:00:00Z');        // 14:00 Bucharest (summer)
  const peakMorning = new Date('2026-06-15T05:00:00Z');    // 08:00 Bucharest
  const night = new Date('2026-06-14T23:00:00Z');          // 02:00 next day

  it('Tesla one-way 18km off-peak = €48', () => {
    expect(calculatePrice({ vehicleId: 'tesla_model_3', distanceKm: 18, tripType: 'one_way', pickupDateTime: offPeak }).total).toBe(48);
  });
  it('Tesla one-way 125km off-peak = €155', () => {
    expect(calculatePrice({ vehicleId: 'tesla_model_3', distanceKm: 125, tripType: 'one_way', pickupDateTime: offPeak }).total).toBe(155);
  });
  it('Tesla round-trip 170km off-peak = €360', () => {
    expect(calculatePrice({ vehicleId: 'tesla_model_3', distanceKm: 170, tripType: 'round_trip', pickupDateTime: offPeak }).total).toBe(360);
  });
  it('Tesla one-way 440km peak morning = €725', () => {
    expect(calculatePrice({ vehicleId: 'tesla_model_3', distanceKm: 440, tripType: 'one_way', pickupDateTime: peakMorning }).total).toBe(725);
  });
  it('Tesla round-trip 440km off-peak = €1269', () => {
    expect(calculatePrice({ vehicleId: 'tesla_model_3', distanceKm: 440, tripType: 'round_trip', pickupDateTime: offPeak }).total).toBe(1269);
  });
  it('Kona one-way 170km off-peak = €166', () => {
    expect(calculatePrice({ vehicleId: 'hyundai_kona', distanceKm: 170, tripType: 'one_way', pickupDateTime: offPeak }).total).toBe(166);
  });
  it('Capri one-way 170km off-peak = €234', () => {
    expect(calculatePrice({ vehicleId: 'ford_capri', distanceKm: 170, tripType: 'one_way', pickupDateTime: offPeak }).total).toBe(234);
  });
  it('Tesla one-way 18km at 02:00 (night) = €68', () => {
    expect(calculatePrice({ vehicleId: 'tesla_model_3', distanceKm: 18, tripType: 'one_way', pickupDateTime: night }).total).toBe(68);
  });
  it('Capri one-way 440km peak = €857', () => {
    expect(calculatePrice({ vehicleId: 'ford_capri', distanceKm: 440, tripType: 'one_way', pickupDateTime: peakMorning }).total).toBe(857);
  });
});
