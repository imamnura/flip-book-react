import React, { useRef, useEffect } from "react";
import { useFlipbookStore } from "../store/flipbookStore";
import type { DocumentPage } from "../../document/types/document";

interface ThumbnailBarProps {
  className?: string;
  position?: "bottom" | "side";
}

export const ThumbnailBar: React.FC<ThumbnailBarProps> = ({
  className = "",
  position = "bottom",
}) => {
  const { pages, currentPage, goToPage } = useFlipbookStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active thumbnail
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentPage]);

  if (pages.length === 0) return null;

  const isVertical = position === "side";

  return (
    <div
      ref={containerRef}
      className={`
        ${isVertical ? "flex flex-col overflow-y-auto" : "flex overflow-x-auto"}
        gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner
        ${className}
      `}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#667eea #f1f1f1",
      }}
    >
      {pages.map((page, index) => (
        <ThumbnailItem
          key={page.id}
          page={page}
          index={index}
          isActive={index === currentPage}
          onClick={() => goToPage(index)}
          ref={index === currentPage ? activeRef : null}
        />
      ))}
    </div>
  );
};

interface ThumbnailItemProps {
  page: DocumentPage;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const ThumbnailItem = React.forwardRef<HTMLButtonElement, ThumbnailItemProps>(
  ({ page, index, isActive, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`
          relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105
          ${
            isActive
              ? "ring-4 ring-purple-500 shadow-2xl scale-105"
              : "ring-2 ring-gray-300 hover:ring-purple-300 hover:shadow-xl"
          }
        `}
        style={{ width: "100px", height: "140px" }}
        aria-label={`Go to page ${index + 1}`}
      >
        {page.type === "image" ? (
          <img
            src={page.content}
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-white p-1 overflow-hidden">
            <div
              className="text-xs"
              style={{
                transform: "scale(0.2)",
                transformOrigin: "top left",
                width: "500%",
                height: "500%",
              }}
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        )}
        <div
          className={`absolute bottom-0 left-0 right-0 py-1.5 text-center text-xs font-semibold transition-all ${
            isActive
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              : "bg-black/70 text-white"
          }`}
        >
          {index + 1}
        </div>
        {isActive && (
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg" />
          </div>
        )}
      </button>
    );
  }
);

ThumbnailItem.displayName = "ThumbnailItem";
