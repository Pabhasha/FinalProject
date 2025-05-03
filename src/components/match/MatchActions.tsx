
import React from 'react';
import { Star, Heart, Share2, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

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
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        {/* Rating section */}
        <h2 className="text-lg font-semibold mb-4">Rate this match</h2>

        {/* Rating stars component will be rendered here */}
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
                  "w-8 h-8",
                  star <= userRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            </button>
          ))}
        </div>
        
        {/* Action buttons with improved layout */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button 
            variant={hasWatched ? "default" : "secondary"}
            className={cn(
              "w-full transition-colors",
              hasWatched && "bg-green-600 hover:bg-green-700",
            )}
            onClick={onAddToWatched}
            disabled={hasWatched}
            aria-pressed={hasWatched}
          >
            <Star className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{hasWatched ? "Logged" : "Log Match"}</span>
          </Button>
          
          <Button 
            variant={isFavorited ? "default" : "secondary"}
            onClick={onToggleFavorite}
            className="w-full"
            aria-pressed={isFavorited}
          >
            <Heart className={cn("w-4 h-4 mr-1 flex-shrink-0", isFavorited && "fill-current")} />
            <span className="truncate">{isFavorited ? "Favorited" : "Favorite"}</span>
          </Button>
        </div>
        
        {/* Secondary actions with improved layout */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
          <Button 
            variant="ghost"
            size="sm"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={onShareMatch}
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          
          <Button 
            variant="ghost"
            size="sm"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={onAddToList}
          >
            <ListChecks className="w-4 h-4 mr-1" />
            Add to List
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchActions;
