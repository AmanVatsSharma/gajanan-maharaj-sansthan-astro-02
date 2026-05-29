/**
 * File: src/features/blog/components/TableOfContents.tsx
 * Purpose: Renders a sticky Table of Contents for blog posts to improve UX and SEO.
 */
import React from 'react';

interface ToCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: ToCItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav className="p-4 rounded-lg bg-muted/50 border mb-8">
      <h2 className="text-lg font-bold mb-4 font-heading">In this guide</h2>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className="text-muted-foreground hover:text-brand-maroon hover:underline transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
