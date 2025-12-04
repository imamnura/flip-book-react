import type { DocumentPage } from "@/modules/document/types/document";

/**
 * Excel Engine using xlsx
 * Converts Excel sheets to HTML pages
 */
export const excelEngine = {
  async parse(file: File): Promise<DocumentPage[]> {
    try {
      // Dynamically import xlsx to avoid bundle size issues
      const XLSX = await import("xlsx");

      const buf = await file.arrayBuffer();
      const workbook = XLSX.read(buf, { type: "array" });

      const pages: DocumentPage[] = [];

      // Process each sheet as a separate page
      workbook.SheetNames.forEach((sheetName, index) => {
        const sheet = workbook.Sheets[sheetName];

        // Convert to HTML with styling
        const html = XLSX.utils.sheet_to_html(sheet, {
          id: `excel-sheet-${index}`,
          editable: false,
        });

        // Wrap with basic styling
        const styledHtml = `
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="margin-bottom: 15px; color: #333;">${sheetName}</h2>
            <div style="overflow-x: auto;">
              ${html}
            </div>
          </div>
          <style>
            table { border-collapse: collapse; width: 100%; }
            td, th { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f2f2f2; 
              font-weight: bold; 
            }
            tr:nth-child(even) { background-color: #f9f9f9; }
            tr:hover { background-color: #f5f5f5; }
          </style>
        `;

        pages.push({
          id: crypto.randomUUID(),
          type: "html",
          content: styledHtml,
          width: 800,
          height: 1000,
          pageNumber: index + 1,
        });
      });

      return pages;
    } catch (error) {
      console.error("Excel parsing error:", error);
      throw new Error(
        `Failed to parse Excel: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
