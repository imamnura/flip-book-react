import { create } from "zustand";
import type {
  Hotspot,
  InteractiveConfig,
  HotspotEvent,
} from "@/modules/document/types/interactive";

interface InteractiveStore {
  // State
  config: InteractiveConfig | null;
  selectedHotspot: Hotspot | null;
  isEditMode: boolean;
  events: HotspotEvent[];

  // Actions
  loadConfig: (config: InteractiveConfig) => void;
  addHotspot: (hotspot: Hotspot) => void;
  updateHotspot: (id: string, updates: Partial<Hotspot>) => void;
  deleteHotspot: (id: string) => void;
  selectHotspot: (id: string | null) => void;
  setEditMode: (isEditMode: boolean) => void;

  // Analytics
  trackHotspotClick: (hotspotId: string, sessionId: string) => void;
  getHotspotsByPage: (pageNumber: number) => Hotspot[];
  getHotspotStats: () => {
    totalClicks: number;
    topHotspots: Array<{ id: string; clicks: number }>;
  };

  // Persistence
  exportConfig: () => string;
  importConfig: (json: string) => void;
  reset: () => void;
}

const initialState = {
  config: null,
  selectedHotspot: null,
  isEditMode: false,
  events: [],
};

export const useInteractiveStore = create<InteractiveStore>((set, get) => ({
  ...initialState,

  loadConfig: (config) => {
    set({ config });
  },

  addHotspot: (hotspot) => {
    const { config } = get();
    if (!config) return;

    set({
      config: {
        ...config,
        hotspots: [...config.hotspots, hotspot],
        updatedAt: Date.now(),
      },
    });
  },

  updateHotspot: (id, updates) => {
    const { config } = get();
    if (!config) return;

    set({
      config: {
        ...config,
        hotspots: config.hotspots.map((h) =>
          h.id === id ? { ...h, ...updates, updatedAt: Date.now() } : h
        ),
        updatedAt: Date.now(),
      },
    });
  },

  deleteHotspot: (id) => {
    const { config } = get();
    if (!config) return;

    set({
      config: {
        ...config,
        hotspots: config.hotspots.filter((h) => h.id !== id),
        updatedAt: Date.now(),
      },
      selectedHotspot:
        get().selectedHotspot?.id === id ? null : get().selectedHotspot,
    });
  },

  selectHotspot: (id) => {
    const { config } = get();
    if (!config) return;

    const hotspot = id
      ? config.hotspots.find((h) => h.id === id) || null
      : null;
    set({ selectedHotspot: hotspot });
  },

  setEditMode: (isEditMode) => {
    set({ isEditMode });
  },

  trackHotspotClick: (hotspotId, sessionId) => {
    const { config, events } = get();
    if (!config) return;

    // Find hotspot
    const hotspot = config.hotspots.find((h) => h.id === hotspotId);
    if (!hotspot) return;

    // Record event
    const event: HotspotEvent = {
      hotspotId,
      pageNumber: hotspot.pageNumber,
      actionType: hotspot.action.type,
      timestamp: Date.now(),
      sessionId,
    };

    // Update hotspot click count
    get().updateHotspot(hotspotId, {
      clickCount: (hotspot.clickCount || 0) + 1,
      lastClickedAt: Date.now(),
    });

    set({ events: [...events, event] });
  },

  getHotspotsByPage: (pageNumber) => {
    const { config } = get();
    if (!config) return [];

    return config.hotspots.filter((h) => h.pageNumber === pageNumber);
  },

  getHotspotStats: () => {
    const { config } = get();
    if (!config) return { totalClicks: 0, topHotspots: [] };

    const totalClicks = config.hotspots.reduce(
      (sum, h) => sum + (h.clickCount || 0),
      0
    );
    const topHotspots = config.hotspots
      .filter((h) => h.clickCount && h.clickCount > 0)
      .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
      .slice(0, 5)
      .map((h) => ({ id: h.id, clicks: h.clickCount || 0 }));

    return { totalClicks, topHotspots };
  },

  exportConfig: () => {
    const { config } = get();
    if (!config) return "{}";

    return JSON.stringify(config, null, 2);
  },

  importConfig: (json) => {
    try {
      const config = JSON.parse(json) as InteractiveConfig;
      set({ config });
    } catch (error) {
      console.error("Failed to import config:", error);
    }
  },

  reset: () => {
    set(initialState);
  },
}));
