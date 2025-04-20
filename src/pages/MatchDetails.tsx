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

const placeholderImg = "https://via.placeholder.com/400x600";

const ImageLoader = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      style={{ opacity: loaded ? 1 : 0 }}
      onLoad={() => setLoaded(true)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};

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

  const handleSubmitReview = () => {
    if (reviewContent.trim().length === 0) return;
    
    toast("Review submitted", {
      description: "Your review has been submitted successfully!",
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="w-32 h-48 rounded-md" />
            </div>
          )}
          
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
            <div className="bg-secondary/80 rounded-full px-4 py-1 w-fit mb-3">
              <span className="uppercase text-xs font-semibold tracking-wider text-secondary-foreground">
                {match.competition.name}
              </span>
            </div>
            
            <motion.div 
              className="text-white"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold drop-shadow-md"
                variants={itemVariants}
              >
                {match.homeTeam.name} vs {match.awayTeam.name}
              </motion.h1>
              
              <motion.div 
                className="flex items-center gap-3 mt-3 text-sm text-white/80 drop-shadow-md"
                variants={itemVariants}
              >
                <Calendar className="w-4 h-4" />
                <span>{match.date}</span>
                <MapPin className="w-4 h-4" />
                <span>{match.stadium.name}, {match.stadium.city}</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-4 mt-4"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">{formatScore()}</span>
                </div>
                
                {match.highlights && (
                  <a href={match.highlights} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <Play className="w-4 h-4" />
                    <span>Highlights</span>
                  </a>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Rate this match</h2>
                    <MatchRating onChange={handleRatingChange} />
                    
                    <div className="flex items-center justify-between mt-6">
                      <button 
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                          hasWatched ? "bg-green-500 text-green-500 hover:bg-green-500/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                        onClick={handleAddToWatched}
                        disabled={hasWatched}
                      >
                        <Star className="w-4 h-4" />
                        {hasWatched ? "Logged" : "Log Match"}
                      </button>
                      
                      <button 
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                          isFavorited ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                        onClick={handleToggleFavorite}
                      >
                        <Heart className="w-4 h-4" />
                        {isFavorited ? "Unfavorite" : "Favorite"}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <button 
                        className="text-sm text-muted-foreground hover:underline"
                        onClick={handleShareMatch}
                      >
                        <Share2 className="w-4 h-4 mr-1 inline-block" />
                        Share
                      </button>
                      
                      <button 
                        className="text-sm text-muted-foreground hover:underline"
                        onClick={handleAddToList}
                      >
                        <ListChecks className="w-4 h-4 mr-1 inline-block" />
                        Add to List
                      </button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Match Details</h2>
                    <p className="text-sm text-muted-foreground">{match.description}</p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{match.date}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{match.stadium.name}, {match.stadium.city}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:w-2/3">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Reviews</h2>
                    
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>
                      </div>
                    ) : (
                      reviews.map(review => (
                        <div key={review.id} className="mb-4">
                          <p className="font-medium">{review.author}</p>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                          <ReviewActions />
                        </div>
                      ))
                    )}
                    
                    <div className="mt-6">
                      <h3 className="text-md font-semibold mb-2">Write a Review</h3>
                      
                      {isWritingReview ? (
                        <div className="flex flex-col gap-3">
                          <textarea 
                            className="w-full h-32 border rounded-md p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Share your thoughts on this match..."
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                          />
                          <div className="flex justify-end gap-2">
                            <button 
                              className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
                              onClick={() => setIsWritingReview(false)}
                            >
                              Cancel
                            </button>
                            <button 
                              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={handleSubmitReview}
                            >
                              Submit Review
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          className="w-full px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => setIsWritingReview(true)}
                        >
                          Write a Review
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
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
