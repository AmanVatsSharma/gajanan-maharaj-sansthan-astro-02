/**
 * Full blog post view (parity with former Next `app/blog/[slug]/page.tsx`).
 */
import { format } from "date-fns";
import { Calendar, Clock, User, ShieldCheck } from "lucide-react";
import { toTaxonomySlug, type BlogPost } from "@/lib/blog";
import { BlogContent } from "@/features/blog/components/BlogContent";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { sansthanLocations } from "@/data/sansthan-data";
import { TableOfContents } from "./TableOfContents";

export interface BlogPostBodyProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogPostBody({ post, relatedPosts }: BlogPostBodyProps) {
  const relatedLocations = (post.locationIds ?? [])
    .map((locationId) => sansthanLocations.find((location) => location.id === locationId))
    .filter((location): location is (typeof sansthanLocations)[number] => Boolean(location));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <Breadcrumbs
          items={[
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]}
        />

        <header className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-maroon bg-brand-maroon/5 w-fit px-3 py-1 rounded-full text-xs font-semibold border border-brand-maroon/10">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Information • Official Sansthan Resource</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime}</span>
              </div>
              {post.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {post.category && (
              <a href={`/blog/category/${toTaxonomySlug(post.category)}`}>
                <Badge variant="outline">{post.category}</Badge>
              </a>
            )}

            {post.tags?.map((tag) => (
              <a key={tag} href={`/blog/tag/${toTaxonomySlug(tag)}`}>
                <Badge variant="secondary">{tag}</Badge>
              </a>
            ))}
          </div>
        </header>

        <div className="border-t my-8" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12 items-start">
          <article>
            <TableOfContents headings={post.headings} />
            <BlogContent content={post.content} />
          </article>

          <aside className="hidden lg:block sticky top-24 space-y-8">
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Official Sansthan support is available for accommodation and darshan queries.
              </p>
              <a 
                href="/contact" 
                className="block text-center w-full bg-brand-maroon text-white py-2 rounded-md text-sm font-medium hover:bg-brand-maroon/90 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </aside>
        </div>

        {relatedLocations.length > 0 && (
          <section className="space-y-4 border-t pt-8">
            <h2 className="text-2xl font-bold font-heading">Related Sansthan Locations</h2>
            <p className="text-muted-foreground">
              Planning a visit? Explore accommodation and contact details for these locations.
            </p>
            <div className="flex flex-wrap gap-3">
              {relatedLocations.map((location) => (
                <a
                  key={location.id}
                  href={`/locations/${location.id}`}
                  className="rounded-md border px-3 py-2 text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  {location.name}
                </a>
              ))}
            </div>
          </section>
        )}

        {relatedPosts.length > 0 && (
          <section className="space-y-4 border-t pt-8">
            <h2 className="text-2xl font-bold font-heading">Related Articles</h2>
            <p className="text-muted-foreground">
              Continue reading guides and updates connected to this topic.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        )}

        {post.category && (
          <section className="space-y-2 border-t pt-8">
            <h2 className="text-lg font-semibold font-heading">Browse by Category</h2>
            <p className="text-muted-foreground text-sm">
              Explore more in{" "}
              <a
                href={`/blog/category/${toTaxonomySlug(post.category)}`}
                className="font-medium text-brand-maroon hover:text-brand-saffron hover:underline"
              >
                {post.category}
              </a>
              .
            </p>
          </section>
        )}
      </div>
  );
}
