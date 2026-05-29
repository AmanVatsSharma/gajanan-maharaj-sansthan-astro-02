/**
 * Shared markdown inventory for SEO verify scripts (matches src/lib/blog/posts.ts slug rules).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export function getMarkdownFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

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
      files.push(...getMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && normalizedName.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

export function toTaxonomySlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getFallbackSlug(filePath, blogRoot) {
  const relativePath = path.relative(blogRoot, filePath);
  const noExtension = relativePath.replace(/\.md$/, "");
  const normalizedPath = noExtension.replace(/[\\/]/g, "-");
  return toTaxonomySlug(normalizedPath);
}

function toStringArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function getBlogInventory(blogRoot) {
  const markdownFiles = getMarkdownFiles(blogRoot);
  const posts = [];
  const tags = new Set();
  const categories = new Set();

  for (const filePath of markdownFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);
    const slugFromFm = typeof data.slug === "string" ? data.slug.trim() : "";
    const slug = slugFromFm || getFallbackSlug(filePath, blogRoot);

    if (!slug) {
      continue;
    }

    posts.push(slug);
    for (const tag of toStringArray(data.tags)) {
      tags.add(toTaxonomySlug(tag));
    }

    if (typeof data.category === "string" && data.category.trim()) {
      categories.add(toTaxonomySlug(data.category));
    }
  }

  return {
    postSlugs: posts,
    tagSlugs: [...tags],
    categorySlugs: [...categories],
  };
}
