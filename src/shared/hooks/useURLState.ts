import { useCallback } from "react";

interface URLState {
  page?: number;
  zoom?: number;
  viewMode?: "single" | "double";
}

/**
 * Hook untuk sync viewer state dengan URL
 * Memungkinkan shareable links dan browser back/forward
 */
export const useURLState = () => {
  const getURLState = useCallback((): URLState => {
    const params = new URLSearchParams(window.location.search);

    return {
      page: params.has("page") ? parseInt(params.get("page")!, 10) : undefined,
      zoom: params.has("zoom") ? parseFloat(params.get("zoom")!) : undefined,
      viewMode: (params.get("view") as "single" | "double") || undefined,
    };
  }, []);

  const setURLState = useCallback((state: URLState) => {
    const params = new URLSearchParams(window.location.search);

    if (state.page !== undefined) {
      params.set("page", state.page.toString());
    }

    if (state.zoom !== undefined) {
      params.set("zoom", state.zoom.toFixed(2));
    }

    if (state.viewMode !== undefined) {
      params.set("view", state.viewMode);
    }

    // Update URL tanpa reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, []);

  const getShareableLink = useCallback((state: URLState): string => {
    const params = new URLSearchParams();

    if (state.page !== undefined) {
      params.set("page", state.page.toString());
    }

    if (state.zoom !== undefined) {
      params.set("zoom", state.zoom.toFixed(2));
    }

    if (state.viewMode !== undefined) {
      params.set("view", state.viewMode);
    }

    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?${params.toString()}`;
  }, []);

  const copyShareableLink = useCallback(
    async (state: URLState): Promise<boolean> => {
      const link = getShareableLink(state);

      try {
        await navigator.clipboard.writeText(link);
        return true;
      } catch (error) {
        console.error("Failed to copy link:", error);
        return false;
      }
    },
    [getShareableLink]
  );

  return {
    urlState: getURLState(),
    setURLState,
    getShareableLink,
    copyShareableLink,
  };
};

// Alias untuk backward compatibility
export const useSimpleURLState = useURLState;
