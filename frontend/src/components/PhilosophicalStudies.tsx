import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { ArrowRight, BookOpen, Calendar, Clock, Sparkles } from "lucide-react";
import { posts, type Post } from "#site/content";
import PossessedText from "./PossessedText";

const PHILOSOPHICAL_KEYWORDS = [
  "philosophy",
  "research",
  "metaphysics",
  "essay",
  "religion",
  "ethics",
  "theology",
  "study",
  "studies",
  "epistemology",
];

function getReadingTime(rawContent?: string): number {
  if (!rawContent) return 3;
  const words = rawContent.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export default function PhilosophicalStudies() {
  // Filter for philosophical posts, sorted newest first
  const philosophicalPosts = posts
    .filter((post) => {
      const categories = Array.isArray(post.categories)
        ? post.categories.map((c) => c.toLowerCase())
        : [];
      return categories.some((c) => PHILOSOPHICAL_KEYWORDS.includes(c));
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Fallback to latest posts if none matched
  const displayPosts =
    philosophicalPosts.length > 0
      ? philosophicalPosts
      : posts
          .slice()
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);

  const [featuredPost, ...otherPosts] = displayPosts;

  if (!featuredPost) return null;

  const featuredReadingTime = getReadingTime(featuredPost.body?.raw);
  const featuredCategories = Array.isArray(featuredPost.categories)
    ? featuredPost.categories
    : [];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-mono font-medium text-primary shadow-xs">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Philosophical Inquiries & Studies</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif text-foreground leading-[1.15]">
            <PossessedText text="Latest Philosophical Studies" />
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
            Dialectical investigations, epistemological critique, classical
            ethics, and empirical studies exploring the limits of human reason.
          </p>
        </div>

        <Link
          href="/posts"
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-medium text-muted-foreground hover:text-foreground no-underline transition-colors shrink-0"
        >
          <span>All Articles & Essays</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Featured Primary Study Card */}
      <article className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-primary/50 hover:shadow-2xl mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Hero Image */}
          {featuredPost.image && (
            <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[440px] lg:col-span-5 overflow-hidden bg-muted/40">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-background/85 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-destructive backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                <span>Featured Study</span>
              </div>
            </div>
          )}

          {/* Study Content Details */}
          <div
            className={`flex flex-col justify-between p-6 sm:p-8 lg:p-10 ${
              featuredPost.image ? "lg:col-span-7" : "lg:col-span-12"
            }`}
          >
            <div>
              {/* Category Badges & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs font-mono text-muted-foreground">
                <div className="flex flex-wrap gap-2">
                  {featuredCategories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full border border-border/70 bg-muted/70 px-2.5 py-0.5 font-medium uppercase tracking-wider text-foreground text-[11px]"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <time dateTime={featuredPost.date}>
                      {format(parseISO(featuredPost.date), "MMM d, yyyy")}
                    </time>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {featuredReadingTime} min read
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-foreground group-hover:text-primary transition-colors mb-4 leading-tight">
                <Link href={featuredPost.url} className="no-underline">
                  {featuredPost.title}
                </Link>
              </h3>

              {/* Subtitle / Excerpt */}
              {featuredPost.subtitle ? (
                <p className="text-base sm:text-lg text-muted-foreground italic mb-4 font-serif leading-relaxed">
                  {featuredPost.subtitle}
                </p>
              ) : null}

              <p className="text-sm sm:text-base text-muted-foreground line-clamp-4 leading-relaxed mb-6 font-sans">
                {featuredPost.excerpt}
              </p>
            </div>

            {/* Footer with Author and CTA */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/70 mt-auto">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center font-bold text-destructive text-sm shrink-0">
                  {featuredPost.author ? featuredPost.author.charAt(0) : "A"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {featuredPost.author}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    Author & Researcher
                  </span>
                </div>
              </div>

              <Link
                href={featuredPost.url}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs sm:text-sm font-mono font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/85 hover:gap-3 no-underline"
              >
                <span>Read Full Study</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Secondary Articles Grid (if multiple philosophical articles exist) */}
      {otherPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherPosts.map((post: Post) => {
            const readingTime = getReadingTime(post.body?.raw);
            const categories = Array.isArray(post.categories)
              ? post.categories
              : [];

            return (
              <article
                key={post.slug}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:bg-card hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={post.date}>
                        {format(parseISO(post.date), "MMM d, yyyy")}
                      </time>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readingTime} min
                    </span>
                  </div>

                  <h4 className="text-lg font-bold font-serif leading-snug text-foreground group-hover:text-primary transition-colors mb-2">
                    <Link href={post.url} className="no-underline">
                      {post.title}
                    </Link>
                  </h4>

                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed font-sans">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                  <div className="flex flex-wrap gap-1.5">
                    {categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={post.url}
                    className="inline-flex items-center gap-1 font-semibold text-yellow-500 hover:text-yellow-400 no-underline transition-colors group-hover:gap-1.5"
                  >
                    <span>Read</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
