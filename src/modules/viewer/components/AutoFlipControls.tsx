import React from "react";

interface AutoFlipControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

export const AutoFlipControls: React.FC<AutoFlipControlsProps> = ({
  isPlaying,
  onToggle,
  speed,
  onSpeedChange,
  className = "",
}) => {
  const speeds = [
    { value: 1000, label: "Slow" },
    { value: 2000, label: "Normal" },
    { value: 3000, label: "Fast" },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onToggle}
        className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        aria-label={isPlaying ? "Stop auto-flip" : "Start auto-flip"}
        title={isPlaying ? "Stop auto-flip" : "Start auto-flip"}
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {isPlaying && (
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
          aria-label="Auto-flip speed"
        >
          {speeds.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
