import { create } from "zustand";
import type { DocumentPage } from "../../document/types/document";

interface FlipbookState {
  pages: DocumentPage[];
  currentPage: number;
  totalPages: number;
  isFlipping: boolean;
  viewMode: "single" | "double";

  // Actions
  setPages: (pages: DocumentPage[]) => void;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setIsFlipping: (isFlipping: boolean) => void;
  toggleViewMode: () => void;
  reset: () => void;
}

export const useFlipbookStore = create<FlipbookState>((set, get) => ({
  pages: [],
  currentPage: 0,
  totalPages: 0,
  isFlipping: false,
  viewMode: "single",

  setPages: (pages) => set({ pages, totalPages: pages.length, currentPage: 0 }),

  setCurrentPage: (page) => {
    const { totalPages } = get();
    if (page >= 0 && page < totalPages) {
      set({ currentPage: page });
    }
  },

  nextPage: () => {
    const { currentPage, totalPages } = get();
    if (currentPage < totalPages - 1) {
      set({ currentPage: currentPage + 1 });
    }
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 0) {
      set({ currentPage: currentPage - 1 });
    }
  },

  goToPage: (page) => {
    const { totalPages } = get();
    const targetPage = Math.max(0, Math.min(page, totalPages - 1));
    set({ currentPage: targetPage });
  },

  setIsFlipping: (isFlipping) => set({ isFlipping }),

  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === "single" ? "double" : "single",
    })),

  reset: () =>
    set({
      pages: [],
      currentPage: 0,
      totalPages: 0,
      isFlipping: false,
      viewMode: "single",
    }),
}));
