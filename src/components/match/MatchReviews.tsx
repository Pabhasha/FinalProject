
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReviewActions } from '@/components/ui/ReviewActions';
import { Review } from '@/utils/mockData';

interface MatchReviewsProps {
  reviews: Array<Review & {
    author: string;
    comment: string;
  }>;
  onWriteReview: () => void;
}

const MatchReviews = ({ reviews, onWriteReview }: MatchReviewsProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">Reviews</h2>
        
        {reviews.length > 0 ? (
          <div className="space-y-3 mb-4">
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="mb-3 border-b border-border/40 pb-3 last:border-0"
              >
                <p className="font-medium text-sm sm:text-base">{review.author}</p>
                <p className="text-xs sm:text-sm text-muted-foreground my-2">
                  {review.comment}
                </p>
                <ReviewActions 
                  reviewId={`review-${index}`} 
                  initialLikes={review.likes || 0} 
                  initialDislikes={review.dislikes || 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        )}
        
        {/* Write review button */}
        <div className="mt-4 flex justify-center sm:justify-start">
          <Button onClick={onWriteReview} size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchReviews;
