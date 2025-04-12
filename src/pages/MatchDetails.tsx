
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, MessageSquare, Share2, ListChecks, Play } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import MatchRating from '@/components/ui/MatchRating';
import { getMatchById, getReviewsForMatch } from '@/utils/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useLists } from '@/hooks/useLists';
import ListModal from '@/components/ui/ListModal';

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const match = getMatchById(id || '');
  const reviews = getReviewsForMatch(id || '');
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [watchedMatches, setWatchedMatches] = useLocalStorage<string[]>('footballtrackr-watched', []);
  const [hasWatched, setHasWatched] = useState(false);
  
  // Favorites functionality
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Lists functionality
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
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Match Not Found</h1>
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
        toast("Link copied to clipboard", {
          description: "Share this match with your friends!",
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

  return (
    <MainLayout>
      <div className="page-transition">
        {/* Hero Banner with Match Details */}
        <div className="relative h-[70vh] min-h-[500px] -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-24 overflow-hidden">
          {/* Poster Background */}
          <div 
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
              imageLoaded ? "opacity-40" : "opacity-0"
            )}
            style={{ backgroundImage: `url(${match.poster})` }}
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60"></div>
          
          {/* Loading State */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-card flex items-center justify-center">
              <div className="animate-pulse w-16 h-16 rounded-full bg-muted"></div>
            </div>
          )}
          
          {/* Content Overlay */}
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
            <div className="max-w-3xl animate-fade-in">
              {/* Competition Badge */}
              <div className="inline-flex items-center bg-card/60 backdrop-blur-sm px-3 py-1.5 rounded-full mb-6">
                <img 
                  src={match.competition.logo} 
                  alt={match.competition.name} 
                  className="w-5 h-5 mr-2" 
                />
                <span className="text-sm font-medium">{match.competition.name} • {match.stage}</span>
              </div>
              
              {/* Teams and Score */}
              <div className="flex flex-wrap items-center mb-4">
                <div className="flex items-center mr-4 mb-2">
                  <img 
                    src={match.homeTeam.logo} 
                    alt={match.homeTeam.name} 
                    className="w-10 h-10 object-contain mr-2" 
                  />
                  <h1 className="text-xl md:text-3xl font-bold truncate max-w-[200px] md:max-w-none">{match.homeTeam.name}</h1>
                </div>
                
                <div className="text-xl md:text-3xl font-bold px-3 mb-2">{formatScore()}</div>
                
                <div className="flex items-center mb-2">
                  <img 
                    src={match.awayTeam.logo} 
                    alt={match.awayTeam.name} 
                    className="w-10 h-10 object-contain mr-2" 
                  />
                  <h1 className="text-xl md:text-3xl font-bold truncate max-w-[200px] md:max-w-none">{match.awayTeam.name}</h1>
                </div>
              </div>
              
              {/* Match Meta */}
              <div className="text-sm text-muted-foreground mb-8">
                {new Date(match.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • {match.stadium.name}, {match.stadium.city}, {match.stadium.country}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {/* Rate */}
                <div className="flex items-center">
                  <div className="mr-3">
                    <MatchRating 
                      matchId={match.id} 
                      initialRating={userRating}
                      onRatingChange={handleRatingChange}
                      size="lg"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">Rate</span>
                </div>
                
                {/* Watch */}
                <button 
                  onClick={handleAddToWatched}
                  disabled={hasWatched}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    hasWatched 
                      ? "bg-primary/20 text-primary" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {hasWatched ? "Watched" : "Log Match"}
                </button>
                
                {/* Highlights */}
                {match.highlights && (
                  <a 
                    href={match.highlights}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Highlights
                  </a>
                )}
                
                {/* More Actions */}
                <div className="flex items-center space-x-4 ml-auto">
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
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Write a Review
            </button>
          </div>
          
          {reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map(review => (
                <div key={review.id} className="bg-card rounded-lg p-6 shadow-sm">
                  <div className="flex items-start">
                    {/* User Avatar */}
                    <img 
                      src={review.userAvatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                      alt={review.username} 
                      className="w-10 h-10 rounded-full object-cover mr-4" 
                    />
                    
                    <div className="flex-1">
                      {/* Review Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{review.username}</h3>
                          <div className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <MatchRating matchId={review.matchId} initialRating={review.rating} readOnly size="sm" />
                      </div>
                      
                      {/* Review Content */}
                      <p className="text-sm mb-4">{review.content}</p>
                      
                      {/* Actions */}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <button className="flex items-center hover:text-primary transition-colors">
                          <Heart className="w-4 h-4 mr-1" />
                          <span>{review.likes}</span>
                        </button>
                        <span className="mx-3">•</span>
                        <button className="flex items-center hover:text-primary transition-colors">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review this match!</p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Write a Review
              </button>
            </div>
          )}
        </section>
      </div>
      
      {/* List Modal */}
      <ListModal 
        isOpen={isListModalOpen}
        onClose={closeListModal}
        matchId={id || null}
      />
    </MainLayout>
  );
};

export default MatchDetails;
