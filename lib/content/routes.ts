import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ROUTES_DIR = path.join(process.cwd(), 'content/routes');

export interface RouteStop {
  name: string;
  description: string;
  addedCost: number;
  hours: number;
}

export interface RouteFaq {
  question: string;
  answer: string;
}

export interface RouteFrontmatter {
  slug: string;
  fromCity: string;
  toCity: string;
  distanceKm: number;
  durationMinutes: number;
  durationLabel: string;
  priceKona: number;
  priceTesla: number;
  priceCapri: number;
  heroImage: string;
  publishedAt: string;
  updatedAt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  stops: RouteStop[];
  faq: RouteFaq[];
  relatedRoutes: string[];
}

export interface RouteData {
  frontmatter: RouteFrontmatter;
  content: string;
}

function getRoutesDir(locale: string) {
  return path.join(ROUTES_DIR, locale);
}

export function getAllRoutes(locale = 'en'): RouteFrontmatter[] {
  const dir = getRoutesDir(locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      const { data } = matter(raw);
      return data as RouteFrontmatter;
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getRoute(slug: string, locale = 'en'): RouteData | null {
  const dir = getRoutesDir(locale);
  const file = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(file)) {
    const fallbackFile = path.join(getRoutesDir('en'), `${slug}.md`);
    if (!fs.existsSync(fallbackFile)) return null;
    const raw = fs.readFileSync(fallbackFile, 'utf-8');
    const { data, content } = matter(raw);
    return { frontmatter: data as RouteFrontmatter, content };
  }
  const raw = fs.readFileSync(file, 'utf-8');
  const { data, content } = matter(raw);
  return { frontmatter: data as RouteFrontmatter, content };
}

export function getAllRouteSlugs(): string[] {
  const dir = getRoutesDir('en');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''));
}
