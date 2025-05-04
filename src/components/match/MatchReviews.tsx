import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReviewActions } from '@/components/ui/ReviewActions';
import { Review } from '@/hooks/useReviews';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import WriteReview from './WriteReview';

interface MatchReviewsProps {
  matchId: string;
  reviews: Review[];
  onWriteReview: (review: { comment: string; rating: number }) => void;
  hasUserReviewed: boolean;
  userReview: Review | null;
}

const MatchReviews = ({ matchId, reviews, onWriteReview, hasUserReviewed, userReview }: MatchReviewsProps) => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const isDark = theme === 'dark';
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  
  return (
    <>
      <Card className={cn(
        "h-full transition-all duration-300",
        "hover:shadow-md",
        isDark ? "hover:border-primary/30" : "hover:border-primary/50"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Reviews</h2>
            
            {/* Write review button - don't show if user already reviewed */}
            {isAuthenticated && !hasUserReviewed && (
              <Button onClick={() => setIsWriteReviewOpen(true)} size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            )}
          </div>
          
          {reviews.length > 0 ? (
            <div className="space-y-3 mb-4">
              {/* If user has a review, show it first */}
              {userReview && (
                <div className={cn(
                  "mb-3 p-3 rounded-md",
                  isDark ? "bg-primary/10" : "bg-primary/5"
                )}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm sm:text-base">{userReview.author} <span className="text-xs text-muted-foreground">(Your review)</span></p>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={cn(
                          "text-sm",
                          i < userReview.rating ? "text-yellow-400" : "text-gray-300"
                        )}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm my-2">
                    {userReview.comment}
                  </p>
                  <div className="text-xs text-muted-foreground mb-2">
                    {format(new Date(userReview.createdAt), 'MMM d, yyyy')}
                  </div>
                  <ReviewActions 
                    reviewId={userReview.id} 
                    initialLikes={userReview.likes || 0} 
                    initialDislikes={userReview.dislikes || 0}
                  />
                </div>
              )}

              {/* Other reviews */}
              {reviews.filter(review => !userReview || review.id !== userReview.id).map((review) => (
                <div 
                  key={review.id} 
                  className={cn(
                    "mb-3 pb-3 last:border-0",
                    isDark ? "border-b border-border/40" : "border-b border-gray-200"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm sm:text-base">{review.author}</p>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={cn(
                          "text-sm",
                          i < review.rating ? "text-yellow-400" : "text-gray-300"
                        )}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground my-2">
                    {review.comment}
                  </p>
                  <div className="text-xs text-muted-foreground mb-2">
                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                  </div>
                  <ReviewActions 
                    reviewId={review.id} 
                    initialLikes={review.likes || 0} 
                    initialDislikes={review.dislikes || 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={cn(
              "text-center py-6 text-sm",
              "rounded-md",
              isDark ? "text-muted-foreground" : "text-gray-500 bg-muted/50"
            )}>
              <p>No reviews yet. Be the first to review!</p>
            </div>
          )}
          
          {/* Sign in prompt if not authenticated */}
          {!isAuthenticated && reviews.length === 0 && (
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
              >
                <a href="/auth">Sign in to write a review</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Write Review Dialog */}
      <WriteReview 
        matchId={matchId} 
        isOpen={isWriteReviewOpen} 
        onClose={() => setIsWriteReviewOpen(false)}
        onSubmit={onWriteReview}
      />
    </>
  );
};

export default MatchReviews;
