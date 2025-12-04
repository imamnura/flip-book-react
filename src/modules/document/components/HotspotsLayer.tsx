import React from "react";
import { useInteractiveStore } from "@/modules/document/store/interactiveStore";
import { HotspotOverlay } from "./HotspotOverlay";

interface HotspotsLayerProps {
  pageNumber: number;
  pageWidth: number;
  pageHeight: number;
  sessionId: string;
  isEditMode?: boolean;
}

/**
 * Renders all hotspots for a specific page
 */
export const HotspotsLayer: React.FC<HotspotsLayerProps> = ({
  pageNumber,
  pageWidth,
  pageHeight,
  sessionId,
  isEditMode = false,
}) => {
  const { getHotspotsByPage, config } = useInteractiveStore();

  if (!config || !config.showIndicators) {
    return null;
  }

  const hotspots = getHotspotsByPage(pageNumber);

  if (hotspots.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {hotspots.map((hotspot) => (
        <div key={hotspot.id} className="pointer-events-auto">
          <HotspotOverlay
            hotspot={hotspot}
            pageWidth={pageWidth}
            pageHeight={pageHeight}
            sessionId={sessionId}
            isEditMode={isEditMode}
          />
        </div>
      ))}
    </div>
  );
};
