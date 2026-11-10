import React from "react";
import { cn } from "@/lib/utils";

/**
 * Tufte NewThought:
 * Renders small-caps styling for introductory sentence phrases,
 * establishing the opening thought of a section.
 */
export function NewThought({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("newthought", className)}>{children}</span>;
}

/**
 * Tufte Sans:
 * Renders text in Tufte's Gill Sans / Clean Sans font stack.
 */
export function Sans({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("sans", className)}>{children}</span>;
}

/**
 * Tufte Old-Style Numeral:
 * Uses proportional old-style figures.
 */
export function Numeral({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("numeral", className)}>{children}</span>;
}

/**
 * Full Width Container:
 * Allows any custom block or widget to break out to the full width of the layout.
 */
export function FullWidth({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("fullwidth my-6 clear-both", className)}>{children}</div>;
}
