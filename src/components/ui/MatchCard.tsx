
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Match } from '@/utils/mockData';
import MatchRating from './MatchRating';

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

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-md shadow-lg transition-all duration-300",
        isPremium ? "match-card-premium hover:scale-[1.02]" : "match-card-hover",
        isPremium && hovered ? "glow-box" : "",
        cardSizes[size],
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/match/${match.id}`} className="block h-full">
        {/* Poster Image */}
        <div className="relative w-full h-full">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center">
                <div className="animate-spin w-6 h-6 rounded-full border-2 border-t-transparent border-blaugrana-primary"></div>
              </div>
            </div>
          )}
          <img
            src={match.poster}
            alt={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              imageLoaded ? "opacity-100" : "opacity-0",
              hovered && isPremium ? "scale-110 blur-sm" : ""
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Overlay Content */}
        <div className={cn(
          "absolute inset-0 flex flex-col justify-end p-4",
          "bg-gradient-to-t from-black/90 via-black/50 to-transparent",
          isPremium ? "opacity-100" : "match-card-overlay"
        )}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img 
                src={match.homeTeam.logo} 
                alt={match.homeTeam.name} 
                className="w-6 h-6 object-contain" 
              />
              <span className="text-white font-semibold truncate max-w-[80px]">
                {match.homeTeam.name}
              </span>
            </div>
            <span className="text-white/70 text-sm">
              vs
            </span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold truncate max-w-[80px]">
                {match.awayTeam.name}
              </span>
              <img 
                src={match.awayTeam.logo} 
                alt={match.awayTeam.name} 
                className="w-6 h-6 object-contain" 
              />
            </div>
          </div>
          
          <div className={cn(
            "relative z-10 bg-black/50 backdrop-blur-sm rounded-md px-4 py-2 mb-3",
            "border border-white/10 text-center",
            scoreFontSizes[size],
            isPremium ? "font-bold text-white animate-pulse" : "font-semibold text-white"
          )}>
            {formatScore(match)}
          </div>
          
          <div className="flex justify-between items-center mb-1">
            <MatchRating matchId={match.id} size={size === 'sm' ? 'sm' : 'md'} />
            
            <div className="flex items-center gap-1">
              <img 
                src={match.competition.logo} 
                alt={match.competition.name} 
                className="w-4 h-4 object-contain" 
              />
              <span className="text-xs text-gray-300">
                {match.competition.name}
              </span>
            </div>
          </div>
          
          <div className="mt-1 text-xs text-gray-400">
            {new Date(match.date).toLocaleDateString()}
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
