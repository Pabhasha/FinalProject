
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface MatchRatingProps {
  matchId: string;
  initialRating?: number;
  size?: 'sm' | 'md' | 'lg';
  onRatingChange?: (rating: number) => void;
  onChange?: (rating: number) => void; // Adding this prop for backward compatibility
  readOnly?: boolean;
}

const MatchRating: React.FC<MatchRatingProps> = ({
  matchId,
  initialRating,
  size = 'md',
  onRatingChange,
  onChange, // Add the prop here
  readOnly = false
}) => {
  const [userRatings, setUserRatings] = useLocalStorage<Record<string, number>>('footballtrackr-ratings', {});
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Determine sizes based on the size prop
  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const containerSizes = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2'
  };

  useEffect(() => {
    // Use initialRating if provided, otherwise check localStorage
    const savedRating = userRatings[matchId];
    const ratingToUse = initialRating !== undefined ? initialRating : savedRating;
    if (ratingToUse) {
      setRating(ratingToUse);
    }
  }, [initialRating, matchId, userRatings]);

  const handleRating = (value: number) => {
    if (readOnly) return;
    
    setRating(value);
    
    // Save to localStorage
    setUserRatings(prev => ({
      ...prev,
      [matchId]: value
    }));
    
    // Call the callbacks if provided
    if (onRatingChange) {
      onRatingChange(value);
    }
    
    // Support legacy onChange prop
    if (onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (readOnly) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  return (
    <div 
      className={cn(
        "flex items-center", 
        containerSizes[size],
        readOnly ? "pointer-events-none" : "cursor-pointer"
      )}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const displayRating = hoverRating > 0 ? hoverRating : rating;
        const filled = star <= displayRating;
        
        return (
          <Star
            key={star}
            className={cn(
              starSizes[size],
              "transition-all duration-200",
              filled 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-400"
            )}
            onClick={() => handleRating(star)}
            onMouseEnter={() => handleMouseEnter(star)}
          />
        );
      })}
    </div>
  );
};

export default MatchRating;
