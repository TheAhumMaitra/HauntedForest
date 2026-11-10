"use client";

import React, { useId } from "react";

export interface MarginNoteProps {
  id?: string;
  symbol?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Tufte CSS Margin Note (unnumbered note in the margin)
 * Desktop: sits alongside text in the right margin without a number.
 * Mobile: collapses into a circled plus symbol ⊕ that toggles the note inline.
 */
export function MarginNote({ id, symbol = "⊕", children }: MarginNoteProps) {
  const generatedId = useId().replace(/[:]/g, "-");
  const noteId = id || `mn-${generatedId}`;

  return (
    <>
      <label htmlFor={noteId} className="margin-toggle">
        {symbol}
      </label>
      <input type="checkbox" id={noteId} className="margin-toggle" />
      <span className="marginnote">{children}</span>
    </>
  );
}
