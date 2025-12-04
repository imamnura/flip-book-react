import React from "react";
import type { Hotspot } from "@/modules/document/types/interactive";
import { useInteractiveStore } from "@/modules/document/store/interactiveStore";

interface HotspotOverlayProps {
  hotspot: Hotspot;
  pageWidth: number;
  pageHeight: number;
  sessionId: string;
  isEditMode?: boolean;
}

export const HotspotOverlay: React.FC<HotspotOverlayProps> = ({
  hotspot,
  pageWidth: _pageWidth, // Reserved for future use
  pageHeight: _pageHeight, // Reserved for future use
  sessionId,
  isEditMode = false,
}) => {
  const { trackHotspotClick, selectHotspot } = useInteractiveStore();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isEditMode) {
      // In edit mode, select hotspot for editing
      selectHotspot(hotspot.id);
      return;
    }

    // Track the click
    trackHotspotClick(hotspot.id, sessionId);

    // Execute action
    const { action } = hotspot;

    switch (action.type) {
      case "link":
        if (action.url) {
          if (action.openInNewTab) {
            window.open(action.url, "_blank", "noopener,noreferrer");
          } else {
            window.location.href = action.url;
          }
        }
        break;

      case "video":
        // TODO: Open video modal
        console.log("Play video:", action.videoUrl || action.videoId);
        break;

      case "audio":
        // TODO: Play audio
        console.log("Play audio:", action.audioUrl);
        break;

      case "product":
        // TODO: Open product modal
        console.log("Show product:", action.productId);
        break;

      case "popup":
        // TODO: Show popup modal
        console.log("Show popup:", action.popupTitle);
        break;

      default:
        console.warn("Unknown hotspot type:", action.type);
    }
  };

  // Calculate absolute position
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${hotspot.position.x}%`,
    top: `${hotspot.position.y}%`,
    width: `${hotspot.position.width}%`,
    height: `${hotspot.position.height}%`,

    // Default styling
    border: `${hotspot.style?.borderWidth || 2}px solid ${
      hotspot.style?.borderColor || "rgba(59, 130, 246, 0.5)"
    }`,
    backgroundColor:
      hotspot.style?.backgroundColor || "rgba(59, 130, 246, 0.1)",
    opacity: hotspot.style?.opacity || 1,
    cursor: hotspot.style?.cursor || "pointer",

    // Animation
    transition: "all 0.2s ease",

    // Visual feedback
    borderRadius: "4px",
  };

  const hoverStyle: React.CSSProperties = {
    ...style,
    backgroundColor:
      hotspot.style?.backgroundColor || "rgba(59, 130, 246, 0.2)",
    boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isHovered ? hoverStyle : style}
      title={hotspot.title || `${hotspot.action.type} hotspot`}
      role="button"
      tabIndex={0}
      aria-label={hotspot.description || hotspot.title}
    >
      {/* Show icon based on type */}
      {isEditMode && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 rounded-bl">
          {hotspot.action.type}
        </div>
      )}
    </div>
  );
};
