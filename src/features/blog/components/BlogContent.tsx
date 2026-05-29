/**
 * @file BlogContent.tsx
 * @module features/blog
 * @description Component to render the HTML content of a blog post
 * @author Aman Sharma / Novologic / Cursor AI
 * @created 2026-02-13
 */

import { cn } from "@/lib/utils";

interface BlogContentProps {
  content: string;
  className?: string;
}

export function BlogContent({ content, className }: BlogContentProps) {
  return (
    <div
      className={cn(
        "prose prose-slate lg:prose-lg dark:prose-invert max-w-none",
        "prose-headings:scroll-mt-20 prose-headings:font-heading prose-headings:font-semibold",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-img:rounded-xl prose-img:shadow-md",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
