
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Star } from 'lucide-react';
import { getMatchById } from '@/utils/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from "sonner";
import { useFavorites } from '@/hooks/useFavorites';
import { useLists } from '@/hooks/useLists';
import ListModal from '@/components/ui/ListModal';
import { motion } from 'framer-motion';
import { useReviews } from '@/hooks/useReviews';

// Import new components
import MatchHeader from '@/components/match/MatchHeader';
import MatchActions from '@/components/match/MatchActions';
import MatchDetails from '@/components/match/MatchDetails';
import MatchReviews from '@/components/match/MatchReviews';

const MatchDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const match = getMatchById(id || '');
  
  const [userRating, setUserRating] = useState<number>(0);
  const [watchedMatches, setWatchedMatches] = useLocalStorage<string[]>('footballtrackr-watched', []);
  const [hasWatched, setHasWatched] = useState(false);
  
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isFavorited, setIsFavorited] = useState(false);
  
  const { isListModalOpen, openListModal, closeListModal } = useLists();
  const { getMatchReviews, hasUserReviewed, getUserReview, addReview } = useReviews();
  
  // Get reviews for this match
  const reviews = id ? getMatchReviews(id) : [];
  const userReview = id ? getUserReview(id) : null;
  const userHasReviewed = id ? hasUserReviewed(id) : false;
  
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
    });
  };

  const handleAddToWatched = () => {
    if (!hasWatched && id) {
      setWatchedMatches([...watchedMatches, id]);
      setHasWatched(true);
      toast("Match logged", {
        description: "This match has been added to your watched list.",
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
      });
    }
  };
  
  const handleShareMatch = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast("Link copied", {
          description: "Match link copied to clipboard. Share with your friends!",
        });
      })
      .catch(() => {
        toast("Failed to copy link", {
          description: "Please try again or copy the URL manually.",
        });
      });
  };
  
  const handleAddToList = () => {
    if (id) {
      openListModal(id);
    }
  };
  
  const handleWriteReview = ({ comment, rating }: { comment: string; rating: number }) => {
    if (id) {
      addReview(id, comment, rating);
    }
  };

  return (
    <MainLayout>
      <motion.div 
        className="page-transition w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Match Header Section */}
        <MatchHeader match={match} formatScore={formatScore} />
        
        {/* Main content section with improved grid layout */}
        <section className="py-6 sm:py-8">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Left column - Rating/Actions */}
              <div className="md:col-span-1 space-y-4">
                {/* Rating and actions card */}
                <MatchActions
                  matchId={id || ''}
                  userRating={userRating}
                  hasWatched={hasWatched}
                  isFavorited={isFavorited}
                  onRatingChange={handleRatingChange}
                  onAddToWatched={handleAddToWatched}
                  onToggleFavorite={handleToggleFavorite}
                  onShareMatch={handleShareMatch}
                  onAddToList={handleAddToList}
                />
                
                {/* Match details card */}
                <MatchDetails match={match} />
              </div>
              
              {/* Right column - Reviews */}
              <div className="md:col-span-2">
                <MatchReviews 
                  matchId={id || ''}
                  reviews={reviews}
                  onWriteReview={handleWriteReview}
                  hasUserReviewed={userHasReviewed}
                  userReview={userReview}
                />
              </div>
            </div>
          </div>
        </section>
      </motion.div>
      
      <ListModal 
        isOpen={isListModalOpen}
        onClose={closeListModal}
        matchId={id || null}
      />
    </MainLayout>
  );
};

export default MatchDetailsPage;
