/**
 * File: src/lib/blog/posts.ts
 * Module: lib/blog
 * Purpose: Blog post loading, taxonomy helpers, and related-content selection.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-15
 * Notes:
 * - Recursively loads markdown files from content/blog (excluding underscore-prefixed files/folders).
 * - Normalizes tags/categories for SEO routes while preserving display labels.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { parseMarkdown, extractHeadings } from "./parse";

interface BlogFrontmatter {
  title?: unknown;
  description?: unknown;
  date?: unknown;
  slug?: unknown;
  image?: unknown;
  keywords?: unknown;
  author?: unknown;
  tags?: unknown;
  category?: unknown;
  locationIds?: unknown;
  relatedSlugs?: unknown;
  noIndex?: unknown;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  keywords?: string[];
  author?: string;
  tags?: string[];
  category?: string;
  locationIds?: string[];
  relatedSlugs?: string[];
  content: string;
  readingTime: string;
  rawContent?: string;
  lastModified: string;
  noIndex?: boolean;
  headings: Array<{ id: string; text: string; level: number }>;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  tags?: string[];
  category?: string;
}

export interface TaxonomySummary {
  slug: string;
  label: string;
  count: number;
}

const CONTENT_DIR = path.join(process.cwd(), "content/blog");
export const BLOG_POSTS_PER_PAGE = 24;
const BLOG_DEBUG_ENABLED =
  process.env.PUBLIC_DEBUG_SEO === "true" ||
  process.env.NEXT_PUBLIC_DEBUG_SEO === "true" ||
  import.meta.env.DEV;
const emittedWarningKeys = new Set<string>();
let blogPostsCache:
  | {
      contentSignature: string;
      posts: BlogPost[];
    }
  | null = null;
let blogPostsInFlight: Promise<BlogPost[]> | null = null;

/**
 * Lightweight debug logger for blog ingestion and SEO content checks.
 * Enabled in development by default and can be forced with PUBLIC_DEBUG_SEO=true.
 */
function blogDebugLog(message: string, data?: Record<string, unknown>): void {
  if (!BLOG_DEBUG_ENABLED) {
    return;
  }

  console.info("blog-seo-debug", {
    timestamp: Date.now(),
    message,
    ...(data ? { data } : {}),
  });
}

/**
 * Emit warn-level logs for malformed content without failing hard immediately.
 */
function blogWarnLog(message: string, data?: Record<string, unknown>): void {
  const warningKey = `${message}:${JSON.stringify(data ?? {})}`;
  if (emittedWarningKeys.has(warningKey)) {
    return;
  }

  emittedWarningKeys.add(warningKey);
  console.warn("blog-seo-warning", {
    timestamp: Date.now(),
    message,
    ...(data ? { data } : {}),
  });
}

export function toTaxonomySlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatTaxonomyLabel(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function toStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
    return items.length > 0 ? items : undefined;
  }

  if (typeof value === "string") {
    const normalized = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return normalized.length > 0 ? normalized : undefined;
  }

  return undefined;
}

function toDateString(value: unknown, fallback: string): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toISOString();
  }

  return fallback;
}

function getMarkdownFilePaths(directoryPath: string): string[] {
  if (!fs.existsSync(directoryPath)) {
    blogWarnLog("Blog content directory missing", { directoryPath });
    return [];
  }

  const filePaths: string[] = [];
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith("_")) {
      continue;
    }

    const normalizedName = entry.name.toLowerCase();
    if (normalizedName === "readme.md") {
      continue;
    }

    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      filePaths.push(...getMarkdownFilePaths(fullPath));
      continue;
    }

    if (entry.isFile() && normalizedName.endsWith(".md")) {
      filePaths.push(fullPath);
    }
  }

  blogDebugLog("Discovered markdown files", {
    directoryPath,
    fileCount: filePaths.length,
  });
  return filePaths;
}

function getFallbackSlug(filePath: string): string {
  const relativePath = path.relative(CONTENT_DIR, filePath);
  const noExtension = relativePath.replace(/\.md$/, "");
  const normalizedPath = noExtension.replace(/[\\/]/g, "-");
  return toTaxonomySlug(normalizedPath);
}

function getFallbackTitle(slug: string): string {
  return formatTaxonomyLabel(slug);
}

