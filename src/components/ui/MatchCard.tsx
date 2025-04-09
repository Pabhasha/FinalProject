
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Match } from '@/utils/mockData';
import MatchRating from './MatchRating';
import { Calendar, Trophy } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'premium' | 'minimal';
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  size = 'md',
  className,
  variant = 'default'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Define alternative content for the match
  const matchVariants = [
    {
      title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      score: `${match.score.homeScore}-${match.score.awayScore}`,
      highlight: "Full Time",
      poster: match.poster
    },
    {
      title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      score: `Half Time: ${Math.floor(match.score.homeScore/2)}-${Math.floor(match.score.awayScore/2)}`,
      highlight: "Key Moment",
      poster: match.poster // Using same poster but could be different angles
    },
    {
      title: `${match.competition.name}`,
      score: `${match.date}`,
      highlight: "Match Info",
      poster: match.poster
    }
  ];

  // Start content rotation
  const startRotation = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setActiveContentIndex((prevIndex) => (prevIndex + 1) % matchVariants.length);
    }, 5000);
  };

  // Stop content rotation
  const stopRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Handle hover effects and cleanup
  useEffect(() => {
    if (hovered) {
      startRotation();
    } else {
      stopRotation();
      setActiveContentIndex(0); // Reset to default content when not hovering
      setIsFlipped(false);
    }
    
    return () => stopRotation(); // Cleanup on unmount
  }, [hovered]);

  // Determine sizing based on the size prop
  const cardSizes = {
    sm: 'w-32 h-48',
    md: 'w-40 h-60',
    lg: 'w-48 h-72'
  };

  const scoreFontSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const formatScore = (match: Match) => {
    let score = `${match.score.homeScore}-${match.score.awayScore}`;
    if (match.score.extraTime) {
      score += " (a.e.t.)";
      if (match.score.penalties) {
        score += ` [${match.score.penalties.homeScore}-${match.score.penalties.awayScore} pens]`;
      }
    }
    return score;
  };

  const isPremium = variant === 'premium';
  const currentContent = matchVariants[activeContentIndex];

  // Handle card flip
  const handleFlip = () => {
    if (hovered) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-md shadow-lg transition-all duration-300",
        isPremium ? "match-card-premium hover:scale-[1.02]" : "match-card-hover",
        isPremium && hovered ? "glow-box" : "",
        cardSizes[size],
        className,
        isFlipped ? "card-flipped" : ""
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleFlip}
    >
      <Link to={`/match/${match.id}`} className="block h-full">
        {/* Poster Image */}
        <div className={cn(
          "relative w-full h-full transition-all duration-500",
          isFlipped ? "opacity-0" : "opacity-100"
        )}>
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center">
                <div className="animate-spin w-6 h-6 rounded-full border-2 border-t-transparent border-blaugrana-primary"></div>
              </div>
            </div>
          )}
          <img
            src={currentContent.poster}
            alt={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              imageLoaded ? "opacity-100" : "opacity-0",
              hovered && isPremium ? "scale-105 blur-sm" : ""
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Front Content Overlay */}
          <div className={cn(
            "absolute inset-0 flex flex-col justify-end p-3",
            "bg-gradient-to-t from-black/90 via-black/50 to-transparent",
            isPremium ? "opacity-100" : "match-card-overlay"
          )}>
            {/* Improved team badges and names layout */}
            <div className="flex justify-between mb-2">
              {/* Home team */}
              <div className="flex flex-col items-center max-w-[40%]">
                <img 
                  src={match.homeTeam.logo} 
                  alt={match.homeTeam.name} 
                  className="w-6 h-6 object-contain mb-1" 
                />
                <span className="text-white font-medium text-xs text-center truncate w-full">
                  {match.homeTeam.name}
                </span>
              </div>
              
              {/* VS */}
              <div className="flex flex-col items-center">
                <span className="text-white/70 text-xs font-bold">
                  VS
                </span>
              </div>
              
              {/* Away team */}
              <div className="flex flex-col items-center max-w-[40%]">
                <img 
                  src={match.awayTeam.logo} 
                  alt={match.awayTeam.name} 
                  className="w-6 h-6 object-contain mb-1" 
                />
                <span className="text-white font-medium text-xs text-center truncate w-full">
                  {match.awayTeam.name}
                </span>
              </div>
            </div>
            
            {/* Score */}
            <div className={cn(
              "relative z-10 bg-black/50 backdrop-blur-sm rounded-md px-3 py-1.5 mb-2",
              "border border-white/10 text-center",
              scoreFontSizes[size],
              isPremium ? "font-bold text-white animate-pulse" : "font-semibold text-white"
            )}>
              {activeContentIndex === 0 ? formatScore(match) : currentContent.score}
            </div>
            
            <div className="flex justify-between items-center">
              {activeContentIndex === 0 ? (
                <MatchRating matchId={match.id} size={size === 'sm' ? 'sm' : 'md'} />
              ) : (
                <span className="text-xs text-blaugrana-primary font-medium">{currentContent.highlight}</span>
              )}
              
              <div className="flex items-center gap-1">
                <img 
                  src={match.competition.logo} 
                  alt={match.competition.name} 
                  className="w-4 h-4 object-contain" 
                />
                <span className="text-xs text-gray-300 truncate max-w-[60px]">
                  {match.competition.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Back (Flipped State) - Only visible when flipped */}
        <div className={cn(
          "absolute inset-0 bg-gray-900/95 p-3",
          "flex flex-col justify-between",
          "transition-all duration-500 transform backface-hidden",
          isFlipped ? "opacity-100" : "opacity-0"
        )}>
          <div className="text-center">
            <h3 className="text-white font-bold text-sm mb-1">{match.homeTeam.name} vs {match.awayTeam.name}</h3>
            <div className="flex justify-center items-center gap-2 text-xs text-gray-300 mb-3">
              <Calendar className="w-3 h-3" />
              <span>{new Date(match.date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-white">{match.competition.name}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 flex items-center justify-center text-amber-400">🏟️</span>
              <span className="text-xs text-white truncate">{match.stadium.name}, {match.stadium.city}</span>
            </div>
            
            {match.stage && (
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 flex items-center justify-center text-amber-400">🏆</span>
                <span className="text-xs text-white">{match.stage}</span>
              </div>
            )}
          </div>
          
          <div className="text-center bg-blaugrana-primary/20 rounded py-1 border border-blaugrana-primary/30">
            <span className="text-xs text-white font-medium">Tap to flip back</span>
          </div>
        </div>
      </Link>

      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-amber-600 text-black text-xs font-bold px-2 py-0.5 rounded shadow-md">
          PREMIUM
        </div>
      )}
    </div>
  );
};

export default MatchCard;
