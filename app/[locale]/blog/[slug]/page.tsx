import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getArticle, getAllArticleSlugs, getAllArticles } from '@/lib/content/articles';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, articleSchema } from '@/lib/seo/schemas';
import { SITE } from '@/lib/seo/config';
import { Callout } from '@/components/mdx/Callout';
import { RouteCTA } from '@/components/mdx/RouteCTA';

interface BlogParams {
  locale: string;
  slug: string;
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return ['en', 'ro'].flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BlogParams>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const data = getArticle(slug, locale);
  if (!data) return {};
  const { frontmatter: fm } = data;
  return generatePageMetadata({
    pageKey: 'blog',
    locale,
    path: `/blog/${slug}`,
    override: {
      title: fm.metaTitle,
      description: fm.metaDescription,
      keywords: fm.keywords,
    },
  });
}

const mdxComponents = {
  Callout,
  RouteCTA,
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="font-display text-3xl font-300 mb-6 mt-0" style={{ color: 'var(--text-primary)' }}>
      {children}
    </h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="font-display text-2xl font-400 mb-4 mt-10" style={{ color: 'var(--text-primary)' }}>
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="font-600 text-lg mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
      {children}
    </h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong style={{ color: 'var(--text-primary)' }}>{children}</strong>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {children}
      </table>
    </div>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-4 py-3 text-left text-xs font-600 uppercase tracking-widest" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)', borderBottom: '1px solid var(--border)' }}>
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-4 py-3 text-sm" style={{ borderBottom: '1px solid var(--border-soft)', color: 'var(--text-secondary)' }}>
      {children}
    </td>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 pl-4 my-4 italic" style={{ borderColor: 'var(--accent-volt)', color: 'var(--text-secondary)' }}>
      {children}
    </blockquote>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      style={{ color: 'var(--accent-volt)', textDecoration: 'underline' }}
    >
      {children}
    </a>
  ),
};

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<BlogParams>;
}) {
  const { slug, locale } = await params;
  const data = getArticle(slug, locale);
  if (!data) notFound();

  const { frontmatter: fm, content } = data;
  const isRo = locale === 'ro';

  const { content: mdxContent } = await compileMDX({
    source: content,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components: mdxComponents as any,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  const pageUrl = `${SITE.url}/${locale}/blog/${slug}`;
  const allArticles = getAllArticles(locale);
  const related = allArticles.filter((a) => a.slug !== slug).slice(0, 3);

  const schemas = [
    breadcrumbSchema([
      { name: isRo ? 'Acasă' : 'Home', url: `${SITE.url}/${locale}` },
      { name: 'Blog', url: `${SITE.url}/${locale}/blog` },
      { name: fm.title, url: pageUrl },
    ]),
    articleSchema({
      title: fm.metaTitle,
      description: fm.metaDescription,
      publishedAt: fm.publishedAt,
      modifiedAt: fm.updatedAt,
      author: fm.author,
      image: `${SITE.url}${fm.heroImage}`,
      url: pageUrl,
    }),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="min-h-screen pt-24 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm mb-8 flex-wrap"
            style={{ color: 'var(--text-muted)' }}
          >
            <Link href={`/${locale}`} className="hover:text-[var(--text-secondary)] transition-vl">
              {isRo ? 'Acasă' : 'Home'}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/blog`} className="hover:text-[var(--text-secondary)] transition-vl">
              Blog
            </Link>
            <span>/</span>
            <span className="truncate max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>
              {fm.title.substring(0, 40)}...
            </span>
          </nav>

          {/* Hero image */}
          <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden mb-8">
            <Image
              src={fm.heroImage}
              alt={fm.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ background: 'linear-gradient(to top, rgba(10,10,11,0.4) 0%, transparent 60%)' }}
            />
          </div>

          {/* Article header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-xs font-600 uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: 'var(--accent-volt-dim)', color: 'var(--accent-volt)', fontFamily: 'var(--font-jetbrains)' }}
              >
                {fm.category}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
                {fm.readingTime} min read
              </span>
            </div>
            <h1
              className="font-display text-3xl md:text-4xl font-300 tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {fm.title}
            </h1>
            <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              {fm.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs pb-8 border-b" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)', borderColor: 'var(--border-soft)' }}>
              <span>{fm.author}</span>
              <span>·</span>
              <time dateTime={fm.publishedAt}>
                {new Date(fm.publishedAt).toLocaleDateString(
                  isRo ? 'ro-RO' : 'en-GB',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </time>
              <span>·</span>
              <span>{isRo ? 'Actualizat' : 'Updated'} {new Date(fm.updatedAt).toLocaleDateString(isRo ? 'ro-RO' : 'en-GB', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Article content */}
          <article className="mb-16">
            {mdxContent}
          </article>

          {/* Bottom CTA */}
          <div
            className="rounded-2xl border p-8 text-center mb-16"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--accent-volt)' }}
          >
            <p className="font-display text-xl font-300 mb-2" style={{ color: 'var(--text-primary)' }}>
              {isRo
                ? 'Gata să explorezi România?'
                : 'Ready to explore Romania?'}
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {isRo
                ? 'Transfer privat electric, șofer vorbitor de engleză, preț fix.'
                : 'Private electric transfer, English-speaking driver, fixed price.'}
            </p>
            <Link
              href={`/${locale}/booking`}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-600 rounded-full transition-vl hover:opacity-90"
              style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
            >
              {isRo ? 'Rezervă un Transfer →' : 'Book a Transfer →'}
            </Link>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <section>
              <h2
                className="font-display text-xl font-300 mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                {isRo ? 'Articole Similare' : 'Related Articles'}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {related.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/${locale}/blog/${article.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-xl border transition-vl hover:border-[var(--accent-volt)]"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex-1">
                      <p className="font-500 text-sm mb-1 transition-vl group-hover:text-[var(--accent-volt)]" style={{ color: 'var(--text-primary)' }}>
                        {article.title}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {article.readingTime} min · {article.category}
                      </p>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}