function getFallbackDescription(rawContent: string): string {
  const normalized = rawContent
    .replace(/[#>*_`~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return normalized.slice(0, 160);
}

function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Build a content signature from file paths and mtime values.
 * Used to avoid reparsing markdown on every request/build call when unchanged.
 */
function getContentSignature(filePaths: string[]): string {
  return filePaths
    .map((filePath) => {
      const stats = fs.statSync(filePath);
      return `${filePath}:${stats.mtimeMs}`;
    })
    .join("|");
}

function validatePostForSEO(post: BlogPost, filePath: string): void {
  const warnings: string[] = [];

  if (!post.title.trim()) {
    warnings.push("Missing title; fallback title was used.");
  }

  if (!post.description.trim()) {
    warnings.push("Missing description; fallback description was used.");
  }

  if (!post.keywords || post.keywords.length === 0) {
    warnings.push("Missing keywords array; consider adding SEO keyword variants.");
  }

  if (!post.tags || post.tags.length === 0) {
    warnings.push("Missing tags array; taxonomy SEO pages may be weaker.");
  }

  if (!post.category) {
    warnings.push("Missing category; category archive coverage will be lower.");
  }

  if (warnings.length > 0) {
    blogWarnLog("Blog post metadata quality warnings", {
      slug: post.slug,
      filePath,
      warnings,
    });
  }
}

function buildTagSummaries(posts: BlogPost[]): TaxonomySummary[] {
  const summaryMap = new Map<string, TaxonomySummary>();

  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const slug = toTaxonomySlug(tag);
      const existing = summaryMap.get(slug);
      if (existing) {
        summaryMap.set(slug, { ...existing, count: existing.count + 1 });
        continue;
      }

      summaryMap.set(slug, {
        slug,
        label: formatTaxonomyLabel(slug),
        count: 1,
      });
    }
  }

  return [...summaryMap.values()].sort((a, b) => a.label.localeCompare(b.label));
}

function buildCategorySummaries(posts: BlogPost[]): TaxonomySummary[] {
  const summaryMap = new Map<string, TaxonomySummary>();

  for (const post of posts) {
    if (!post.category) {
      continue;
    }

    const slug = toTaxonomySlug(post.category);
    const existing = summaryMap.get(slug);
    if (existing) {
      summaryMap.set(slug, { ...existing, count: existing.count + 1 });
      continue;
    }

    summaryMap.set(slug, {
      slug,
      label: formatTaxonomyLabel(slug),
      count: 1,
    });
  }

  return [...summaryMap.values()].sort((a, b) => a.label.localeCompare(b.label));
}

function getOverlapCount(base: string[] | undefined, candidate: string[] | undefined): number {
  if (!base || !candidate || base.length === 0 || candidate.length === 0) {
    return 0;
  }

  const baseSet = new Set(base.map((item) => item.toLowerCase()));
  return candidate.reduce(
    (count, item) => (baseSet.has(item.toLowerCase()) ? count + 1 : count),
    0
  );
}

