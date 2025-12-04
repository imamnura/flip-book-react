import type { DocumentPage } from "@/modules/document/types/document";

/**
 * Generate sample image pages for testing
 */
export const generateSampleImagePages = (
  count: number = 10
): DocumentPage[] => {
  const pages: DocumentPage[] = [];

  for (let i = 0; i < count; i++) {
    const pageNumber = i + 1;

    // Create a simple SVG as base64 image
    const svg = `
      <svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="800" fill="${getRandomColor()}" />
        <text 
          x="300" 
          y="400" 
          font-size="120" 
          font-weight="bold" 
          text-anchor="middle" 
          fill="white"
        >
          ${pageNumber}
        </text>
        <text 
          x="300" 
          y="500" 
          font-size="24" 
          text-anchor="middle" 
          fill="white"
        >
          Sample Page ${pageNumber}
        </text>
      </svg>
    `;

    const base64 = `data:image/svg+xml;base64,${btoa(svg)}`;

    pages.push({
      id: `page-${i}`,
      type: "image",
      content: base64,
      width: 600,
      height: 800,
      pageNumber,
    });
  }

  return pages;
};

/**
 * Generate sample HTML pages for testing
 */
export const generateSampleHtmlPages = (count: number = 5): DocumentPage[] => {
  const pages: DocumentPage[] = [];

  for (let i = 0; i < count; i++) {
    const pageNumber = i + 1;

    const html = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #333; margin-bottom: 20px;">Page ${pageNumber}</h1>
        <p style="line-height: 1.6; color: #666;">
          This is a sample HTML page with some content. Lorem ipsum dolor sit amet, 
          consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore 
          et dolore magna aliqua.
        </p>
        <ul style="margin-top: 20px; color: #666;">
          <li>Sample item 1</li>
          <li>Sample item 2</li>
          <li>Sample item 3</li>
        </ul>
        <div style="margin-top: 40px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
          <strong>Note:</strong> This is a demo HTML page for testing the flipbook viewer.
        </div>
      </div>
    `;

    pages.push({
      id: `page-${i}`,
      type: "html",
      content: html,
      width: 600,
      height: 800,
      pageNumber,
    });
  }

  return pages;
};

function getRandomColor(): string {
  const colors = [
    "#3B82F6", // blue
    "#10B981", // green
    "#F59E0B", // amber
    "#EF4444", // red
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#06B6D4", // cyan
    "#F97316", // orange
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}
