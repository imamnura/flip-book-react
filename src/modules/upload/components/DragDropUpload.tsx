import React, { useCallback, useState, useRef } from "react";
import { toast } from "sonner";
import type { DocumentPage } from "@/modules/document/types/document";
import {
  processDocument,
  validateFile as validateDocumentFile,
} from "@/modules/document/utils/documentProcessor";

interface DragDropUploadProps {
  onUpload: (pages: DocumentPage[]) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onUpload,
  accept = ".pdf,.xlsx,.xls",
  maxSize = 50,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    return validateDocumentFile(file, maxSize);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      toast.info(`Processing ${file.name}...`);
      const pages = await processDocument(file);
      toast.success(`Successfully processed ${file.name}!`, {
        description: `${pages.length} page${pages.length > 1 ? "s" : ""} loaded`,
      });
      onUpload(pages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process file";
      setError(errorMessage);
      toast.error("Processing failed", { description: errorMessage });
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          toast.error(validationError);
          return;
        }
        await processFile(file);
        e.dataTransfer.clearData();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accept, maxSize, onUpload]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          toast.error(validationError);
          return;
        }
        await processFile(file);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accept, maxSize, onUpload]
  );

  const handleClick = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative bg-white/90 backdrop-blur-sm rounded-xl p-12 text-center 
          border-2 border-dashed transition-all cursor-pointer
          ${isDragging
            ? "border-purple-500 bg-purple-50/50 scale-[1.02]"
            : "border-gray-300 hover:border-purple-400 hover:bg-white"
          }
          ${isProcessing ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          disabled={isProcessing}
          className="hidden"
          id="file-upload"
        />

        {/* Icon */}
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="mb-6">
          <p className="text-xl font-semibold text-gray-800 mb-2">
            {isDragging ? "Drop your file here" : "Drag & drop your file"}
          </p>
          <p className="text-sm text-gray-600">
            or click to browse from your computer
          </p>
        </div>

        {/* File types */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full border border-red-200">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            </svg>
            <span className="font-medium text-red-700">PDF</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-green-700">Excel</span>
          </div>
          <div className="px-3 py-1.5 bg-gray-100 rounded-full border border-gray-300">
            <span className="font-medium text-gray-600">Max {maxSize}MB</span>
          </div>
        </div>

        {/* Processing */}
        {isProcessing && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-700">Processing...</p>
          </div>
        )}

        {/* Error */}
        {error && !isProcessing && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};
