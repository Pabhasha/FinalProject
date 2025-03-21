
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Match } from '@/utils/mockData';
import MatchRating from './MatchRating';

interface MatchCardProps {
  match: Match;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  size = 'md',
  className 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

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

  return (
    <div className={cn(
      "relative overflow-hidden rounded-md shadow-lg match-card-hover",
      cardSizes[size],
      className
    )}>
      <Link to={`/match/${match.id}`} className="block h-full">
        {/* Poster Image */}
        <div className="relative w-full h-full bg-black/20">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="animate-pulse w-8 h-8 rounded-full bg-gray-600"></div>
            </div>
          )}
          <img
            src={match.poster}
            alt={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Hover Overlay */}
        <div className="match-card-overlay">
          <div className="flex items-center mb-2">
            <img 
              src={match.homeTeam.logo} 
              alt={match.homeTeam.name} 
              className="w-6 h-6 object-contain mr-2" 
            />
            <span className="text-white font-semibold">{match.homeTeam.name}</span>
          </div>
          
          <div className={cn("font-bold text-white mb-2", scoreFontSizes[size])}>
            {formatScore(match)}
          </div>
          
          <div className="flex items-center mb-4">
            <img 
              src={match.awayTeam.logo} 
              alt={match.awayTeam.name} 
              className="w-6 h-6 object-contain mr-2" 
            />
            <span className="text-white font-semibold">{match.awayTeam.name}</span>
          </div>
          
          <MatchRating matchId={match.id} size={size === 'sm' ? 'sm' : 'md'} />
          
          <div className="mt-3 text-xs text-gray-300">
            {new Date(match.date).toLocaleDateString()}
          </div>
          
          <div className="mt-1 flex items-center justify-center">
            <img 
              src={match.competition.logo} 
              alt={match.competition.name} 
              className="w-4 h-4 object-contain mr-1" 
            />
            <span className="text-xs text-gray-300">{match.competition.name}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MatchCard;
