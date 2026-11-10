"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";
import { cn } from "@/lib/utils";

import { CodeBlock } from "./CodeBlock";
import { Sidenote } from "./Sidenote";
import { MarginNote } from "./MarginNote";
import { Figure, FullWidthFigure, MarginFigure } from "./Figures";
import { Epigraph } from "./Epigraph";
import { NewThought, Sans, Numeral, FullWidth } from "./Typography";
import { Callout } from "./Callout";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const mdxComponents = {
  // Tufte Elements
  Sidenote,
  MarginNote,
  Figure,
  FullWidthFigure,
  MarginFigure,
  Epigraph,
  NewThought,
  Sans,
  Numeral,
  FullWidth,
  Callout,
  CodeBlock,

  // Built-in Next / UI Components
  Image,
  Link,
  Badge,
  Button,
  Card,

  // Enhanced HTML elements
  a: ({ href, children, className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href && (href.startsWith("/") || href.startsWith("#"));
    if (isInternal) {
      return (
        <Link href={href as string} className={cn("hover:text-primary transition-colors", className)} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("hover:text-primary transition-colors", className)}
        {...props}
      >
        {children}
      </a>
    );
  },

  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    // Check if the pre directly wraps a code element
    if (React.isValidElement(children)) {
      return <CodeBlock {...(children.props as object)} {...props} />;
    }
    return <CodeBlock {...props}>{children}</CodeBlock>;
  },

  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    // If this code tag is inline
    return (
      <code className={cn("rounded px-1.5 py-0.5 font-mono text-[0.88em]", className)} {...props}>
        {children}
      </code>
    );
  },

  table: ({ children, className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => {
    const isFull = className?.includes("fullwidth");
    return (
      <div className={cn("table-wrapper", isFull && "fullwidth")}>
        <table className={className} {...props}>
          {children}
        </table>
      </div>
    );
  },

  blockquote: ({ children, className, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => {
    return (
      <blockquote className={cn("my-6 italic", className)} {...props}>
        {children}
      </blockquote>
    );
  },

  hr: (props: React.HTMLAttributes<HTMLHRElement>) => <hr {...props} />,

  img: ({ src, alt, className }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src || typeof src !== "string") return null;
    return (
      <span className="block my-6 overflow-hidden rounded-lg border border-border">
        <Image
          src={src}
          alt={alt || ""}
          width={800}
          height={500}
          unoptimized={!src.startsWith("/") && !src.startsWith("http")}
          className={cn("w-full h-auto object-cover", className)}
        />
      </span>
    );
  },
};

export interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return React.createElement(Component, { components: mdxComponents });
}
