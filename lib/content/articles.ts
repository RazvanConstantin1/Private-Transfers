import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

export interface ArticleFrontmatter {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  featured?: boolean;
  heroImage: string;
  author: string;
  readingTime: number;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
}

export interface ArticleData {
  frontmatter: ArticleFrontmatter;
  content: string;
}

function getArticlesDir(locale: string) {
  return path.join(ARTICLES_DIR, locale);
}

export function getAllArticles(locale = 'en'): ArticleFrontmatter[] {
  const dir = getArticlesDir(locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      const { data } = matter(raw);
      return data as ArticleFrontmatter;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getArticle(
  slug: string,
  locale = 'en'
): ArticleData | null {
  const dir = getArticlesDir(locale);
  const mdxFile = path.join(dir, `${slug}.mdx`);
  const mdFile = path.join(dir, `${slug}.md`);

  const file = fs.existsSync(mdxFile)
    ? mdxFile
    : fs.existsSync(mdFile)
    ? mdFile
    : null;

  if (!file) {
    const fallbackDir = getArticlesDir('en');
    const fallbackMdx = path.join(fallbackDir, `${slug}.mdx`);
    const fallbackMd = path.join(fallbackDir, `${slug}.md`);
    const fallback = fs.existsSync(fallbackMdx)
      ? fallbackMdx
      : fs.existsSync(fallbackMd)
      ? fallbackMd
      : null;
    if (!fallback) return null;
    const raw = fs.readFileSync(fallback, 'utf-8');
    const { data, content } = matter(raw);
    return { frontmatter: data as ArticleFrontmatter, content };
  }

  const raw = fs.readFileSync(file, 'utf-8');
  const { data, content } = matter(raw);
  return { frontmatter: data as ArticleFrontmatter, content };
}

export function getAllArticleSlugs(): string[] {
  const dir = getArticlesDir('en');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.(mdx|md)$/, ''));
}
