import React from "react";

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  className?: string;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  canZoomIn,
  canZoomOut,
  className = "",
}) => {
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="p-2 bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 border border-gray-200 rounded-lg hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
        aria-label="Zoom out"
        title="Zoom out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M5 8a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        onClick={onReset}
        className="px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 text-sm font-semibold min-w-[70px] shadow-md hover:shadow-lg"
        aria-label="Reset zoom"
        title="Reset zoom"
      >
        {zoomPercentage}%
      </button>

      <button
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="p-2 bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 border border-gray-200 rounded-lg hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
        aria-label="Zoom in"
        title="Zoom in"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M8 5a1 1 0 011 1v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 110-2h1V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};
