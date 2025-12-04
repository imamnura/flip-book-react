import type { DocumentPage } from "@/modules/document/types/document";

/**
 * PDF Engine using pdfjs-dist
 * Converts PDF pages to images
 */
export const pdfEngine = {
  async parse(file: File): Promise<DocumentPage[]> {
    try {
      // Dynamically import pdfjs-dist to avoid bundle size issues
      const pdfjsLib = await import("pdfjs-dist");

      // Use local worker from node_modules instead of CDN
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).href;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const pages: DocumentPage[] = [];

      // Process each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Could not get canvas context");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: ctx,
          canvas: canvas,
          viewport,
        }).promise;

        // Convert to data URL
        const dataUrl = canvas.toDataURL("image/png");

        pages.push({
          id: crypto.randomUUID(),
          type: "image",
          content: dataUrl,
          width: viewport.width,
          height: viewport.height,
          pageNumber: pageNum,
        });
      }

      return pages;
    } catch (error) {
      console.error("PDF parsing error:", error);
      throw new Error(
        `Failed to parse PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
