// components/StarRating.tsx
import React from "react";

export default function StarRating({ rating }: { rating: number }) {
  // Cap rating between 0 and 5
  const safeRating = Math.min(5, Math.max(0, rating));
  const starColor = "#fef9c3";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((index) => {
        const isFull = index <= safeRating;
        const isHalf = !isFull && index - 0.5 <= safeRating;

        return (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4"
          >
            <defs>
              <linearGradient id={`grad-${index}`}>
                <stop offset="50%" stopColor="white" />
                <stop offset="50%" stopColor="#3f3f46" /> {/* zinc-700 */}
              </linearGradient>
            </defs>

            {/* Outline/Base */}
            <path
              fill={
                isFull ? "white" : isHalf ? `url(#grad-${index})` : "#3f3f46"
              }
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
        );
      })}
    </div>
  );
}
