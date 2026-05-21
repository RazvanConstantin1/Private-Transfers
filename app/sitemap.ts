import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://voltlane.com';
const LOCALES = ['en', 'ro'];
const STATIC_PAGES = ['', 'airport-transfers', 'intercity', 'hourly', 'fleet', 'about', 'contact', 'booking', 'terms', 'privacy'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routeSlugs = fs
    .readdirSync(path.join(process.cwd(), 'content/routes'))
    .map((f) => f.replace('.md', ''));

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const page of STATIC_PAGES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page ? `/${page}` : ''}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === 'booking' ? 0.9 : 0.7,
      });
    }
    for (const slug of routeSlugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/intercity/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
