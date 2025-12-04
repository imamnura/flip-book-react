import { useState, useCallback } from "react";

interface UseZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  step?: number;
  initialZoom?: number;
}

export const useZoom = ({
  minZoom = 0.5,
  maxZoom = 3,
  step = 0.25,
  initialZoom = 1,
}: UseZoomOptions = {}) => {
  const [zoom, setZoom] = useState(initialZoom);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + step, maxZoom));
  }, [step, maxZoom]);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - step, minZoom));
  }, [step, minZoom]);

  const resetZoom = useCallback(() => {
    setZoom(initialZoom);
  }, [initialZoom]);

  const setZoomLevel = useCallback(
    (level: number) => {
      setZoom(Math.max(minZoom, Math.min(level, maxZoom)));
    },
    [minZoom, maxZoom]
  );

  const canZoomIn = zoom < maxZoom;
  const canZoomOut = zoom > minZoom;

  return {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomLevel,
    canZoomIn,
    canZoomOut,
    zoomPercentage: Math.round(zoom * 100),
  };
};
