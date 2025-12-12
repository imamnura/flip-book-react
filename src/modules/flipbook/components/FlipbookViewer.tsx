import React, { useRef, useEffect, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { useFlipbookStore } from "../store/flipbookStore";
import { Page } from "./Page";
import { NavigationControls } from "./NavigationControls";
import { ThumbnailBar } from "./ThumbnailBar";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useResponsiveFlipbook } from "../hooks/useResponsiveFlipbook";
import { useLazyPages } from "../hooks/useLazyPages";
import { useAnalytics } from "@/shared/lib/analytics";
import { useURLState } from "@/shared/hooks/useURLState";
import {
  ZoomControls,
  FullscreenButton,
  SpreadToggle,
  AutoFlipControls,
  ShareButton,
  AnalyticsButton,
  useZoom,
  useFullscreen,
  useAutoFlip,
} from "../../viewer";

interface FlipbookViewerProps {
  showControls?: boolean;
  showThumbnails?: boolean;
  enableKeyboard?: boolean;
  enableZoom?: boolean;
  enableFullscreen?: boolean;
  enableAutoFlip?: boolean;
  className?: string;
}

export const FlipbookViewer: React.FC<FlipbookViewerProps> = ({
  showControls = true,
  showThumbnails = true,
  enableKeyboard = true,
  enableZoom = true,
  enableFullscreen = true,
  enableAutoFlip = true,
  className = "",
}) => {
  const {
    pages,
    currentPage,
    setCurrentPage,
    setIsFlipping,
    viewMode,
    toggleViewMode,
  } = useFlipbookStore();
  const flipBookRef = useRef<{ pageFlip: () => { flip: (page: number) => void } } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy loading pages for performance
  const { visiblePages, stats } = useLazyPages({
    pages,
    currentPage,
    preloadRange: 2, // Load current + 2 pages before/after
  });

  // Analytics tracking
  const { startTracking, stopTracking, trackPage } = useAnalytics(pages.length);

  // URL state management
  const { urlState, setURLState } = useURLState();

  // Enable keyboard navigation
  useKeyboardNavigation(enableKeyboard);

  // Log performance stats
  useEffect(() => {
    console.log(
      `📄 Lazy Loading: ${stats.loaded}/${stats.total} pages (${stats.percentage}%)`
    );
  }, [stats]);

  // Start analytics tracking on mount
  useEffect(() => {
    if (pages.length > 0) {
      startTracking();
    }

    return () => {
      if (pages.length > 0) {
        stopTracking();
      }
    };
  }, [pages.length, startTracking, stopTracking]);

  // Load initial state from URL
  useEffect(() => {
    if (urlState.page !== undefined && urlState.page !== currentPage) {
      setCurrentPage(urlState.page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Track page views
  useEffect(() => {
    if (pages.length > 0) {
      trackPage(currentPage + 1); // +1 because pageNumber is 1-indexed
    }
  }, [currentPage, pages.length, trackPage]);

  // Zoom functionality
  const { zoom, zoomIn, zoomOut, resetZoom, canZoomIn, canZoomOut } = useZoom({
    minZoom: 0.5,
    maxZoom: 2,
    step: 0.25,
    initialZoom: 1,
  });

  // Fullscreen functionality
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  // Auto-flip functionality
  const {
    isPlaying,
    speed,
    toggle: toggleAutoFlip,
    setSpeed,
  } = useAutoFlip({
    initialSpeed: 2000,
    enabled: enableAutoFlip,
  });

  // Responsive sizing with zoom - BOOK FORMAT (2 pages side by side)
  const { width, height } = useResponsiveFlipbook({
    containerRef,
    aspectRatio: 0.707,  // Book ratio: 2 pages (width < height for portrait pages, but showing 2 = landscape book)
    maxWidth: 1400,      // Increased for better visibility
    maxHeight: 900,      // Adjusted for book proportions
    padding: 10,         // Reduced for more space
  });

  const zoomedWidth = width * zoom;
  const zoomedHeight = height * zoom;

  // Sync external page changes to flipbook
  useEffect(() => {
    if (flipBookRef.current) {
      try {
        flipBookRef.current.pageFlip().flip(currentPage);
      } catch (error) {
        console.error("Error flipping page:", error);
      }
    }
  }, [currentPage]);

  const handleFlip = useCallback(
    (e: { data: number }) => {
      setCurrentPage(e.data);

      // Update URL state
      setURLState({
        page: e.data,
        zoom,
        viewMode,
      });
    },
    [setCurrentPage, setURLState, zoom, viewMode]
  );

  const handleChangeOrientation = useCallback(() => {
    // Handle orientation change if needed
  }, []);

  const handleChangeState = useCallback(
    (e: { data: string }) => {
      setIsFlipping(e.data === "flipping");
    },
    [setIsFlipping]
  );

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p className="text-lg">No document loaded</p>
          <p className="text-sm mt-2">
            Upload a document to view it as a flipbook
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full relative ${className} ${isFullscreen
        ? "bg-gradient-to-br from-gray-900 to-gray-800"
        : "bg-transparent"
        }`}
    >
      {/* Toolbar */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-white/20 px-6 py-4 flex items-center justify-between shadow-lg relative z-10">
        <div className="flex items-center gap-3">
          {enableZoom && (
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-white/40">
              <ZoomControls
                zoom={zoom}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onReset={resetZoom}
                canZoomIn={canZoomIn}
                canZoomOut={canZoomOut}
              />
            </div>
          )}

          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-white/40">
            <SpreadToggle
              isDoubleSpread={viewMode === "double"}
              onToggle={toggleViewMode}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShareButton
            currentPage={currentPage}
            zoom={zoom}
            viewMode={viewMode}
          />

          <AnalyticsButton />

          {enableAutoFlip && (
            <AutoFlipControls
              isPlaying={isPlaying}
              onToggle={toggleAutoFlip}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          )}

          {enableFullscreen && (
            <FullscreenButton
              isFullscreen={isFullscreen}
              onToggle={toggleFullscreen}
            />
          )}
        </div>
      </div>

      {/* Main Flipbook Area */}
      <div
        className="flex-1 flex items-center justify-center p-8 overflow-auto"
        role="main"
        aria-label="Document pages"
      >
        <div
          className="relative transition-all duration-300 drop-shadow-2xl"
          style={{
            width: `${zoomedWidth}px`,
            height: `${zoomedHeight}px`,
          }}
          role="region"
          aria-label={`Page ${currentPage + 1} of ${pages.length}`}
          tabIndex={0}
        >
          <HTMLFlipBook
            ref={flipBookRef}
            width={zoomedWidth}
            height={zoomedHeight}
            size="fixed"          // Changed from "stretch" to maintain book proportions
            minWidth={400}
            maxWidth={2000}
            minHeight={500}
            maxHeight={2400}
            drawShadow={true}
            flippingTime={600}
            usePortrait={false}   // Changed to false for book (landscape) view
            startZIndex={0}
            autoSize={false}
            maxShadowOpacity={0.5}
            showCover={false}
            mobileScrollSupport={true}
            onFlip={handleFlip}
            onChangeOrientation={handleChangeOrientation}
            onChangeState={handleChangeState}
            className="flipbook-container"
            style={{}}
            startPage={0}
            useMouseEvents={true}
            swipeDistance={30}
            clickEventForward={true}
            disableFlipByClick={false}
            showPageCorners={true}
          >
            {visiblePages.map((page) => (
              <Page
                key={page.id}
                page={page}
                isPlaceholder={"isPlaceholder" in page && page.isPlaceholder}
              />
            ))}
          </HTMLFlipBook>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div
          className="backdrop-blur-xl bg-white/80 border-t border-white/20 flex justify-center py-5 shadow-lg"
          role="navigation"
          aria-label="Page navigation"
        >
          <NavigationControls />
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && !isFullscreen && (
        <div
          className="px-6 pb-5 backdrop-blur-xl bg-white/80"
          role="navigation"
          aria-label="Page thumbnails"
        >
          <ThumbnailBar />
        </div>
      )}
    </div>
  );
};
