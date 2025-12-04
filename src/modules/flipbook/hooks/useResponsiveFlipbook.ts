import { useState, useEffect, useCallback } from "react";

interface UseResponsiveFlipbookOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  aspectRatio?: number; // width / height (e.g., 1.414 for A4)
  maxWidth?: number;
  maxHeight?: number;
  padding?: number;
}

interface FlipbookDimensions {
  width: number;
  height: number;
}

export const useResponsiveFlipbook = ({
  containerRef,
  aspectRatio = 1.414, // A4 ratio by default
  maxWidth = 1200,
  maxHeight = 800,
  padding = 40,
}: UseResponsiveFlipbookOptions) => {
  const [dimensions, setDimensions] = useState<FlipbookDimensions>({
    width: 600,
    height: 424,
  });

  const calculateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth - padding * 2;
    const containerHeight = container.clientHeight - padding * 2;

    let width = Math.min(containerWidth, maxWidth);
    let height = width / aspectRatio;

    // If height exceeds container, recalculate based on height
    if (height > Math.min(containerHeight, maxHeight)) {
      height = Math.min(containerHeight, maxHeight);
      width = height * aspectRatio;
    }

    setDimensions({
      width: Math.floor(width),
      height: Math.floor(height),
    });
  }, [containerRef, aspectRatio, maxWidth, maxHeight, padding]);

  useEffect(() => {
    calculateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      calculateDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateDimensions, containerRef]);

  return dimensions;
};
