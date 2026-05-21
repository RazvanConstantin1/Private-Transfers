import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FLEET } from '@/lib/fleet';

export const metadata: Metadata = {
  title: 'Our Electric Fleet — VOLTLANE',
  description: 'Three premium electric vehicles: Hyundai Kona, Tesla Model 3 Long Range, and Ford Capri. Fixed pricing from €0.80/km.',
};

export default async function FleetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <h1
            className="font-display text-4xl md:text-6xl font-300 tracking-tight mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Our Fleet
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Three fully electric vehicles. One standard of service.
          </p>
        </div>

        <div className="space-y-8">
          {FLEET.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-2xl border overflow-hidden"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-[4/3] relative">
                  <Image src={vehicle.imageUrl} alt={vehicle.name} fill className="object-cover" />
                </div>
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-400 mb-2" style={{ color: 'var(--text-primary)' }}>
                      {vehicle.name}
                    </h2>
                    <p className="text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
                      {vehicle.tagline.en}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'Passengers', value: vehicle.maxPassengers },
                        { label: 'Luggage', value: vehicle.maxLuggage },
                        { label: 'Range', value: `${vehicle.rangeKm} km` },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <p className="text-2xl font-display font-300" style={{ color: 'var(--accent-gold)' }}>{stat.value}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {vehicle.features.en.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--accent-volt)' }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>from </span>
                      <span className="font-display text-2xl" style={{ color: 'var(--accent-gold)' }}>€{vehicle.pricePerKm}</span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/km</span>
                    </div>
                    <Link
                      href={`/${locale}/booking`}
                      className="px-6 py-2.5 text-sm font-600 rounded-full transition-vl hover:opacity-90"
                      style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
