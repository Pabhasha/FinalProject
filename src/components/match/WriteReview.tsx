
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MessageSquare, Send, Star as StarIcon } from 'lucide-react';
import { toast } from 'sonner';

interface WriteReviewProps {
  matchId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { comment: string; rating: number }) => void;
}

const WriteReview: React.FC<WriteReviewProps> = ({ matchId, isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast("Review needed", { 
        description: "Please write a comment for your review.",
      });
      return;
    }
    
    if (rating === 0) {
      toast("Rating needed", { 
        description: "Please select a star rating for the match.",
      });
      return;
    }

    onSubmit({ comment, rating });
    setComment('');
    setRating(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Write a Review
          </DialogTitle>
          <DialogDescription>
            Share your thoughts about this match with the community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-md"
                >
                  <StarIcon
                    className={`w-6 h-6 transition-all ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
              </span>
            </div>
          </div>

          {/* Comment Text Area */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Your Review
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this match..."
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="button"
              onClick={handleSubmit}
              disabled={!comment.trim() || rating === 0}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReview;
