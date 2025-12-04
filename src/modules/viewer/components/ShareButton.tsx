import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui";
import { useSimpleURLState } from "../../../shared/hooks/useURLState";

interface ShareButtonProps {
  currentPage: number;
  zoom: number;
  viewMode: "single" | "double";
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  currentPage,
  zoom,
  viewMode,
  className = "",
}) => {
  const [isCopying, setIsCopying] = useState(false);
  const { copyShareableLink, getShareableLink } = useSimpleURLState();

  const handleShare = async () => {
    setIsCopying(true);

    const success = await copyShareableLink({
      page: currentPage,
      zoom,
      viewMode,
    });

    if (success) {
      const link = getShareableLink({ page: currentPage, zoom, viewMode });
      toast.success("Link copied to clipboard!", {
        description: link,
      });
    } else {
      toast.error("Failed to copy link");
    }

    setIsCopying(false);
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      disabled={isCopying}
      className={`bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md ${className}`}
      aria-label="Share current page"
    >
      {isCopying ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-blue-600 font-medium">Copying...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span className="font-medium text-gray-700">Share</span>
        </div>
      )}
    </Button>
  );
};
