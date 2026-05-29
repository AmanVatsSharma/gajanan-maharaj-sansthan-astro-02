/**
 * File: src/components/seo/Breadcrumbs.tsx
 * Module: components/seo
 * Purpose: Breadcrumb navigation component with structured data
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-05
 * Notes:
 * - Provides visual breadcrumb navigation
 * - Includes JSON-LD schema for SEO
 * - Improves user navigation and search engine understanding
 */

import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb navigation with SEO-friendly structured data
 */
export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  // Always include Home as first item
  const breadcrumbItems = [{ name: "Home", url: "/" }, ...items];

  return (
    <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      >
        {breadcrumbItems.map((item, index) => (
          <div key={item.url} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4" />}
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-foreground font-medium" aria-current="page">
                {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                {item.name}
              </span>
            ) : (
              <a
                href={item.url}
                className="hover:text-foreground transition-colors"
              >
                {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                {item.name}
              </a>
            )}
          </div>
        ))}
      </nav>
  );
}
