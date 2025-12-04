import React from "react";

interface SpreadToggleProps {
  isDoubleSpread: boolean;
  onToggle: () => void;
  className?: string;
}

export const SpreadToggle: React.FC<SpreadToggleProps> = ({
  isDoubleSpread,
  onToggle,
  className = "",
}) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${className}`}
      aria-label={isDoubleSpread ? "Single page view" : "Double page view"}
      title={isDoubleSpread ? "Single page view" : "Double page view"}
    >
      {isDoubleSpread ? (
        // Single page icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="6" y="4" width="12" height="16" rx="1" />
        </svg>
      ) : (
        // Double page icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="8" height="16" rx="1" />
          <rect x="13" y="4" width="8" height="16" rx="1" />
        </svg>
      )}
    </button>
  );
};
