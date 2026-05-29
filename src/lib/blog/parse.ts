/**
 * File: src/lib/blog/parse.ts
 * Module: lib/blog
 * Purpose: Markdown parsing logic using unified pipeline
 * Author: Aman Sharma / Novologic / Cursor AI
 * Created: 2026-02-13
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';

// BlogPostBody renders its own <h1> for the post title.
// Any H1 inside the markdown body would create a dual-H1 page, which
// sends conflicting topic signals to Google. This plugin demotes every
// markdown H1 → H2 so the heading hierarchy stays valid without touching
// the source files.
function rehypeDemoteH1() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'h1') {
        node.tagName = 'h2';
      }
    });
  };
}

export async function parseMarkdown(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeDemoteH1)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  return String(file);
}

export function extractHeadings(html: string) {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  
  // Very simple regex-based heading extraction from HTML
  // In a real app we might use a proper HTML parser, but this is efficient
  // for generated markdown where structure is known.
  const regex = /<(h[2-4]) id="([^"]+)">(.+?)<\/h[2-4]>/g;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1][1]);
    const id = match[2];
    // Remove potential inner HTML (like autolinks) from text
    const text = match[3].replace(/<[^>]*>?/gm, '').trim();
    
    headings.push({ id, text, level });
  }
  
  return headings;
}
