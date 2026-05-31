import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ pageKey: 'contact', locale, path: '/contact' });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h1
          className="font-display text-4xl md:text-5xl font-300 tracking-tight mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Contact
        </h1>
        <p className="text-lg mb-12" style={{ color: 'var(--text-secondary)' }}>
          We respond to all enquiries within 1 hour during operating hours (06:00–23:00 Bucharest time).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="https://wa.me/40700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border p-6 flex flex-col gap-3 transition-vl hover:border-[#25D366] group"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="text-3xl">💬</div>
            <h3 className="font-display text-xl font-400" style={{ color: 'var(--text-primary)' }}>WhatsApp</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Fastest response. Chat in English or Romanian.
            </p>
            <span className="text-sm font-600 transition-vl group-hover:text-[#25D366]" style={{ color: 'var(--text-muted)' }}>
              +40 7XX XXX XXX →
            </span>
          </a>

          <a
            href="mailto:hello@voltlane.com"
            className="rounded-2xl border p-6 flex flex-col gap-3 transition-vl hover:border-[var(--accent-volt)] group"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="text-3xl">✉️</div>
            <h3 className="font-display text-xl font-400" style={{ color: 'var(--text-primary)' }}>Email</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              For detailed enquiries, custom routes, and corporate requests.
            </p>
            <span className="text-sm font-600 transition-vl group-hover:text-[var(--accent-volt)]" style={{ color: 'var(--text-muted)' }}>
              hello@voltlane.com →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
