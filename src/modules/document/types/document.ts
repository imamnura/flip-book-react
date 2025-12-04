export type DocumentPageType = "image" | "html";

export interface DocumentPage {
  id: string;
  type: DocumentPageType;
  content: string;
  width: number;
  height: number;
  pageNumber: number;
}
