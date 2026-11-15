"use client";

import { poems as allPoems, Poem } from "#site/content";
import { compareDesc, format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Shuffle,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import PossessedText from "@/components/PossessedText";

function PoemCard({ poem }: { poem: Poem }) {
  const tags = Array.isArray(poem.tags) ? poem.tags : [];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-destructive/40 hover:bg-card">
      {/* Top Header: Date & Mood */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
        <div>
          {poem.mood && <span>{poem.mood}</span>}
        </div>

        <time
          dateTime={poem.date}
          className="flex items-center gap-1"
        >
          <Calendar className="h-3 w-3 opacity-60" />
          {format(parseISO(poem.date), "MMM d, yyyy")}
        </time>
      </div>

      {/* Optional image if present */}
      {poem.image && (
        <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl border border-border/60">
          <Image
            src={poem.image}
            alt={poem.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Title */}
      <h2 className="mb-2 text-xl sm:text-2xl font-serif font-bold tracking-tight text-foreground transition-colors group-hover:text-destructive">
        <Link href={poem.url} className="no-underline">
          {poem.title}
        </Link>
      </h2>

      {/* Subtitle if available */}
      {poem.subtitle && (
        <p className="mb-3 text-xs sm:text-sm font-serif italic text-muted-foreground line-clamp-1">
          {poem.subtitle}
        </p>
      )}

      {/* Verse Excerpt Preview */}
      <div className="relative my-3 flex-1 rounded-xl border-l-2 border-border/80 bg-muted/20 px-4 py-3">
        <blockquote className="font-serif italic text-sm leading-relaxed text-foreground/80 whitespace-pre-line line-clamp-4">
          {poem.excerpt}
        </blockquote>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="my-2 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={`${poem.slug}-${tag}`}
              className="text-[11px] font-mono text-muted-foreground/75"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Info: Stanzas/Lines, Read Button */}
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Layers className="h-3.5 w-3.5 opacity-70" />
          <span>
            {poem.stanzasCount || 1} stanzas · {poem.linesCount || 10} lines
          </span>
        </div>

        <Link
          href={poem.url}
          className="inline-flex items-center gap-1 font-semibold text-destructive hover:underline group/btn"
        >
          <span>Read</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export default function PoemsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    allPoems.forEach((p) => {
      (p.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, []);

  const filteredPoems = useMemo(() => {
    return allPoems
      .slice()
      .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
      .filter((poem) => {
        const search = query.toLowerCase();
        const poemTags = Array.isArray(poem.tags) ? poem.tags : [];
        const rawContent = poem.body?.raw || "";

        const matchesSearch =
          !query ||
          poem.title.toLowerCase().includes(search) ||
          (poem.subtitle && poem.subtitle.toLowerCase().includes(search)) ||
          (poem.excerpt && poem.excerpt.toLowerCase().includes(search)) ||
          (poem.mood && poem.mood.toLowerCase().includes(search)) ||
          rawContent.toLowerCase().includes(search) ||
          poemTags.some((t) => t.toLowerCase().includes(search));

        const matchesTag =
          selectedTag === "all" || poemTags.includes(selectedTag);

        return matchesSearch && matchesTag;
      });
  }, [query, selectedTag]);

  const handleRandomPoem = () => {
    if (allPoems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allPoems.length);
    const target = allPoems[randomIndex];
    router.push(target.url);
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="mb-10 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-foreground">
              <PossessedText text="Poems" />
            </h1>
            <p className="mt-2 font-serif italic text-sm sm:text-base text-muted-foreground">
              A collection of verses, thoughts, and midnight reflections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">
              {allPoems.length} Poems
            </span>

            <button
              type="button"
              onClick={handleRandomPoem}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3.5 py-1.5 text-xs font-mono font-medium hover:border-destructive hover:text-destructive transition-colors cursor-pointer"
              title="Pick a random poem"
            >
              <Shuffle className="h-3 w-3" />
              <span>Random Poem</span>
            </button>
          </div>
        </div>

        {/* Search & Tag Controls */}
        <div className="flex flex-col gap-3">
          <div className="relative max-w-lg">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search poems..."
              className="w-full rounded-full border border-border bg-card/50 px-4 py-2.5 text-sm font-sans outline-none transition focus:border-destructive placeholder:text-muted-foreground"
            />
          </div>

          {/* Tag Filter Pills */}
          {availableTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-mono text-muted-foreground mr-1">
                Themes:
              </span>
              <button
                type="button"
                onClick={() => setSelectedTag("all")}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedTag === "all"
                    ? "bg-destructive/15 text-destructive font-medium border border-destructive/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                #all
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag === selectedTag ? "all" : tag)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedTag === tag
                      ? "bg-destructive/15 text-destructive font-medium border border-destructive/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Poems Grid */}
      {filteredPoems.length === 0 ? (
        <div className="my-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-serif italic text-sm text-muted-foreground">
            No poems match your search or filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedTag("all");
            }}
            className="mt-4 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-mono hover:bg-muted cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPoems.map((poem) => (
            <PoemCard key={poem.url} poem={poem} />
          ))}
        </div>
      )}
    </main>
  );
}
