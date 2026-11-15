"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Poem } from "#site/content";
import { MDXContent } from "@/components/mdx/MDXComponents";

interface PoemReaderProps {
  poem: Poem;
  prevPoem: Poem | null;
  nextPoem: Poem | null;
}

export default function PoemReader({
  poem,
  prevPoem,
  nextPoem,
}: PoemReaderProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const tags = Array.isArray(poem.tags) ? poem.tags : [];

  const handleCopy = async () => {
    try {
      const textToCopy = `${poem.title}\n${poem.subtitle ? poem.subtitle + "\n" : ""}\nBy ${poem.author}\n\n${poem.body.raw.replace(/^---[\s\S]*?---/, "").trim()}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen w-full pb-20 pt-6">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Minimal Top Navigation */}
        <nav className="mb-10 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <Link
            href="/poems"
            className="group inline-flex items-center gap-2 hover:text-foreground no-underline transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>All Poems</span>
          </Link>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1 hover:bg-muted transition-colors cursor-pointer"
            title="Copy poem text"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </nav>

        {/* Poem Header */}
        <header className="mb-10">
          {poem.mood && (
            <div className="mb-2 text-xs font-mono text-muted-foreground/80">
              {poem.mood}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-foreground leading-tight mb-2">
            {poem.title}
          </h1>

          {/* Subtitle */}
          {poem.subtitle && (
            <p className="text-base sm:text-lg font-serif italic text-muted-foreground mb-4 leading-relaxed">
              {poem.subtitle}
            </p>
          )}

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 border-y border-border/70 text-xs font-mono text-muted-foreground mt-4">
            <span className="text-foreground font-medium">
              <Link
                href="/authors/ahummaitra"
                className="hover:text-destructive transition-colors no-underline"
              >
                {poem.author}
              </Link>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 opacity-60" />
              <time dateTime={poem.date}>
                {format(parseISO(poem.date), "MMMM d, yyyy")}
              </time>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3 opacity-60" />
              <span>
                {poem.stanzasCount || 1} stanzas, {poem.linesCount || 10} lines
              </span>
            </span>
          </div>

          {/* Optional Artplate */}
          {poem.image && (
            <div className="relative my-6 overflow-hidden rounded-2xl border border-border/70 shadow-sm">
              <Image
                src={poem.image}
                alt={poem.title}
                width={1000}
                height={500}
                className="w-full h-auto object-cover max-h-[400px]"
                priority
              />
            </div>
          )}
        </header>

        {/* Poem Verse Body */}
        <article className="tufte-layout my-8">
          <div className="poem-body py-2">
            <MDXContent code={poem.body.code} />
          </div>

          {/* End Fleuron */}
          <div className="my-10 text-center text-muted-foreground/60 select-none font-serif">
            <span className="text-lg">❦</span>
          </div>
        </article>

        {/* Minimal Poet Bio Card */}
        <div className="my-8 flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Written by</span>
            <Link
              href="/authors/ahummaitra"
              className="font-semibold text-foreground hover:text-destructive transition-colors no-underline"
            >
              {poem.author}
            </Link>
          </div>
          <Link
            href="/authors/ahummaitra"
            className="text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            Author Profile →
          </Link>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="my-6 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-4">
            <span className="text-xs font-mono text-muted-foreground mr-1">
              Themes:
            </span>
            {tags.map((tag) => (
              <Link
                key={tag}
                href="/poems"
                className="text-xs font-mono text-muted-foreground/80 hover:text-foreground transition-colors no-underline"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Previous / Next Poem Navigation */}
        {(prevPoem || nextPoem) && (
          <nav
            aria-label="Poem pagination"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 pt-2"
          >
            {prevPoem ? (
              <Link
                href={prevPoem.url}
                className="group flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card/30 hover:bg-card hover:border-destructive/40 transition-all no-underline shadow-xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-1 group-hover:text-destructive transition-colors">
                  <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>Previous Poem</span>
                </div>
                <div className="font-serif font-medium text-foreground line-clamp-1 group-hover:text-destructive transition-colors text-sm">
                  {prevPoem.title}
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPoem ? (
              <Link
                href={nextPoem.url}
                className="group flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card/30 hover:bg-card hover:border-destructive/40 transition-all no-underline text-right shadow-xs"
              >
                <div className="flex items-center justify-end gap-1.5 text-xs font-mono text-muted-foreground mb-1 group-hover:text-destructive transition-colors">
                  <span>Next Poem</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
                <div className="font-serif font-medium text-foreground line-clamp-1 group-hover:text-destructive transition-colors text-sm">
                  {nextPoem.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link
            href="/poems"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground no-underline transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Poems</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
