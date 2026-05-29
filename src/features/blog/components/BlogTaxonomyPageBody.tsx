/**
 * Tag / category archive page body (parity with Next blog tag & category routes).
 */
import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCollectionPageSchema } from "@/lib/seo/structured-data";

export type BlogTaxonomyKind = "tag" | "category";

export interface BlogTaxonomyPageBodyProps {
  kind: BlogTaxonomyKind;
  taxonomySlug: string;
  label: string;
  posts: BlogPost[];
  featuredPosts: BlogPost[];
}

export function BlogTaxonomyPageBody({
  kind,
  taxonomySlug,
  label,
  posts,
  featuredPosts,
}: BlogTaxonomyPageBodyProps) {
  const path = kind === "tag" ? `/blog/tag/${taxonomySlug}` : `/blog/category/${taxonomySlug}`;
  const title = kind === "tag" ? `${label} Articles` : `${label} Guides`;
  const description =
    kind === "tag"
      ? `Posts tagged with ${label}.`
      : `Posts from the ${label} category.`;
  const heading = kind === "tag" ? label : `${label} Guides`;
  const subcopy =
    kind === "tag"
      ? "Explore related updates and guidance from the Sansthan."
      : "Location and pilgrimage knowledge organized for devotees.";
  const featuredTitle =
    kind === "tag"
      ? "Pillar guides curated for faster discovery across tags."
      : "High-intent pillars that answer booking, contact, and travel questions quickly.";

  const collectionSchema = getCollectionPageSchema({
    path,
    title,
    description,
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      date: post.date,
      image: post.image,
      urlPath: `/blog/${post.slug}`,
      keywords: post.keywords,
      category: post.category,
    })),
  });

  return (
    <div className="container py-12 space-y-8">
      <StructuredData data={collectionSchema} />

      <Breadcrumbs
        items={[
          { name: "Blog", url: "/blog" },
          { name: label, url: path },
        ]}
      />

      <div className="space-y-3">
        <h1 className="text-4xl font-bold font-heading">{heading}</h1>
        <p className="text-muted-foreground text-lg">{subcopy}</p>
      </div>

      {featuredPosts.length > 0 ? (
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Featured planning guides</h2>
            <p className="text-muted-foreground">{featuredTitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
