import { useEffect } from "react";
import { useFlipbookStore } from "../store/flipbookStore";

export const useKeyboardNavigation = (enabled: boolean = true) => {
  const { nextPage, prevPage, isFlipping } = useFlipbookStore();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent navigation if currently flipping
      if (isFlipping) return;

      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ": // Space
          e.preventDefault();
          nextPage();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prevPage();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, nextPage, prevPage, isFlipping]);
};
