import type {
  InteractiveConfig,
  Hotspot,
} from "@/modules/document/types/interactive";

/**
 * Sample interactive configuration
 * Shows different types of hotspots
 */
export const generateSampleInteractiveConfig = (): InteractiveConfig => {
  const hotspots: Hotspot[] = [
    // Page 1: Link hotspot
    {
      id: "hotspot-1",
      pageNumber: 1,
      position: {
        x: 20,
        y: 30,
        width: 30,
        height: 15,
      },
      action: {
        type: "link",
        url: "https://github.com",
        openInNewTab: true,
      },
      title: "Visit GitHub",
      description: "Click to open GitHub in new tab",
      clickCount: 0,
      createdAt: Date.now(),
    },

    // Page 2: Video hotspot
    {
      id: "hotspot-2",
      pageNumber: 2,
      position: {
        x: 40,
        y: 25,
        width: 35,
        height: 20,
      },
      action: {
        type: "video",
        videoId: "dQw4w9WgXcQ",
        videoPlatform: "youtube",
      },
      title: "Watch Video",
      description: "Click to play video",
      style: {
        borderColor: "rgba(239, 68, 68, 0.5)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        hoverEffect: "glow",
      },
      clickCount: 0,
      createdAt: Date.now(),
    },

    // Page 3: Product hotspot
    {
      id: "hotspot-3",
      pageNumber: 3,
      position: {
        x: 15,
        y: 40,
        width: 25,
        height: 30,
      },
      action: {
        type: "product",
        productId: "prod-123",
        productName: "Sample Product",
        productPrice: 99.99,
        productUrl: "https://example.com/product",
      },
      title: "Buy Now",
      description: "Click for product details",
      style: {
        borderColor: "rgba(34, 197, 94, 0.5)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        hoverEffect: "scale",
      },
      clickCount: 0,
      createdAt: Date.now(),
    },

    // Page 4: Popup hotspot
    {
      id: "hotspot-4",
      pageNumber: 4,
      position: {
        x: 50,
        y: 50,
        width: 30,
        height: 20,
      },
      action: {
        type: "popup",
        popupTitle: "More Information",
        popupContent:
          "This is additional content that appears in a popup modal.",
      },
      title: "Learn More",
      description: "Click for more information",
      style: {
        borderColor: "rgba(168, 85, 247, 0.5)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        hoverEffect: "highlight",
      },
      clickCount: 0,
      createdAt: Date.now(),
    },
  ];

  return {
    documentId: "sample-document",
    hotspots,
    defaultStyle: {
      borderColor: "rgba(59, 130, 246, 0.5)",
      borderWidth: 2,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      opacity: 1,
      hoverEffect: "glow",
      cursor: "pointer",
    },
    enableAnalytics: true,
    showIndicators: true,
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};
