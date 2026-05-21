'use client';

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

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-1"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <span className="text-xs font-600 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
        {label}
      </span>
      <span className="font-display text-2xl font-400" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
      {sub && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</span>}
    </div>
  );
}

const VEHICLE_COLORS: Record<string, string> = {
  tesla_model_3: '#7EFFA1',
  hyundai_kona: '#60a5fa',
  ford_capri: '#E5C687',
};

export default function VehicleStats({ overall, vehicles }: { overall: OverallStat; vehicles: VehicleStat[] }) {
  const maxRevenue = Math.max(...vehicles.map((v) => v.revenue), 1);
  const maxTrips = Math.max(...vehicles.map((v) => v.trips), 1);

  return (
    <div className="mb-8">
      {/* Overall cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Trips" value={String(overall.total)} sub="all time" />
        <StatCard label="Revenue" value={`€${overall.revenue.toLocaleString('en', { maximumFractionDigits: 0 })}`} sub="excl. cancelled" />
        <StatCard label="Pending" value={String(overall.pending)} sub="awaiting action" />
        <StatCard label="Avg Price" value={overall.avgPrice > 0 ? `€${overall.avgPrice.toFixed(0)}` : '—'} sub="per booking" />
      </div>

      {/* Vehicle breakdown */}
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-xs font-600 uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
          Fleet Performance
        </h2>

        <div className="space-y-6">
          {vehicles.map((v) => {
            const color = VEHICLE_COLORS[v.vehicle_id] || '#7EFFA1';
            const revPct = maxRevenue > 0 ? (v.revenue / maxRevenue) * 100 : 0;
            const tripPct = maxTrips > 0 ? (v.trips / maxTrips) * 100 : 0;

            return (
              <div key={v.vehicle_id}>
                {/* Vehicle header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    <span className="text-sm font-600" style={{ color: 'var(--text-primary)' }}>
                      {v.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{v.trips} trip{v.trips !== 1 ? 's' : ''}</span>
                    <span className="font-display text-sm" style={{ color: 'var(--accent-gold)' }}>
                      €{v.revenue.toLocaleString('en', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Revenue bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-14 shrink-0" style={{ color: 'var(--text-muted)' }}>Revenue</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${revPct}%`, background: color, opacity: 0.85 }}
                      />
                    </div>
                    <span className="text-xs w-10 text-right shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {revPct.toFixed(0)}%
                    </span>
                  </div>

                  {/* Trips bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-14 shrink-0" style={{ color: 'var(--text-muted)' }}>Trips</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${tripPct}%`, background: color, opacity: 0.5 }}
                      />
                    </div>
                    <span className="text-xs w-10 text-right shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {tripPct.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Avg price */}
                {v.trips > 0 && (
                  <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                    avg €{v.avg.toFixed(0)} · {v.pending > 0 ? `${v.pending} pending` : 'no pending'}
                  </p>
                )}
              </div>
            );
          })}

          {vehicles.every((v) => v.trips === 0) && (
            <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
              No completed trips yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
