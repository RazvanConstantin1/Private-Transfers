import Link from 'next/link';

interface RouteCTAProps {
  route: string;
  locale?: string;
  priceFrom?: number;
  destination?: string;
}

export function RouteCTA({
  route,
  locale = 'en',
  priceFrom,
  destination,
}: RouteCTAProps) {
  return (
    <div
      className="rounded-xl border p-5 my-6 flex items-center justify-between gap-4 flex-wrap"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--accent-volt)' }}
    >
      <div>
        <p className="font-500 text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
          Private transfer{destination ? ` to ${destination}` : ''}
        </p>
        {priceFrom && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            From €{priceFrom} · Fixed price · English driver
          </p>
        )}
      </div>
      <Link
        href={`/${locale}/intercity/${route}`}
        className="shrink-0 px-5 py-2.5 text-sm font-600 rounded-full transition-vl hover:opacity-90"
        style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
      >
        Book Transfer →
      </Link>
    </div>
  );
}
