import type { DocumentPage } from "@/modules/document/types/document";
import { pdfEngine } from "../engines/pdfEngine";
import { excelEngine } from "../engines/excelEngine";

export type SupportedFileType = 'pdf' | 'excel' | 'unknown';

/**
 * Detect file type from file extension
 */
export const detectFileType = (file: File): SupportedFileType => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'xlsx':
    case 'xls':
    case 'csv':
      return 'excel';
    default:
      return 'unknown';
  }
};

/**
 * Main document processor
 * Routes files to appropriate engine
 */
export const processDocument = async (file: File): Promise<DocumentPage[]> => {
  const fileType = detectFileType(file);

  switch (fileType) {
    case 'pdf':
      return await pdfEngine.parse(file);
    
    case 'excel':
      return await excelEngine.parse(file);
    
    default:
      throw new Error(`Unsupported file type: ${file.name}`);
  }
};

/**
 * Validate file before processing
 */
export const validateFile = (file: File, maxSizeMB: number = 50): string | null => {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File too large. Maximum size is ${maxSizeMB}MB`;
  }

  // Check file type
  const fileType = detectFileType(file);
  if (fileType === 'unknown') {
    return `Unsupported file type. Supported: PDF, Excel (.xlsx, .xls)`;
  }

  return null;
};
