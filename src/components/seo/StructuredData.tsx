/**
 * File: src/components/seo/StructuredData.tsx
 * Module: components/seo
 * Purpose: Component to inject JSON-LD structured data into page head
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-05
 * Notes:
 * - Renders JSON-LD script tags for SEO
 * - Used across pages to provide structured data to search engines
 */

interface StructuredDataProps {
  data: object | object[];
}

/**
 * Component that renders structured data as JSON-LD script
 * Can accept single schema or array of schemas
 */
export function StructuredData({ data }: StructuredDataProps) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
