/**
 * Homepage section showcasing popular pilgrimage guides (SEO interlinking).
 */
import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "@/features/blog/components/BlogCard";

export const FEATURED_GUIDE_SLUGS = [
  "shegaon-travel-guide",
  "shegaon-accommodation-guide",
  "omkareshwar-darshan-timings",
  "shegaon-bhakta-niwas-booking-process",
  "nearby-places-from-shegaon",
  "phone-and-whatsapp-booking-best-practices",
  "pandharpur-and-shegaon-family-yatra-plan",
  "jyotirlinga-and-sansthan-combined-itinerary",
];

export interface FeaturedGuidesProps {
  posts: BlogPost[];
}

export function FeaturedGuides({ posts }: FeaturedGuidesProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-brand-maroon mb-3">
            Popular Pilgrimage Guides
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plan your visit with our guides on darshan timings, accommodation, and travel tips for
            Shegaon, Omkareshwar, Pandharpur, and more.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 font-medium text-brand-saffron hover:text-brand-maroon transition-colors"
          >
            View all guides
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
