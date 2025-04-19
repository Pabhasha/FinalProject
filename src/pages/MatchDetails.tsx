
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60"></div>
          
          {!imageLoaded && (
            <div className="absolute inset-0 bg-card flex items-center justify-center">
              <div className="animate-pulse w-16 h-16 rounded-full bg-muted"></div>
            </div>
          )}
          
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
            <motion.div 
              className="max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="competition-badge mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <img 
                  src={match.competition.logo} 
                  alt={match.competition.name} 
                  className="w-5 h-5 mr-2 flex-shrink-0" 
                />
                <span className="text-sm font-medium whitespace-normal pr-1 max-w-[280px] sm:max-w-full">
                  {match.competition.name} • {match.stage}
                </span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col mb-4 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex justify-center items-center mb-6 w-full">
                  <div className="flex-1 flex justify-end items-center pr-4 max-w-[40%]">
                    <div className="flex items-center">
                      <div className="flex flex-col items-end">
                        <span className="team-name text-right">
                          {match.homeTeam.name}
                        </span>
                      </div>
                      <img 
                        src={match.homeTeam.logo} 
                        alt={match.homeTeam.name} 
                        className="w-10 h-10 md:w-12 md:h-12 object-contain ml-3 flex-shrink-0 animate-float" 
                      />
                    </div>
                  </div>
                  
                  <div className="px-4 py-2 mx-2 bg-card/30 backdrop-blur-sm rounded-md text-2xl md:text-4xl font-bold glow-text animate-fade-in">
                    {formatScore()}
                  </div>
                  
                  <div className="flex-1 flex justify-start items-center pl-4 max-w-[40%]">
                    <div className="flex items-center">
                      <img 
                        src={match.awayTeam.logo} 
                        alt={match.awayTeam.name} 
                        className="w-10 h-10 md:w-12 md:h-12 object-contain mr-3 flex-shrink-0 animate-float" 
                      />
                      <div className="flex flex-col items-start">
                        <span className="team-name text-left">
                          {match.awayTeam.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center gap-2 mb-8 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(match.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {match.stadium.name}, {match.stadium.city}
                </span>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="flex items-center" variants={itemVariants}>
                  <div className="mr-3">
                    <MatchRating 
                      matchId={match.id} 
                      initialRating={userRating}
                      onRatingChange={handleRatingChange}
                      size="lg"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">Rate</span>
                </motion.div>
                
                <motion.button 
                  onClick={handleAddToWatched}
                  disabled={hasWatched}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    hasWatched 
                      ? "bg-primary/20 text-primary" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  variants={itemVariants}
                >
                  <Star className={cn("w-4 h-4 mr-2", hasWatched && "fill-current")} />
                  {hasWatched ? "Watched" : "Log Match"}
                </motion.button>
                
                {match.highlights && (
                  <motion.a 
                    href={match.highlights}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
                    variants={itemVariants}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Highlights
                  </motion.a>
                )}
                
                <motion.div 
                  className="flex items-center space-x-4"
                  variants={itemVariants}
                >
                  <button 
                    className={cn(
                      "w-9 h-9 flex items-center justify-center rounded-full transition-colors",
                      isFavorited 
                        ? "bg-red-500 text-white hover:bg-red-600" 
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                    onClick={handleToggleFavorite}
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                  </button>
                  
                  <button 
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                    onClick={handleAddToList}
                    aria-label="Add to list"
                  >
                    <ListChecks className="w-4 h-4" />
                  </button>
                  
                  <button 
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                    onClick={handleShareMatch}
                    aria-label="Share match"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <section className="py-12">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-primary" />
              <h2 className="text-2xl font-bold">Reviews</h2>
              {reviews.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {reviews.length}
                </span>
              )}
            </div>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              onClick={() => setIsWritingReview(true)}
            >
              <MessageSquare className="w-4 h-4 mr-1 inline" />
              Write a Review
            </button>
          </motion.div>
          
          {isWritingReview && (
            <motion.div 
              className="mb-8 border border-primary/20 rounded-lg p-6 bg-card/50 shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium mb-4">Share your thoughts</h3>
              <textarea
                className="w-full p-3 border border-border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors min-h-[120px]"
                placeholder="What did you think of this match?"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Your Rating:</span>
                  <MatchRating 
                    matchId={match.id}
                    initialRating={userRating}
                    onRatingChange={handleRatingChange}
                    size="sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-1 border border-border rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsWritingReview(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={cn(
                      "px-4 py-1 rounded-md text-sm font-medium transition-colors",
                      reviewContent.trim().length > 0
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-primary/50 text-primary-foreground cursor-not-allowed"
                    )}
                    onClick={handleSubmitReview}
                    disabled={reviewContent.trim().length === 0}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {reviews.length > 0 ? (
            <motion.div 
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delayChildren: 0.6, staggerChildren: 0.1 }}
            >
              {reviews.map(review => (
                <motion.div 
                  key={review.id} 
                  className="review-card"
                  variants={itemVariants}
                >
                  <div className="flex items-start">
                    <img 
                      src={review.userAvatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                      alt={review.username} 
                      className="w-10 h-10 rounded-full object-cover mr-4 ring-2 ring-primary/20" 
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold flex items-center">
                            {review.username}
                            {review.verified && (
                              <span className="ml-1 text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                                Verified
                              </span>
                            )}
                          </h3>
                          <div className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <MatchRating matchId={review.matchId} initialRating={review.rating} readOnly size="sm" />
                      </div>
                      
                      <p className="text-sm mb-4">{review.content}</p>
                      
                      <ReviewActions 
                        reviewId={review.id}
                        initialLikes={review.likes}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review this match!</p>
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                onClick={() => setIsWritingReview(true)}
              >
                Write a Review
              </button>
            </motion.div>
          )}
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
