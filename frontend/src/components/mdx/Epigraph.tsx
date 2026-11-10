import React from "react";

export interface EpigraphProps {
  quote?: React.ReactNode;
  author?: React.ReactNode;
  source?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Tufte Chapter/Article Epigraph:
 * A distinctive introductory quote with citation, styled according to Edward Tufte's layouts.
 */
export function Epigraph({ quote, author, source, children }: EpigraphProps) {
  return (
    <div className="epigraph">
      <blockquote>
        <p>{quote || children}</p>
        {(author || source) && (
          <footer>
            {author}
            {source && (
              <>
                , <cite>{source}</cite>
              </>
            )}
          </footer>
        )}
      </blockquote>
    </div>
  );
}
