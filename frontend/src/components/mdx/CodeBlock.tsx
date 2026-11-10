"use client";

import React, { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  filename?: string;
  fullwidth?: boolean;
  showLineNumbers?: boolean;
  language?: string;
}

export function CodeBlock({
  children,
  className,
  filename,
  fullwidth = false,
  showLineNumbers = true,
  language: propLanguage,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract raw text from children
  let code = "";
  if (typeof children === "string") {
    code = children;
  } else if (React.isValidElement(children)) {
    const childProps = children.props as { children?: React.ReactNode; className?: string };
    if (typeof childProps?.children === "string") {
      code = childProps.children;
    }
  }

  // Detect language from class (e.g. language-typescript or language-python)
  let detectedLang = propLanguage || "";
  if (!detectedLang && className) {
    const match = className.match(/language-([a-z0-9_-]+)/i);
    if (match) detectedLang = match[1];
  }
  if (!detectedLang && React.isValidElement(children)) {
    const childClass = (children.props as { className?: string })?.className || "";
    const match = childClass.match(/language-([a-z0-9_-]+)/i);
    if (match) detectedLang = match[1];
  }

  // Fallbacks and aliases
  let lang = detectedLang.toLowerCase() || "text";
  if (lang === "js") lang = "javascript";
  if (lang === "ts") lang = "typescript";
  if (lang === "sh" || lang === "shell" || lang === "zsh") lang = "bash";
  if (lang === "yml") lang = "yaml";
  if (lang === "py") lang = "python";
  if (lang === "rs") lang = "rust";

  const cleanCode = code.replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard fails
    }
  };

  const isFull = fullwidth || className?.includes("fullwidth");

  return (
    <div
      className={cn(
        "group relative my-6 overflow-hidden rounded-xl border border-border bg-[#18181b] text-zinc-100 shadow-md",
        isFull ? "w-full tufte-fullwidth clear-both" : "w-full"
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2 text-xs font-mono text-zinc-400 select-none">
        <span className="font-semibold text-zinc-300">
          {filename || (lang !== "text" ? lang.toUpperCase() : "CODE")}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <Highlight theme={themes.vsDark} code={cleanCode} language={lang}>
        {({ className: highlightClass, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              highlightClass,
              "m-0 overflow-x-auto p-4 text-[0.92rem] leading-6 font-mono !bg-transparent !w-full"
            )}
            style={{ ...style, backgroundColor: "transparent" }}
          >
            <code>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line, key: i });
                return (
                  <div key={i} {...lineProps} className={cn(lineProps.className, "table-row")}>
                    {showLineNumbers && (
                      <span className="table-cell pr-4 text-right select-none text-zinc-600 text-xs font-mono">
                        {i + 1}
                      </span>
                    )}
                    <span className="table-cell">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
