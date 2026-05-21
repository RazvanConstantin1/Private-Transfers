import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ROUTES_DIR = path.join(process.cwd(), 'content/routes');

interface RouteParams {
  locale: string;
  route: string;
}

function getRouteContent(slug: string) {
  const file = path.join(ROUTES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf-8');
  const { data, content } = matter(raw);
  return { frontmatter: data, content };
}

export async function generateStaticParams() {
  const slugs = fs.readdirSync(ROUTES_DIR).map((f) => f.replace('.md', ''));
  return ['en', 'ro'].flatMap((locale) =>
    slugs.map((route) => ({ locale, route }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { route } = await params;
  const data = getRouteContent(route);
  if (!data) return {};
  return {
    title: data.frontmatter.title,
    description: data.frontmatter.description,
  };
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^# (.+)$/gm, '<h1 class="font-display text-4xl font-300 mb-6 mt-0" style="color:var(--text-primary)">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="font-display text-2xl font-400 mb-4 mt-12" style="color:var(--text-primary)">$2</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="font-600 text-lg mb-3 mt-8" style="color:var(--text-primary)">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="mb-1">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul class="list-disc pl-6 mb-4 space-y-1" style="color:var(--text-secondary)">${m}</ul>`)
    .replace(/^\|(.+)\|$/gm, (line) => {
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      return `<tr>${cells.map((c) => `<td class="px-4 py-2 text-sm border-b" style="border-color:var(--border-soft);color:var(--text-secondary)">${c}</td>`).join('')}</tr>`;
    })
    .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (m) => `<div class="overflow-x-auto mb-6"><table class="w-full border-collapse rounded-xl overflow-hidden" style="border:1px solid var(--border)">${m}</table></div>`)
    .replace(/^(?!<[h|u|l|t|d]|$)(.+)$/gm, '<p class="mb-4 leading-relaxed" style="color:var(--text-secondary)">$1</p>');
}

export default async function RoutePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { route, locale } = await params;
  const data = getRouteContent(route);
  if (!data) notFound();

  const { frontmatter: fm, content } = data;
  const html = renderMarkdown(content);

  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          <Link href={`/${locale}`} className="hover:text-[var(--text-secondary)] transition-vl">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/intercity`} className="hover:text-[var(--text-secondary)] transition-vl">Intercity</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{fm.city}</span>
        </nav>

        {/* Meta strip */}
        <div className="flex flex-wrap gap-3 mb-12">
          {[
            `${fm.distance} km`,
            `~${Math.floor(fm.duration / 60)}h ${fm.duration % 60}min`,
            `from €${fm.konaPrice}`,
          ].map((item) => (
            <span
              key={item}
              className="text-xs px-3 py-1.5 rounded-full border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-jetbrains)' }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Content */}
        <article
          className="prose-voltlane"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Book CTA */}
        <div
          className="mt-16 rounded-2xl border p-8 text-center"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2
            className="font-display text-2xl font-300 mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Ready to book?
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Get a real-time price for Bucharest → {fm.city} in under 2 minutes.
          </p>
          <Link
            href={`/${locale}/booking`}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-600 rounded-full transition-vl hover:opacity-90"
            style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
          >
            Book This Transfer →
          </Link>
        </div>
      </div>
    </div>
  );
}
