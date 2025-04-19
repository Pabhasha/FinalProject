import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, MessageSquare, Share2, ListChecks, Play, Award, Calendar, MapPin } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import MatchRating from '@/components/ui/MatchRating';
import { getMatchById, getReviewsForMatch } from '@/utils/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useLists } from '@/hooks/useLists';
import ListModal from '@/components/ui/ListModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewActions } from '@/components/ui/ReviewActions';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

// ... keep existing code (imports and component setup)

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const match = getMatchById(id || '');
  const reviews = getReviewsForMatch(id || '');
  const isMobile = useIsMobile();
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [watchedMatches, setWatchedMatches] = useLocalStorage<string[]>('footballtrackr-watched', []);
  const [hasWatched, setHasWatched] = useState(false);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isFavorited, setIsFavorited] = useState(false);
  
  const { isListModalOpen, openListModal, closeListModal } = useLists();
  
  useEffect(() => {
    if (id) {
      setIsFavorited(isFavorite(id));
    }
  }, [id, isFavorite]);
  
  useEffect(() => {
    if (id && watchedMatches.includes(id)) {
      setHasWatched(true);
    }
  }, [id, watchedMatches]);

  useEffect(() => {
    if (!match) return;
    
    const img = new Image();
    img.src = match.poster;
    img.onload = () => setImageLoaded(true);
  }, [match]);

  if (!match) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center empty-state py-16 w-full max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted/60 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Star className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Match Not Found</h1>
            <p className="text-muted-foreground">The match you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formatScore = () => {
    let score = `${match.score.homeScore}-${match.score.awayScore}`;
    if (match.score.extraTime) {
      score += " (a.e.t.)";
      if (match.score.penalties) {
        score += ` [${match.score.penalties.homeScore}-${match.score.penalties.awayScore} pens]`;
      }
    }
    return score;
  };

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
    toast("Rating saved", {
      description: `You rated this match ${rating} stars.`,
      duration: 3000,
      variant: "success"
    });
  };

  const handleAddToWatched = () => {
    if (!hasWatched && id) {
      setWatchedMatches([...watchedMatches, id]);
      setHasWatched(true);
      toast("Match logged", {
        description: "This match has been added to your watched list.",
        variant: "success"
      });
    }
  };
  
  const handleToggleFavorite = () => {
    if (id) {
      const isNowFavorite = toggleFavorite(id);
      setIsFavorited(isNowFavorite);
      toast(isNowFavorite ? "Added to favorites" : "Removed from favorites", {
        description: isNowFavorite 
          ? "This match has been added to your favorites." 
          : "This match has been removed from your favorites.",
        variant: isNowFavorite ? "success" : "default"
      });
    }
  };
  
  const handleShareMatch = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast("Link copied", {
          description: "Match link copied to clipboard. Share with your friends!",
          variant: "success"
        });
      })
      .catch(() => {
        toast("Failed to copy link", {
          description: "Please try again or copy the URL manually.",
          variant: "destructive"
        });
      });
  };
  
  const handleAddToList = () => {
    if (id) {
      openListModal(id);
    }
  };

  const handleSubmitReview = () => {
    if (reviewContent.trim().length === 0) return;
    
    toast("Review submitted", {
      description: "Your review has been submitted successfully!",
      variant: "success"
    });
    
    // In a real app, we would save the review to the backend
    setReviewContent('');
    setIsWritingReview(false);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <MainLayout>
      <div className="page-transition">
        <div className="relative h-[70vh] min-h-[500px] -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-24 overflow-hidden">
          <div 
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
              imageLoaded ? "opacity-40" : "opacity-0"
            )}
            style={{ backgroundImage: `url(${match.poster})` }}
          ></div>
          
          {/* ... keep existing code (background and loading states) */}
          
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
            {/* ... keep existing code (competition badge and match details) */}
          </div>
        </div>
        
        <section className="py-12">
          {/* ... keep existing code (reviews section) */}
        </section>
      </div>
      
      <ListModal 
        isOpen={isListModalOpen}
        onClose={closeListModal}
        matchId={id || null}
      />
    </MainLayout>
  );
};

export default MatchDetails;
