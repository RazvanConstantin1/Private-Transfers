import type { Metadata } from 'next';
import { SITE, SEO_DEFAULTS } from './config';

interface GenerateMetadataParams {
  pageKey: string;
  locale: string;
  path: string;
  override?: {
    title?: string;
    description?: string;
    ogImage?: string;
    noindex?: boolean;
    keywords?: string[];
  };
}

export function generatePageMetadata({
  pageKey,
  locale,
  path,
  override,
}: GenerateMetadataParams): Metadata {
  const localeKey = locale === 'ro' ? 'ro' : 'en';
  const config =
    SEO_DEFAULTS[pageKey]?.[localeKey] ?? SEO_DEFAULTS['home'][localeKey];

  const title = override?.title ?? config.title;
  const description = override?.description ?? config.description;
  const keywords = override?.keywords ?? config.keywords;
  const ogImageParam = encodeURIComponent(title);
  const ogImage =
    override?.ogImage ?? `${SITE.url}/api/og?title=${ogImageParam}`;
  const canonicalPath = path === '/' ? '' : path;
  const url = `${SITE.url}/${locale}${canonicalPath}`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE.url}/en${canonicalPath}`,
        ro: `${SITE.url}/ro${canonicalPath}`,
        'x-default': `${SITE.url}/en${canonicalPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: locale === 'ro' ? 'ro_RO' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      site: SITE.twitter,
    },
    robots: override?.noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
          },
        },
  };
}
