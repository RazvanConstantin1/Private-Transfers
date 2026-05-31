import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo/schemas';
import { SITE } from '@/lib/seo/config';
import { getAllArticles } from '@/lib/content/articles';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ pageKey: 'blog', locale, path: '/blog' });
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRo = locale === 'ro';
  const articles = getAllArticles(locale);

  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured?.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: isRo ? 'Acasă' : 'Home', url: `${SITE.url}/${locale}` },
          { name: 'Blog', url: `${SITE.url}/${locale}/blog` },
        ])}
      />
      <div className="min-h-screen pt-24 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-16">
            <h1
              className="font-display text-4xl md:text-6xl font-300 tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {isRo ? 'Travel Notes' : 'VOLTLANE Travel Notes'}
            </h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              {isRo
                ? 'Ghiduri, sfaturi și perspective pentru călătoriile în România'
                : 'Guides, tips & insights for traveling Romania by private transfer'}
            </p>
          </div>

          {/* Featured article */}
          {featured && (
            <Link
              href={`/${locale}/blog/${featured.slug}`}
              className="group block rounded-2xl border overflow-hidden mb-12 transition-vl hover:border-[var(--accent-volt)]"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              {/* Hero image */}
              <div className="relative w-full h-64 md:h-80 overflow-hidden">
                <Image
                  src={featured.heroImage}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 1000px"
                  priority
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(10,10,11,0.7) 0%, transparent 60%)' }}
                />
                <div className="absolute bottom-4 left-6 flex items-center gap-3">
                  <span
                    className="text-xs font-600 uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--accent-volt)', color: '#0A0A0B', fontFamily: 'var(--font-jetbrains)' }}
                  >
                    {isRo ? 'Recomandat' : 'Featured'}
                  </span>
                  <span className="text-xs" style={{ color: 'rgba(245,244,240,0.8)', fontFamily: 'var(--font-jetbrains)' }}>
                    {featured.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h2
                  className="font-display text-2xl md:text-3xl font-300 mb-3 transition-vl group-hover:text-[var(--accent-volt)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {featured.title}
                </h2>
                <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
                  <span>{featured.author}</span>
                  <span>·</span>
                  <span>{featured.readingTime} min read</span>
                  <span>·</span>
                  <span>{new Date(featured.publishedAt).toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Article grid */}
          {rest.length > 0 && (
            <>
              <h2
                className="font-display text-xl font-300 mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                {isRo ? 'Toate Articolele' : 'All Articles'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/${locale}/blog/${article.slug}`}
                    className="group rounded-2xl border overflow-hidden flex flex-col transition-vl hover:border-[var(--accent-volt)]"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                  >
                    {/* Card image */}
                    <div className="relative w-full h-44 overflow-hidden shrink-0">
                      <Image
                        src={article.heroImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(10,10,11,0.5) 0%, transparent 50%)' }}
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <span
                        className="text-xs font-600 uppercase tracking-widest px-2 py-1 rounded-full mb-3 self-start"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
                      >
                        {article.category}
                      </span>
                      <h3
                        className="font-display text-lg font-300 mb-2 transition-vl group-hover:text-[var(--accent-volt)] flex-1"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {article.title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                        {article.excerpt.substring(0, 110)}...
                      </p>
                      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
                        <span>{article.readingTime} min</span>
                        <span>·</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {articles.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>
              {isRo ? 'Nu există articole momentan.' : 'No articles yet.'}
            </p>
          )}

        </div>
      </div>
    </>
  );
}
