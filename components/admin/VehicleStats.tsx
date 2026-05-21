'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export interface VehicleStat {
  vehicle_id: string;
  name: string;
  trips: number;
  revenue: number;
  avg: number;
  pending: number;
}

export interface OverallStat {
  total: number;
  revenue: number;
  pending: number;
  avgPrice: number;
}

const COLORS: Record<string, string> = {
  tesla_model_3: '#7EFFA1',
  hyundai_kona: '#60a5fa',
  ford_capri: '#E5C687',
};

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-1"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <span
        className="text-xs font-600 uppercase tracking-widest"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
      >
        {label}
      </span>
      <span className="font-display text-2xl font-400" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
      {sub && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</span>}
    </div>
  );
}

// Short vehicle label for chart legend
function shortName(vehicle_id: string) {
  if (vehicle_id === 'tesla_model_3') return 'Tesla Model 3';
  if (vehicle_id === 'hyundai_kona') return 'Hyundai Kona';
  if (vehicle_id === 'ford_capri') return 'Ford Capri';
  return vehicle_id;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-xl border px-4 py-3 text-sm shadow-lg"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
    >
      <p className="font-600 mb-1">{d.name}</p>
      <p style={{ color: 'var(--text-muted)' }}>Trips: <span style={{ color: 'var(--text-primary)' }}>{d.trips}</span></p>
      <p style={{ color: 'var(--text-muted)' }}>Revenue: <span style={{ color: 'var(--accent-gold)' }}>€{d.revenue.toLocaleString('en', { maximumFractionDigits: 0 })}</span></p>
      {d.trips > 0 && <p style={{ color: 'var(--text-muted)' }}>Avg: <span style={{ color: 'var(--text-primary)' }}>€{d.avg.toFixed(0)}</span></p>}
    </div>
  );
}

export default function VehicleStats({ overall, vehicles }: { overall: OverallStat; vehicles: VehicleStat[] }) {
  const hasData = vehicles.some((v) => v.trips > 0);
  const hasRevenue = vehicles.some((v) => v.revenue > 0);

  const tripsData = vehicles
    .filter((v) => v.trips > 0)
    .map((v) => ({ ...v, name: shortName(v.vehicle_id), value: v.trips }));

  const revenueData = vehicles
    .filter((v) => v.revenue > 0)
    .map((v) => ({ ...v, name: shortName(v.vehicle_id), value: v.revenue }));

  return (
    <div className="mb-8">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Trips" value={String(overall.total)} sub="excl. cancelled" />
        <StatCard
          label="Revenue"
          value={`€${overall.revenue.toLocaleString('en', { maximumFractionDigits: 0 })}`}
          sub="excl. cancelled"
        />
        <StatCard label="Pending" value={String(overall.pending)} sub="awaiting action" />
        <StatCard
          label="Avg Price"
          value={overall.avgPrice > 0 ? `€${overall.avgPrice.toFixed(0)}` : '—'}
          sub="per booking"
        />
      </div>

      {/* Pie charts */}
      {!hasData ? (
        <div
          className="rounded-2xl border px-6 py-12 text-center"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          No trip data yet.
        </div>
      ) : (
        <div
          className="rounded-2xl border p-5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2
            className="text-xs font-600 uppercase tracking-widest mb-6"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
          >
            Fleet Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trips pie */}
            <div>
              <p className="text-xs font-600 text-center mb-4" style={{ color: 'var(--text-muted)' }}>
                TRIPS BY VEHICLE
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={tripsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {tripsData.map((entry) => (
                      <Cell key={entry.vehicle_id} fill={COLORS[entry.vehicle_id] || '#7EFFA1'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue pie */}
            <div>
              <p className="text-xs font-600 text-center mb-4" style={{ color: 'var(--text-muted)' }}>
                REVENUE BY VEHICLE
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={hasRevenue ? revenueData : tripsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {(hasRevenue ? revenueData : tripsData).map((entry) => (
                      <Cell key={entry.vehicle_id} fill={COLORS[entry.vehicle_id] || '#7EFFA1'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-vehicle summary row */}
          <div className="mt-6 pt-5 border-t grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ borderColor: 'var(--border)' }}>
            {vehicles.map((v) => (
              <div key={v.vehicle_id} className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: COLORS[v.vehicle_id] || '#7EFFA1' }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-600 truncate" style={{ color: 'var(--text-primary)' }}>
                    {shortName(v.vehicle_id)}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {v.trips} trip{v.trips !== 1 ? 's' : ''} ·{' '}
                    <span style={{ color: 'var(--accent-gold)' }}>
                      €{v.revenue.toLocaleString('en', { maximumFractionDigits: 0 })}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
