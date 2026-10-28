"use client";

import { allPosts, Post } from "contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const categories = [
  "unknown",
  "philosophy",
  "metaphysics",
  "religion",
  "tale",
  "story about me",
  "data",
  "research",
  "essay",
  "history",
  "geography",
  "maths",
  "experience",
  "review",
  "information",
  "AI",
  "technology"
] as const;

function PostCard(post: Post) {
  const categories = Array.isArray(post.categories) ? post.categories : [];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={post.image as string}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={`${post.url}-${category}`}
                className="rounded-full border border-border bg-muted px-2.5 py-1 font-medium first-letter:uppercase tracking-[0.1em] text-foreground"
              >
                {category}
              </span>
            ))}
          </div>
          <time dateTime={post.date}>
            {format(parseISO(post.date), "MMM d, yyyy")}
          </time>
        </div>

        <h2 className="mb-2 text-xl font-bold leading-tight text-card-foreground">
          <Link
            href={post.url}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        <p className="mb-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <Link
            href={"/authors/ahummaitra"}
            className="text-sm font-medium text-destructive"
          >
            {post.author}
          </Link>
          <Link
            href={post.url}
            className="text-sm font-semibold text-yellow-400 hover:underline"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function PostsPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const posts = useMemo(
    () =>
      allPosts
        .slice()
        .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
        .filter((post) => {
          const search = query.toLowerCase();
          const postCategories = Array.isArray(post.categories) ? post.categories : [];
          const categoryText = postCategories.join(" ").toLowerCase();

          const matchesCategory =
            selectedCategory === "all" || postCategories.includes(selectedCategory);

          const matchesSearch =
            post.title.toLowerCase().includes(search) ||
            post.excerpt.toLowerCase().includes(search) ||
            post.author.toLowerCase().includes(search) ||
            categoryText.includes(search);

          return matchesCategory && matchesSearch;
        }),
    [query, selectedCategory],
  );

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Articles</h1>
          <p>Some might be stories or philosophical researches or just blogs</p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="relative block max-w-xl">
            <span className="sr-only">Search articles</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border border-border bg-background px-4 py-3 pl-11 text-sm outline-none ring-0 transition focus:border-primary"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                selectedCategory === "all"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${
                  selectedCategory === category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl text-center text-muted-foreground">
          Nah can't find anything
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.url} {...post} />
          ))}
        </div>
      )}
    </main>
  );
}
