
import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, MessageSquare, Share2, ListChecks, Play, Award, Calendar, MapPin } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import MatchRating from '@/components/ui/MatchRating';
import { getMatchById, getReviewsForMatch, Match, Review } from '@/utils/mockData';
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
import { Button } from '@/components/ui/button';
import { getWorkingHighlightLink } from '@/utils/videoLinks';

const placeholderImg = "https://via.placeholder.com/400x600";

const ImageLoader = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full min-h-[300px]" />
        </div>
      )}
      <motion.img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

interface MatchWithDescription extends Match {
  description?: string;
  backgroundImage?: string; // Add the backgroundImage property
}

interface ExtendedReview extends Review {
  author: string;
  comment: string;
}

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const match = getMatchById(id || '') as MatchWithDescription;
  const reviews = getReviewsForMatch(id || '') as ExtendedReview[];
  const isMobile = useIsMobile();
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [watchedMatches, setWatchedMatches] = useLocalStorage<string[]>('footballtrackr-watched', []);
  const [hasWatched, setHasWatched] = useState(false);
  
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

  const highlightLink = id ? getWorkingHighlightLink(id) : '';

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
        {/* Match Hero Section - Enhanced responsive header */}
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[350px] overflow-hidden -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-24">
          {/* Background image with proper overlay */}
          <div 
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
              imageLoaded ? "opacity-40" : "opacity-0"
            )}
            style={{ 
              backgroundImage: `url(${match.backgroundImage || match.poster})`,
              backgroundPosition: "center 30%"
            }}
          ></div>
          
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
          
          {/* Skeleton loader for image */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          )}
          
          {/* Content container with proper padding */}
          <div className="relative h-full container mx-auto px-4 sm:px-6 flex flex-col justify-end pb-6 sm:pb-8 md:pb-12">
            {/* Competition badge */}
            <div className="bg-secondary/80 backdrop-blur-sm rounded-full px-3 py-1 w-fit mb-3">
              <span className="uppercase text-xs font-semibold tracking-wider text-secondary-foreground">
                {match.competition.name}
              </span>
            </div>
            
            {/* Title and metadata with improved responsiveness */}
            <motion.div 
              className="text-white"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg break-words hyphens-auto max-w-full"
                variants={itemVariants}
                style={{ 
                  wordBreak: 'break-word', 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {match.homeTeam.name} vs {match.awayTeam.name}
              </motion.h1>
              
              {/* Match metadata with flex-wrap for small screens */}
              <motion.div 
                className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 text-xs sm:text-sm text-white/90 drop-shadow-md"
                variants={itemVariants}
              >
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{match.date}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">{match.stadium.name}, {match.stadium.city}</span>
                </span>
              </motion.div>
              
              {/* Score and highlights row */}
              <motion.div 
                className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  <span className="font-semibold">{formatScore()}</span>
                </div>
                
                {highlightLink && (
                  <a 
                    href={highlightLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 hover:bg-black/50 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Highlights</span>
                  </a>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Main content section with responsive grid */}
        <section className="py-6 sm:py-8 md:py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Left column - Rating/Actions */}
              <div className="md:col-span-1 space-y-6">
                <Card className="overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-lg font-semibold mb-4">Rate this match</h2>
                    <MatchRating 
                      matchId={id || 'unknown'} 
                      onRatingChange={handleRatingChange} 
                    />
                    
                    {/* Action buttons with improved responsive layout */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <Button 
                        variant={hasWatched ? "default" : "secondary"}
                        className={cn(
                          hasWatched && "bg-green-600 hover:bg-green-700",
                        )}
                        onClick={handleAddToWatched}
                        disabled={hasWatched}
                      >
                        <Star className="w-4 h-4" />
                        {hasWatched ? "Logged" : "Log Match"}
                      </Button>
                      
                      <Button 
                        variant={isFavorited ? "default" : "secondary"}
                        onClick={handleToggleFavorite}
                      >
                        <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                        {isFavorited ? "Favorited" : "Favorite"}
                      </Button>
                    </div>
                    
                    {/* Secondary actions with improved styling */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={handleShareMatch}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={handleAddToList}
                      >
                        <ListChecks className="w-4 h-4 mr-1" />
                        Add to List
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Match details card */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-lg font-semibold mb-4">Match Details</h2>
                    <p className="text-sm text-muted-foreground">{match?.description || "No description available."}</p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{match.date}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="break-words">{match.stadium.name}, {match.stadium.city}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column - Reviews */}
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-lg font-semibold mb-4">Reviews</h2>
                    
                    {/* Fan review with better spacing */}
                    <div className="mb-6">
                      <div className="mb-4 border-b border-border/40 pb-4">
                        <p className="font-medium">football_fan</p>
                        <p className="text-sm text-muted-foreground my-2">
                          The best World Cup final I've ever seen. Messi vs Mbappé, drama, goals, penalties... This match had it all!
                        </p>
                        <ReviewActions 
                          reviewId="fan-review-1" 
                          initialLikes={245} 
                          initialDislikes={0}
                        />
                      </div>
                    </div>
                    
                    {/* Write review button - centered on mobile, left-aligned on desktop */}
                    <div className="mt-6 flex sm:justify-start justify-center">
                      <Button>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Write a Review
                      </Button>
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
