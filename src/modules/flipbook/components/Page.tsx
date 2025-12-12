import { forwardRef, memo } from "react";
import type { DocumentPage } from "../../document/types/document";

interface PageProps {
  page: DocumentPage;
  isPlaceholder?: boolean;
  className?: string;
}

const PageComponent = forwardRef<HTMLDivElement, PageProps>(
  ({ page, isPlaceholder = false, className = "" }, ref) => {
    // Render placeholder untuk pages yang belum di-load
    if (isPlaceholder) {
      return (
        <div
          ref={ref}
          className={`relative w-full h-full bg-gray-100 ${className}`}
          data-page-number={page.pageNumber}
          role="img"
          aria-label={`Page ${page.pageNumber} (loading)`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="w-12 h-12 mx-auto mb-3 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
              <p className="text-sm">Page {page.pageNumber}</p>
            </div>
          </div>
        </div>
      );
    }

    if (page.type === "image") {
      return (
        <div
          ref={ref}
          className={`relative w-full h-full bg-white ${className}`}
          data-page-number={page.pageNumber}
          role="img"
          aria-label={`Page ${page.pageNumber}`}
        >
          <img
            src={page.content}
            alt={`Page ${page.pageNumber}`}
            className="w-full h-full object-contain"
            draggable={false}
            loading="lazy"
          />
        </div>
      );
    }

    // HTML page
    return (
      <div
        ref={ref}
        className={`relative w-full h-full bg-white p-4 overflow-auto ${className}`}
        data-page-number={page.pageNumber}
        role="article"
        aria-label={`Page ${page.pageNumber}`}
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    );
  }
);

PageComponent.displayName = "Page";

// Memoize untuk prevent unnecessary re-renders
export const Page = memo(PageComponent);
