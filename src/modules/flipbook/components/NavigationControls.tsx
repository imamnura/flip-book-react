import React from "react";
import { useFlipbookStore } from "../store/flipbookStore";

interface NavigationControlsProps {
  className?: string;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  className = "",
}) => {
  const { currentPage, totalPages, prevPage, nextPage, isFlipping } =
    useFlipbookStore();

  const canGoPrev = currentPage > 0 && !isFlipping;
  const canGoNext = currentPage < totalPages - 1 && !isFlipping;

  return (
    <nav
      className={`flex items-center gap-6 ${className}`}
      aria-label="Page navigation"
    >
      <button
        onClick={prevPage}
        disabled={!canGoPrev}
        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center gap-2 font-medium"
        aria-label="Previous page"
        title="Previous page (Left arrow)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>Previous</span>
      </button>

      <div
        className="px-6 py-2.5 bg-white rounded-lg border-2 border-purple-200 text-base font-bold text-gray-800 shadow-sm min-w-[100px] text-center"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-purple-600">{currentPage + 1}</span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{totalPages}</span>
      </div>

      <button
        onClick={nextPage}
        disabled={!canGoNext}
        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center gap-2 font-medium"
        aria-label="Next page"
        title="Next page (Right arrow)"
      >
        <span>Next</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </nav>
  );
};
