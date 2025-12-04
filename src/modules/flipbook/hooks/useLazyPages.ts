import { useMemo } from "react";
import type { DocumentPage } from "../../document/types/document";

interface UseLazyPagesOptions {
  pages: DocumentPage[];
  currentPage: number;
  preloadRange?: number;
}

/**
 * Hook untuk lazy loading pages
 * Hanya render pages yang visible + range sebelum/sesudah
 */
export const useLazyPages = ({
  pages,
  currentPage,
  preloadRange = 2,
}: UseLazyPagesOptions) => {
  const visiblePages = useMemo(() => {
    if (pages.length === 0) return [];

    const startIndex = Math.max(0, currentPage - preloadRange);
    const endIndex = Math.min(pages.length - 1, currentPage + preloadRange);

    // Return pages dalam range dengan placeholder untuk yang lain
    return pages.map((page, index) => {
      const isInRange = index >= startIndex && index <= endIndex;

      if (isInRange) {
        return page;
      }

      // Return placeholder untuk pages di luar range
      return {
        ...page,
        isPlaceholder: true,
      };
    });
  }, [pages, currentPage, preloadRange]);

  const stats = useMemo(() => {
    const loadedCount = visiblePages.filter(
      (p) => !("isPlaceholder" in p && p.isPlaceholder)
    ).length;
    return {
      total: pages.length,
      loaded: loadedCount,
      percentage:
        pages.length > 0 ? Math.round((loadedCount / pages.length) * 100) : 0,
    };
  }, [visiblePages, pages.length]);

  return {
    visiblePages,
    stats,
  };
};
