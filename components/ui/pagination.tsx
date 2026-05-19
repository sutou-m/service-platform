"use client";

import { cn } from "@/lib/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

const BUTTON_BASE =
  "inline-flex min-w-8 items-center justify-center rounded border px-3 py-1.5 text-sm transition-colors";

export function Pagination({
  currentPage,
  totalPages,
  onChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Show at most 7 page buttons with ellipsis for large ranges
  function getPages(): (number | "…")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "…")[] = [1];
    if (currentPage > 3) pages.push("…");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  return (
    <nav aria-label="ページネーション" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="前のページ"
        className={cn(
          BUTTON_BASE,
          "border-border text-foreground hover:bg-accent",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        ‹
      </button>

      {getPages().map((page, i) =>
        page === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              BUTTON_BASE,
              page === currentPage
                ? "border-ink bg-ink text-paper"
                : "border-border text-foreground hover:bg-accent"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="次のページ"
        className={cn(
          BUTTON_BASE,
          "border-border text-foreground hover:bg-accent",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        ›
      </button>
    </nav>
  );
}
