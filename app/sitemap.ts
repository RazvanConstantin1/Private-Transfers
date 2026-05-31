import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo/config';
import { getAllRouteSlugs } from '@/lib/content/routes';
import { getAllArticleSlugs } from '@/lib/content/articles';

const staticPages: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'];
}> = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/airport-transfers', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/intercity', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/hourly', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/fleet', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/booking', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routeSlugs = getAllRouteSlugs();
  const articleSlugs = getAllArticleSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SITE.locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE.url}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            en: `${SITE.url}/en${page.path}`,
            ro: `${SITE.url}/ro${page.path}`,
          },
        },
      });
    }

    for (const slug of routeSlugs) {
      entries.push({
        url: `${SITE.url}/${locale}/intercity/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.85,
        alternates: {
          languages: {
            en: `${SITE.url}/en/intercity/${slug}`,
            ro: `${SITE.url}/ro/intercity/${slug}`,
          },
        },
      });
    }

    for (const slug of articleSlugs) {
      entries.push({
        url: `${SITE.url}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${SITE.url}/en/blog/${slug}`,
            ro: `${SITE.url}/ro/blog/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
