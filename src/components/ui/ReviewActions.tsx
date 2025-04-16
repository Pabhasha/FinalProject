
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

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
  const [userVotes, setUserVotes] = useLocalStorage<UserVotes>('footballtrackr-user-votes', {});
  const [userReplies, setUserReplies] = useLocalStorage<UserReplies>('footballtrackr-user-replies', {});
  
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
      } else {
        setDislikes(dislikes - 1);
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
    } else if (previousVote === 'downvote' && voteType === 'upvote') {
      setDislikes(dislikes - 1);
      setLikes(likes + 1);
    } else if (voteType === 'upvote') {
      setLikes(likes + 1);
    } else {
      setDislikes(dislikes + 1);
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
    });
  };
  
  return (
    <div className="flex items-center text-sm text-muted-foreground gap-6">
      <div className="flex items-center gap-4">
        <button 
          className={cn(
            "flex items-center hover:text-primary transition-colors",
            userVote === 'upvote' && "text-primary"
          )}
          onClick={() => handleVote('upvote')}
          aria-label="Upvote review"
        >
          <ThumbsUp className={cn(
            "w-4 h-4 mr-1", 
            userVote === 'upvote' && "fill-current"
          )} />
          <span>{likes}</span>
        </button>
        
        <button 
          className={cn(
            "flex items-center hover:text-destructive transition-colors",
            userVote === 'downvote' && "text-destructive"
          )}
          onClick={() => handleVote('downvote')}
          aria-label="Downvote review"
        >
          <ThumbsDown className={cn(
            "w-4 h-4 mr-1", 
            userVote === 'downvote' && "fill-current"
          )} />
          <span>{dislikes}</span>
        </button>
      </div>
      
      <Popover open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center hover:text-primary transition-colors">
            <MessageSquare className="w-4 h-4 mr-1" />
            <span>Reply {replies.length > 0 && `(${replies.length})`}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="text-sm font-medium">Reply to this review</div>
            <Textarea 
              placeholder="Write your reply..." 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddReply} 
                disabled={!replyText.trim()}
              >
                Post Reply
              </Button>
            </div>
            
            {replies.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Replies</div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {replies.map((reply, index) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="p-3">
                        <p className="text-sm">{reply}</p>
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
