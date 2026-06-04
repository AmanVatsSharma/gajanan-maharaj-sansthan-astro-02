import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import readingTime from "reading-time";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = path.resolve(__dirname, "../../../content/blog");

export interface BlogPostFrontmatter {
  title: string;
  description?: string;
  date: string;
  dateModified?: string;
  slug: string;
  image?: string;
  keywords?: string[];
  author?: string;
  tags?: string[];
  category: string;
  locationIds?: string[];
  relatedSlugs?: string[];
  faqs?: Array<{ question: string; answer: string }>;
}

export interface BlogPost {
  title: string;
  description: string;
  date: string;
  dateModified: string;
  slug: string;
  image: string;
  keywords: string[];
  author: string;
  tags: string[];
  category: string;
  locationIds: string[];
  relatedSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
  content: string;
  htmlContent: string;
  readingTimeMinutes: number;
  wordCount: number;
  relativePath: string;
}

const mdProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, { behavior: "wrap" })
  .use(rehypeHighlight)
  .use(rehypeStringify);

function toTaxonomySlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

let _cache: BlogPost[] | null = null;
let _cacheBySlug: Map<string, BlogPost> | null = null;

function parseAll(): { posts: BlogPost[]; bySlug: Map<string, BlogPost> } {
  if (_cache && _cacheBySlug) {
    return { posts: _cache, bySlug: _cacheBySlug };
  }
  const files = walkMarkdownFiles(BLOG_ROOT);
  const posts: BlogPost[] = [];
  const bySlug = new Map<string, BlogPost>();
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const parsed = matter(raw);
    const fm = parsed.data as Partial<BlogPostFrontmatter>;
    if (!fm.slug || !fm.title || !fm.date || !fm.category) continue;
    const slug = fm.slug;
    const stats = readingTime(parsed.content);
    const htmlContent = String(mdProcessor.processSync(parsed.content));
    const relPath = path.relative(BLOG_ROOT, file).replace(/\\/g, "/");
    const post: BlogPost = {
      title: fm.title,
      description: fm.description ?? "",
      date: fm.date,
      dateModified: fm.dateModified ?? fm.date,
      slug,
      image: fm.image ?? "/images/shegaon-temple.svg",
      keywords: Array.isArray(fm.keywords) ? fm.keywords : [],
      author: fm.author ?? "Sansthan",
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      category: fm.category,
      locationIds: Array.isArray(fm.locationIds) ? fm.locationIds : [],
      relatedSlugs: Array.isArray(fm.relatedSlugs) ? fm.relatedSlugs : [],
      faqs: Array.isArray(fm.faqs) ? fm.faqs : [],
      content: parsed.content,
      htmlContent,
      readingTimeMinutes: Math.max(1, Math.round(stats.minutes)),
      wordCount: stats.words,
      relativePath: relPath,
    };
    posts.push(post);
    bySlug.set(slug, post);
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  _cache = posts;
  _cacheBySlug = bySlug;
  return { posts, bySlug };
}

export function getBlogPosts(): BlogPost[] {
  return parseAll().posts;
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return parseAll().bySlug.get(slug);
}

export interface TaxonomyItem {
  slug: string;
  label: string;
  count: number;
}

function uniqueLabels(items: { label: string }[]): string[] {
  return Array.from(new Set(items.map((i) => i.label)));
}

export function getCategories(): TaxonomyItem[] {
  const map = new Map<string, TaxonomyItem>();
  for (const post of getBlogPosts()) {
    const slug = toTaxonomySlug(post.category);
    const existing = map.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(slug, { slug, label: post.category, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getTags(): TaxonomyItem[] {
  const map = new Map<string, TaxonomyItem>();
  for (const post of getBlogPosts()) {
    for (const tag of post.tags) {
      const slug = toTaxonomySlug(tag);
      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(slug, { slug, label: tag, count: 1 });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getPostsByCategory(slug: string): BlogPost[] {
  return getBlogPosts().filter((p) => toTaxonomySlug(p.category) === slug);
}

export function getPostsByTag(slug: string): BlogPost[] {
  return getBlogPosts().filter((p) =>
    p.tags.some((t) => toTaxonomySlug(t) === slug),
  );
}

export function getRelatedPosts(post: BlogPost, limit = 6): BlogPost[] {
  const all = getBlogPosts();
  if (post.relatedSlugs.length > 0) {
    const direct = post.relatedSlugs
      .map((s) => all.find((p) => p.slug === s))
      .filter((p): p is BlogPost => Boolean(p));
    if (direct.length >= limit) return direct.slice(0, limit);
  }
  const scored = all
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const sharedLocations = p.locationIds.filter((id) =>
        post.locationIds.includes(id),
      ).length;
      const sameCategory = p.category === post.category ? 1 : 0;
      const sharedTags = p.tags.filter((t) => post.tags.includes(t)).length;
      return { post: p, score: sharedLocations * 2 + sameCategory + sharedTags * 0.5 };
    })
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1));
  return scored.slice(0, limit).map((s) => s.post);
}

export const BLOG_PAGE_SIZE = 24;

export function paginate<T>(items: T[], page: number, pageSize = BLOG_PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    total,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}

export { toTaxonomySlug };
