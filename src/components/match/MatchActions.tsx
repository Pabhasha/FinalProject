
import React from 'react';
import { Star, Heart, Share2, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';

interface MatchActionsProps {
  matchId: string;
  userRating: number;
  hasWatched: boolean;
  isFavorited: boolean;
  onRatingChange: (rating: number) => void;
  onAddToWatched: () => void;
  onToggleFavorite: () => void;
  onShareMatch: () => void;
  onAddToList: () => void;
}

const MatchActions = ({
  userRating,
  hasWatched,
  isFavorited,
  onRatingChange,
  onAddToWatched,
  onToggleFavorite,
  onShareMatch,
  onAddToList,
}: MatchActionsProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      "hover:shadow-md",
      isDark ? "hover:border-primary/30" : "hover:border-primary/50"
    )}>
      <CardContent className="p-4">
        {/* Rating section */}
        <h2 className="text-lg font-semibold mb-3">Rate this match</h2>

        {/* Rating stars component */}
        <div className="flex items-center justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
              onClick={() => onRatingChange(star)}
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={cn(
                  "w-6 h-6 sm:w-7 sm:h-7",
                  star <= userRating
                    ? "text-yellow-400 fill-yellow-400"
                    : isDark ? "text-gray-300" : "text-gray-300"
                )}
              />
            </button>
          ))}
        </div>
        
        {/* Action buttons with improved layout */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button 
            variant={hasWatched ? "default" : "secondary"}
            className={cn(
              "w-full transition-colors",
              hasWatched && "bg-green-600 hover:bg-green-700",
              !hasWatched && !isDark && "border border-gray-300"
            )}
            onClick={onAddToWatched}
            disabled={hasWatched}
            aria-pressed={hasWatched}
            size="sm"
          >
            <Star className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{hasWatched ? "Logged" : "Log Match"}</span>
          </Button>
          
          <Button 
            variant={isFavorited ? "default" : "secondary"}
            onClick={onToggleFavorite}
            className={cn(
              "w-full",
              !isFavorited && !isDark && "border border-gray-300"
            )}
            aria-pressed={isFavorited}
            size="sm"
          >
            <Heart className={cn(
              "w-4 h-4 mr-1 flex-shrink-0", 
              isFavorited && "fill-current"
            )} />
            <span className="truncate">{isFavorited ? "Favorited" : "Favorite"}</span>
          </Button>
        </div>
        
        {/* Secondary actions with improved layout */}
        <div className={cn(
          "flex items-center justify-between mt-4 pt-3",
          isDark ? "border-t border-border/40" : "border-t border-gray-200"
        )}>
          <Button 
            variant="ghost"
            size="sm"
            className={cn(
              "text-xs hover:text-foreground",
              isDark ? "text-muted-foreground" : "text-gray-600"
            )}
            onClick={onShareMatch}
          >
            <Share2 className="w-3 h-3 mr-1" />
            Share
          </Button>
          
          <Button 
            variant="ghost"
            size="sm"
            className={cn(
              "text-xs hover:text-foreground",
              isDark ? "text-muted-foreground" : "text-gray-600"
            )}
            onClick={onAddToList}
          >
            <ListChecks className="w-3 h-3 mr-1" />
            Add to List
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchActions;
