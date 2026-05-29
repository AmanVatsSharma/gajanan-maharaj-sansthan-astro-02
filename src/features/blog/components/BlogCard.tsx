/**
 * @file BlogCard.tsx
 * @module features/blog
 * @description Card component to display a blog post summary
 * @author Aman Sharma / Novologic / Cursor AI
 * @created 2026-02-13
 */

import { format } from "date-fns";
import { Clock, Calendar } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Image could go here if we had one in the design, using aspect-video */}
      
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>
            {format(new Date(post.date), "MMMM d, yyyy")}
          </time>
          <span className="mx-1">•</span>
          <Clock className="h-4 w-4" />
          <span>{post.readingTime}</span>
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
          <a href={`/blog/${post.slug}`}>
            {post.title}
          </a>
        </CardTitle>
        <CardDescription className="line-clamp-3 mt-2">
          {post.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="grow">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild variant="ghost" className="pl-0 hover:pl-2 transition-all">
          <a href={`/blog/${post.slug}`}>
            Read Article <span aria-hidden="true" className="ml-2">→</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
