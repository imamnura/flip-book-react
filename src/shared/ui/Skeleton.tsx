import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses = "bg-gray-200";

  const variantClasses = {
    text: "rounded",
    rectangular: "rounded-md",
    circular: "rounded-full",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  const style: React.CSSProperties = {
    width: width || "100%",
    height: height || (variant === "text" ? "1em" : "100%"),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading"
    />
  );
};

// Page Skeleton for flipbook
export const PageSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`w-full h-full bg-gray-100 flex items-center justify-center ${className}`}
    >
      <div className="space-y-4 w-4/5">
        <Skeleton height={20} />
        <Skeleton height={20} width="80%" />
        <Skeleton height={20} width="60%" />
        <div className="pt-4">
          <Skeleton height={100} />
        </div>
        <Skeleton height={20} />
        <Skeleton height={20} width="90%" />
      </div>
    </div>
  );
};
