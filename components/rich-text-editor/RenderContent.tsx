"use client";

import { type JSONContent } from "@tiptap/react";

import { RenderDescription } from "./RenderDescription";

interface RenderContentProps {
  content: string | JSONContent;
  className?: string;
  fallbackClassName?: string;
}

/**
 * Component untuk merender konten yang bisa berupa string atau JSON rich text
 * Secara otomatis mendeteksi format dan merender dengan benar
 */
export function RenderContent({
  content,
  className = "",
  fallbackClassName = "prose prose-sm text-muted-foreground",
}: RenderContentProps) {
  if (!content) return null;

  try {
    // Try to parse as JSON if it's a string
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    // If it's a valid JSON object with type property, render with RenderDescription
    if (parsed && typeof parsed === "object" && parsed.type) {
      return (
        <div className={className}>
          <RenderDescription json={parsed} />
        </div>
      );
    }

    // Otherwise render as plain text
    return (
      <div className={fallbackClassName}>
        <p className="whitespace-pre-wrap leading-relaxed">
          {typeof content === "string" ? content : JSON.stringify(content)}
        </p>
      </div>
    );
  } catch {
    // If JSON parsing fails, render as plain text
    return (
      <div className={fallbackClassName}>
        <p className="whitespace-pre-wrap leading-relaxed">
          {typeof content === "string" ? content : JSON.stringify(content)}
        </p>
      </div>
    );
  }
}
