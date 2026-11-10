"use client";

import React, { useId } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface FigureProps {
  src: string;
  alt?: string;
  caption?: React.ReactNode;
  width?: number;
  height?: number;
  fullwidth?: boolean;
  className?: string;
}

/**
 * Standard Tufte Figure:
 * On desktop, occupies the 55% column, while caption floats into the right margin.
 * When fullwidth=true, spans across both text column and margin.
 */
export function Figure({
  src,
  alt = "",
  caption,
  width = 800,
  height = 500,
  fullwidth = false,
  className,
}: FigureProps) {
  return (
    <figure className={cn(fullwidth ? "fullwidth" : "", className)}>
      <div className="relative overflow-hidden rounded-lg border border-border">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized={!src.startsWith("/") && !src.startsWith("http")}
          className="w-full h-auto object-cover"
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/**
 * Full Width Figure: Convenience wrapper for full-width charts, diagrams, and maps.
 */
export function FullWidthFigure(props: Omit<FigureProps, "fullwidth">) {
  return <Figure {...props} fullwidth={true} />;
}

/**
 * Margin Figure: An image that sits exclusively in the right margin column.
 */
export interface MarginFigureProps {
  src: string;
  alt?: string;
  caption?: React.ReactNode;
  id?: string;
  width?: number;
  height?: number;
}

export function MarginFigure({
  src,
  alt = "",
  caption,
  id,
  width = 400,
  height = 300,
}: MarginFigureProps) {
  const generatedId = useId().replace(/[:]/g, "-");
  const noteId = id || `mf-${generatedId}`;

  return (
    <figure className="margin-figure">
      <label htmlFor={noteId} className="margin-toggle">
        &#8853;
      </label>
      <input type="checkbox" id={noteId} className="margin-toggle" />
      <span className="marginnote">
        <span className="block overflow-hidden rounded-md border border-border mb-2">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            unoptimized={!src.startsWith("/") && !src.startsWith("http")}
            className="w-full h-auto object-cover"
          />
        </span>
        {caption && <span className="block text-xs leading-relaxed">{caption}</span>}
      </span>
    </figure>
  );
}
