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
  maxSize?: number; // in MB
  className?: string;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onUpload,
  accept = ".pdf,.xlsx,.xls,.doc,.docx",
  maxSize = 50, // 50MB
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
      toast.info(`Processing ${file.name}...`, {
        description: "This may take a few moments",
      });

      const pages = await processDocument(file);

      toast.success(`Successfully processed ${file.name}!`, {
        description: `${pages.length} page${
          pages.length > 1 ? "s" : ""
        } loaded`,
      });

      onUpload(pages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process file";
      setError(errorMessage);
      toast.error("Processing failed", {
        description: errorMessage,
      });
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log("Upload area clicked", {
        isProcessing,
        hasRef: !!fileInputRef.current,
      });
      if (!isProcessing && fileInputRef.current) {
        fileInputRef.current.click();
      }
    },
    [isProcessing]
  );

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
          return;
        }

        await processFile(file);
        e.dataTransfer.clearData();
      }
    },
    [accept, maxSize, onUpload]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];

        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }

        await processFile(file);
      }
    },
    [accept, maxSize, onUpload]
  );

  return (
    <div
      className={className}
      onClick={handleClick}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative backdrop-blur-xl rounded-2xl p-12 text-center transition-all duration-300
          ${
            isDragging
              ? "bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-2 border-blue-400 scale-105 shadow-2xl"
              : "bg-white/90 border-2 border-white/40 hover:border-white/60 hover:shadow-xl"
          }
          ${
            isProcessing
              ? "opacity-60 cursor-not-allowed"
              : "cursor-pointer hover:scale-[1.02]"
          }
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

        <div className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-all duration-300 ${
                isDragging
                  ? "from-blue-500 to-purple-600 scale-110 rotate-6"
                  : "from-purple-500 to-indigo-600"
              }`}
            >
              <svg
                className="w-10 h-10 text-white"
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
          <div>
            <p className="text-xl font-bold text-gray-800 mb-2">
              {isDragging
                ? "Drop it like it's hot! 🔥"
                : "Drag & Drop Your File"}
            </p>
            <p className="text-sm text-gray-600">
              or click to browse from your computer
            </p>
          </div>

          {/* File types */}
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-full border border-red-200/50">
              <svg
                className="w-4 h-4 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path
                  fillRule="evenodd"
                  d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-red-700">PDF</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200/50">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-green-700">Excel</span>
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
              <span className="font-medium text-gray-600">Max {maxSize}MB</span>
            </div>
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">
                  Processing your file...
                </p>
                <p className="text-xs text-gray-600">This may take a moment</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800">
                    Oops! Something went wrong
                  </p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Note */}
          {!isProcessing && !error && (
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-xl">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    ✨ Ready to go!
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Upload PDF or Excel files to create stunning flipbooks. All
                    processing happens securely in your browser—no uploads to
                    external servers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
