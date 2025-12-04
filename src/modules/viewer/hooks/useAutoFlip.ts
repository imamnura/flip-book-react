import { useState, useEffect, useCallback } from "react";
import { useFlipbookStore } from "../../flipbook/store/flipbookStore";

interface UseAutoFlipOptions {
  initialSpeed?: number;
  enabled?: boolean;
}

export const useAutoFlip = ({
  initialSpeed = 2000,
  enabled = true,
}: UseAutoFlipOptions = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const { nextPage, currentPage, totalPages } = useFlipbookStore();

  const start = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!enabled || !isPlaying) return;

    const interval = setInterval(() => {
      // Stop if we reached the last page
      if (currentPage >= totalPages - 1) {
        setIsPlaying(false);
        return;
      }
      nextPage();
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, enabled, nextPage, currentPage, totalPages]);

  return {
    isPlaying,
    speed,
    start,
    stop,
    toggle,
    setSpeed,
  };
};
