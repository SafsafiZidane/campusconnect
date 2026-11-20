import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  max?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({
  rating,
  max = 5,
  interactive = false,
  onChange,
  size = "md",
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= rating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={`${interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"} text-amber-400 focus:outline-none`}
            title={`${starValue} étoile${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={`${sizeClasses[size]} ${filled ? "fill-amber-400 text-amber-400" : "text-gray-300 fill-gray-100"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