function getRelatedPostScore(basePost: BlogPost, candidatePost: BlogPost): number {
  const sharedTagScore = getOverlapCount(basePost.tags, candidatePost.tags) * 3;
  const sharedLocationScore = getOverlapCount(
    basePost.locationIds,
    candidatePost.locationIds
  ) * 2;
  const sameCategoryScore =
    basePost.category &&
    candidatePost.category &&
    toTaxonomySlug(basePost.category) === toTaxonomySlug(candidatePost.category)
      ? 4
      : 0;

  return sharedTagScore + sharedLocationScore + sameCategoryScore;
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const filePaths = getMarkdownFilePaths(CONTENT_DIR);
  const contentSignature = getContentSignature(filePaths);

  if (blogPostsCache?.contentSignature === contentSignature) {
    blogDebugLog("Serving blog posts from cache", {
      fileCount: filePaths.length,
      parsedCount: blogPostsCache.posts.length,
    });
    return [...blogPostsCache.posts];
  }

  if (blogPostsInFlight) {
    blogDebugLog("Awaiting in-flight blog post parse", {
      fileCount: filePaths.length,
    });
    return blogPostsInFlight;
  }

  blogDebugLog("Starting blog post parsing", {
    fileCount: filePaths.length,
    cacheHit: false,
  });

  blogPostsInFlight = (async () => {
  const posts: BlogPost[] = [];
  const seenSlugs = new Set<string>();

    for (const filePath of filePaths) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);
        const frontmatter = data as BlogFrontmatter;
        const fileStats = fs.statSync(filePath);
        const lastModified = fileStats.mtime.toISOString();

        const slug = toStringValue(frontmatter.slug) || getFallbackSlug(filePath);
        if (seenSlugs.has(slug)) {
          blogWarnLog("Duplicate blog slug detected", {
            slug,
            filePath,
          });
          throw new Error(
            `Duplicate blog slug "${slug}" detected. Please keep slugs unique in content/blog.`
          );
        }

        seenSlugs.add(slug);
        const htmlContent = await parseMarkdown(content);
        const headings = extractHeadings(htmlContent);
        const readTime = readingTime(content).text;
        const title = toStringValue(frontmatter.title) || getFallbackTitle(slug);
        const description =
          toStringValue(frontmatter.description) || getFallbackDescription(content);
        const date = toDateString(frontmatter.date, lastModified);

        const post: BlogPost = {
          slug,
          title,
          description,
          date,
          image: toStringValue(frontmatter.image),
          keywords: toStringArray(frontmatter.keywords),
          author: toStringValue(frontmatter.author),
          tags: toStringArray(frontmatter.tags),
          category: toStringValue(frontmatter.category),
          locationIds: toStringArray(frontmatter.locationIds),
          relatedSlugs: toStringArray(frontmatter.relatedSlugs),
          content: htmlContent,
          headings,
          readingTime: readTime,
          rawContent: content,
          lastModified,
          noIndex: frontmatter.noIndex === true,
        };

        validatePostForSEO(post, filePath);
        posts.push(post);
      } catch (error) {
        console.error("blog-seo-error", {
          timestamp: Date.now(),
          filePath,
          message: "Failed to parse blog markdown file",
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    }

    const sortedPosts = sortPostsByDate(posts);
    blogPostsCache = {
      contentSignature,
      posts: sortedPosts,
    };
    blogDebugLog("Completed blog post parsing", {
      parsedCount: sortedPosts.length,
      cacheStored: true,
    });
    return [...sortedPosts];
  })();

  try {
    return await blogPostsInFlight;
  } finally {
    blogPostsInFlight = null;
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  const post = posts.find((item) => item.slug === slug);
  return post || null;
}

/**
 * Get all normalized tags for static route generation.
 */
export async function getAllTags(): Promise<string[]> {
  const summaries = await getTagSummaries();
  return summaries.map((summary) => summary.slug);
}

/**
 * Get all normalized categories for static route generation.
 */
export async function getAllCategories(): Promise<string[]> {
  const summaries = await getCategorySummaries();
  return summaries.map((summary) => summary.slug);
}

/**
 * Get posts that belong to a specific tag.
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const normalizedTag = toTaxonomySlug(tag);
  const posts = await getBlogPosts();

  return posts.filter((post) =>
    (post.tags ?? []).some((postTag) => toTaxonomySlug(postTag) === normalizedTag)
  );
}

/**
 * Get posts that belong to a specific category.
 */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const normalizedCategory = toTaxonomySlug(category);
  const posts = await getBlogPosts();

  return posts.filter((post) =>
    post.category ? toTaxonomySlug(post.category) === normalizedCategory : false
  );
}

/**
 * Get posts that reference a specific location (by locationId).
 * Used for location page "Related Guides" sections.
 */
export async function getPostsByLocationId(
  locationId: string,
  limit = 6
): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  const filtered = posts.filter((post) =>
    (post.locationIds ?? []).includes(locationId)
  );
  return filtered.slice(0, limit);
}

/**
 * Get posts by a list of slugs. Preserves order of slugs; skips missing.
 * Used for homepage "Featured Guides" and curated link sections.
 */
export async function getPostsBySlugs(slugs: string[]): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  const ordered = slugs
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter((p): p is BlogPost => Boolean(p));
  return ordered;
}

/**
 * Get summarized tag data for listing/filter UI.
 */
export async function getTagSummaries(): Promise<TaxonomySummary[]> {
  const posts = await getBlogPosts();
  return buildTagSummaries(posts);
}

/**
 * Get summarized category data for listing/filter UI.
 */
export async function getCategorySummaries(): Promise<TaxonomySummary[]> {
  const posts = await getBlogPosts();
  return buildCategorySummaries(posts);
}

/**
 * Get related posts prioritizing explicit links, then topical similarity.
 */
export async function getRelatedPosts(
  post: BlogPost,
  limit = 3
): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts();
  const candidatePosts = allPosts.filter((item) => item.slug !== post.slug);

  const explicitSlugOrder = post.relatedSlugs ?? [];
  const explicitPosts = explicitSlugOrder
    .map((slug) => candidatePosts.find((item) => item.slug === slug))
    .filter((item): item is BlogPost => Boolean(item));

  const scoredPosts = candidatePosts
    .filter((candidate) => !explicitSlugOrder.includes(candidate.slug))
    .map((candidate) => ({
      candidate,
      score: getRelatedPostScore(post, candidate),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return new Date(b.candidate.date).getTime() - new Date(a.candidate.date).getTime();
    })
    .map((entry) => entry.candidate);

  const merged = [...explicitPosts, ...scoredPosts];
  return merged.slice(0, limit);
}
