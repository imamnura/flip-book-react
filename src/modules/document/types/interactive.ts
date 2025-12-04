/**
 * Interactive Links & Hotspots Structure
 * Defines data models untuk clickable areas pada flipbook pages
 */

export type HotspotType = "link" | "video" | "audio" | "product" | "popup";

export interface HotspotPosition {
  x: number; // Percentage dari left (0-100)
  y: number; // Percentage dari top (0-100)
  width: number; // Percentage dari page width
  height: number; // Percentage dari page height
}

export interface HotspotAction {
  type: HotspotType;

  // For link type
  url?: string;
  openInNewTab?: boolean;

  // For video type
  videoUrl?: string;
  videoId?: string; // YouTube/Vimeo ID
  videoPlatform?: "youtube" | "vimeo" | "custom";

  // For audio type
  audioUrl?: string;
  autoPlay?: boolean;

  // For product type
  productId?: string;
  productName?: string;
  productPrice?: number;
  productUrl?: string;

  // For popup type
  popupTitle?: string;
  popupContent?: string;
  popupImageUrl?: string;
}

export interface HotspotStyle {
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  opacity?: number;
  hoverEffect?: "glow" | "scale" | "highlight" | "none";
  cursor?: "pointer" | "help" | "zoom-in" | "default";
}

export interface Hotspot {
  id: string;
  pageNumber: number;
  position: HotspotPosition;
  action: HotspotAction;
  style?: HotspotStyle;

  // Metadata
  title?: string;
  description?: string;
  createdAt?: number;
  updatedAt?: number;

  // Analytics
  clickCount?: number;
  lastClickedAt?: number;
}

/**
 * Document-level interactive configuration
 */
export interface InteractiveConfig {
  documentId: string;
  hotspots: Hotspot[];

  // Global settings
  defaultStyle?: HotspotStyle;
  enableAnalytics?: boolean;
  showIndicators?: boolean;

  // Metadata
  version: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Analytics event untuk hotspot interactions
 */
export interface HotspotEvent {
  hotspotId: string;
  pageNumber: number;
  actionType: HotspotType;
  timestamp: number;
  sessionId: string;
}
