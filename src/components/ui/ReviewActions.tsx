
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';

interface ReviewActionsProps {
  reviewId: string;
  initialLikes: number;
  initialDislikes?: number;
}

type VoteType = 'upvote' | 'downvote' | null;

interface UserVotes {
  [reviewId: string]: VoteType;
}

interface UserReplies {
  [reviewId: string]: string[];
}

export function ReviewActions({ reviewId, initialLikes, initialDislikes = 0 }: ReviewActionsProps) {
  const [userVotes, setUserVotes] = useLocalStorage<UserVotes>('football-tracker-user-votes', {});
  const [userReplies, setUserReplies] = useLocalStorage<UserReplies>('football-tracker-user-replies', {});
  
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [replies, setReplies] = useState<string[]>(userReplies[reviewId] || []);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const userVote = userVotes[reviewId] || null;

  const handleVote = (voteType: VoteType) => {
    const previousVote = userVotes[reviewId];
    
    // If clicking the same button again, remove the vote
    if (previousVote === voteType) {
      // Remove vote
      const newUserVotes = { ...userVotes };
      delete newUserVotes[reviewId];
      setUserVotes(newUserVotes);
      
      // Update counts
      if (voteType === 'upvote') {
        setLikes(likes - 1);
        toast("Upvote removed", {
          description: "Your upvote has been removed from this review.",
          duration: 2000,
        });
      } else {
        setDislikes(dislikes - 1);
        toast("Downvote removed", {
          description: "Your downvote has been removed from this review.",
          duration: 2000,
        });
      }
      return;
    }
    
    // Update votes object
    setUserVotes({
      ...userVotes,
      [reviewId]: voteType
    });
    
    // Handle vote switching
    if (previousVote === 'upvote' && voteType === 'downvote') {
      setLikes(likes - 1);
      setDislikes(dislikes + 1);
      toast("Vote changed", {
        description: "Your vote has been changed from upvote to downvote.",
        duration: 2000,
      });
    } else if (previousVote === 'downvote' && voteType === 'upvote') {
      setDislikes(dislikes - 1);
      setLikes(likes + 1);
      toast("Vote changed", {
        description: "Your vote has been changed from downvote to upvote.",
        duration: 2000,
      });
    } else if (voteType === 'upvote') {
      setLikes(likes + 1);
      toast("Review upvoted", {
        description: "Thanks for your feedback!",
        duration: 2000,
      });
    } else {
      setDislikes(dislikes + 1);
      toast("Review downvoted", {
        description: "Thanks for your feedback!",
        duration: 2000,
      });
    }
  };
  
  const handleAddReply = () => {
    if (!replyText.trim()) return;
    
    const newReplies = [...replies, replyText];
    setReplies(newReplies);
    
    // Store in localStorage
    setUserReplies({
      ...userReplies,
      [reviewId]: newReplies
    });
    
    // Reset form and close popover
    setReplyText('');
    setIsReplyOpen(false);
    
    toast("Reply added", {
      description: "Your reply has been added to this review.",
      duration: 2000,
    });
  };
  
  return (
    <div className="flex items-center text-sm text-muted-foreground gap-6 pt-2 mt-2 border-t border-border/30">
      <div className="flex items-center gap-4">
        <button 
          className={cn(
            "reaction-btn",
            userVote === 'upvote' && "text-primary bg-primary/10"
          )}
          onClick={() => handleVote('upvote')}
          aria-label="Upvote review"
        >
          <ThumbsUp className={cn(
            "w-4 h-4", 
            userVote === 'upvote' ? "fill-current" : "stroke-[2.5px]"
          )} />
          <span className={cn(
            "font-medium",
            userVote === 'upvote' && "text-primary"
          )}>{likes}</span>
        </button>
        
        <button 
          className={cn(
            "reaction-btn",
            userVote === 'downvote' && "text-destructive bg-destructive/10"
          )}
          onClick={() => handleVote('downvote')}
          aria-label="Downvote review"
        >
          <ThumbsDown className={cn(
            "w-4 h-4", 
            userVote === 'downvote' ? "fill-current" : "stroke-[2.5px]"
          )} />
          <span className={cn(
            "font-medium",
            userVote === 'downvote' && "text-destructive"
          )}>{dislikes}</span>
        </button>
      </div>
      
      <Popover open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <PopoverTrigger asChild>
          <button className="action-btn group relative" aria-label="Reply to review">
            <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Reply</span>
            {replies.length > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-1.5 h-5 min-w-5 px-1 flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                {replies.length}
              </Badge>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 shadow-lg shadow-primary/5 border-primary/10">
          <div className="space-y-4">
            <div className="text-sm font-medium flex items-center">
              <MessageSquare className="w-4 h-4 mr-1.5 text-primary" />
              Reply to this review
            </div>
            <Textarea 
              placeholder="Share your thoughts..." 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[100px] focus-visible:ring-primary/50 resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddReply} 
                disabled={!replyText.trim()}
                className="transition-all duration-300 hover:shadow-md hover:shadow-primary/20"
                size="sm"
              >
                Post Reply
              </Button>
            </div>
            
            {replies.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2 flex items-center">
                  <Badge variant="outline" className="mr-1.5 bg-primary/5">
                    {replies.length}
                  </Badge>
                  Replies
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                  {replies.map((reply, index) => (
                    <Card key={index} className="bg-muted/50 hover:bg-muted/70 transition-colors">
                      <CardContent className="p-3">
                        <p className="text-sm text-foreground/90">{reply}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {/* Simulated time - would be actual timestamp in production */}
                          {index === replies.length - 1 ? "Just now" : `${Math.floor(Math.random() * 24)} hours ago`}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
