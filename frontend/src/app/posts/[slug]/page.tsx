// app/posts/[slug]/page.tsx
import { allPosts } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { MDXContent } from "@/components/mdx/MDXComponents";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  if (!post) return { title: "Post Not Found | Haunted Forest" };
  return {
    title: `${post.title} | Haunted Forest`,
    description: post.excerpt,
  };
};

const PostLayout = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  if (!post) {
    notFound();
  }

  const categories = Array.isArray(post.categories) ? post.categories : [];

  // Sort posts by date for chronological navigation
  const sortedPosts = allPosts
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const currentIndex = sortedPosts.findIndex((p) => p._raw.flattenedPath === slug);
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  // Calculate estimated reading time
  const words = (post.body.raw || "").trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 180));

  return (
    <div className="min-h-screen w-full pb-24 pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Bar */}
        <nav className="flex items-center justify-between gap-4 mb-8 text-xs font-mono text-muted-foreground">
          <Link
            href="/posts"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-md px-4 py-2 transition-all hover:border-primary hover:text-foreground no-underline shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>All Articles</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {readingTime} min read
            </span>
          </div>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.14] mb-4 font-serif">
            {post.title}
          </h1>

          {/* Optional Subtitle (Never displaying raw excerpt here) */}
          {post.subtitle && (
            <p className="text-xl sm:text-2xl text-muted-foreground mb-6 italic font-normal leading-relaxed">
              {post.subtitle}
            </p>
          )}

          {/* Author & Published Date Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/80 text-sm font-sans text-muted-foreground mt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center font-bold text-destructive text-sm shrink-0">
                {post.author ? post.author.charAt(0) : "A"}
              </div>
              <div className="flex flex-col">
                <Link
                  href="/authors/ahummaitra"
                  className="font-semibold text-foreground hover:text-destructive transition-colors no-underline"
                >
                  {post.author}
                </Link>
                <span className="text-xs text-muted-foreground font-mono">Author</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <time dateTime={post.date}>
                  {format(parseISO(post.date), "MMMM d, yyyy")}
                </time>
              </span>
            </div>
          </div>

          {/* Featured Hero Image */}
          {post.image && (
            <div className="relative my-8 overflow-hidden rounded-3xl border border-border/80 shadow-2xl bg-card/40 backdrop-blur-sm">
              <Image
                className="w-full h-auto object-cover max-h-[540px]"
                alt={post.title}
                src={post.image as string}
                width={1200}
                height={630}
                priority
              />
            </div>
          )}
        </header>

        {/* Article Body (Tufte + MDX) */}
        <div className="tufte-layout">
          <article className="tufte-article pt-2 pb-12">
            <section className="article-body">
              <MDXContent code={post.body.code} />
            </section>
          </article>
        </div>

        {/* Author Bio Card */}
        <div className="my-14 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center font-bold text-destructive text-2xl shrink-0">
                {post.author ? post.author.charAt(0) : "A"}
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-0.5">Written by</div>
                <Link
                  href="/authors/ahummaitra"
                  className="text-lg font-bold text-foreground hover:text-destructive transition-colors no-underline"
                >
                  {post.author}
                </Link>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">
                  Crafting software, exploring design, philosophy, and system aesthetics at Haunted Forest.
                </p>
              </div>
            </div>

            <Link
              href="/authors/ahummaitra"
              className="rounded-full border border-border bg-muted/60 px-4 py-2 text-xs font-mono font-medium hover:bg-muted text-foreground transition-colors shrink-0 no-underline"
            >
              Author Profile →
            </Link>
          </div>
        </div>

        {/* Previous / Next Article Navigation Cards */}
        {(prevPost || nextPost) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            {prevPost ? (
              <Link
                href={prevPost.url}
                className="group flex flex-col justify-between p-5 rounded-2xl border border-border/80 bg-card/50 hover:bg-card hover:border-primary/50 transition-all no-underline shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2 group-hover:text-primary transition-colors">
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span>Previous Article</span>
                </div>
                <div className="text-sm font-semibold text-foreground line-clamp-2">
                  {prevPost.title}
                </div>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link
                href={nextPost.url}
                className="group flex flex-col justify-between p-5 rounded-2xl border border-border/80 bg-card/50 hover:bg-card hover:border-primary/50 transition-all no-underline text-right shadow-sm"
              >
                <div className="flex items-center justify-end gap-2 text-xs font-mono text-muted-foreground mb-2 group-hover:text-primary transition-colors">
                  <span>Next Article</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
                <div className="text-sm font-semibold text-foreground line-clamp-2">
                  {nextPost.title}
                </div>
              </Link>
            ) : <div />}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground no-underline transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostLayout;
