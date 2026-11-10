"use client";

import React, { useId } from "react";

export interface SidenoteProps {
  id?: string;
  children: React.ReactNode;
}

/**
 * Tufte CSS Sidenote (automatically numbered footnote in the right margin)
 * Desktop: sits alongside text in the right margin.
 * Mobile: collapses into a clickable superscript number that toggles note inline.
 */
export function Sidenote({ id, children }: SidenoteProps) {
  const generatedId = useId().replace(/[:]/g, "-");
  const noteId = id || `sn-${generatedId}`;

  return (
    <>
      <label htmlFor={noteId} className="margin-toggle sidenote-number"></label>
      <input type="checkbox" id={noteId} className="margin-toggle" />
      <span className="sidenote">{children}</span>
    </>
  );
}
