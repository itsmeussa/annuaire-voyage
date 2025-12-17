import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number | null;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export default function StarRating({
  rating,
  size = "md",
  showValue = true,
}: StarRatingProps) {
  if (!rating) {
    return (
      <span className="text-muted-foreground text-sm">No ratings yet</span>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
          />
        ))}
        {hasHalfStar && (
          <StarHalf
            className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${sizeClasses[size]} text-gray-300`}
          />
        ))}
      </div>
      {showValue && (
        <span className={`${textSizes[size]} font-medium text-foreground ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
