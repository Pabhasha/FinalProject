
import React from 'react';
import { Calendar, MapPin, Award, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Match } from '@/utils/mockData';
import { getWorkingHighlightLink, getYouTubeThumbnail } from '@/utils/videoLinks';
import { useTheme } from 'next-themes';

interface MatchHeaderProps {
  match: Match & { 
    backgroundImage?: string;
    description?: string;
  };
  formatScore: () => string;
}

const MatchHeader = ({ match, formatScore }: MatchHeaderProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const placeholderImg = "https://via.placeholder.com/400x600";
  const highlightLink = match.id ? getWorkingHighlightLink(match.id) : '';
  
  React.useEffect(() => {
    if (!match) return;
    
    const img = new Image();
    img.src = match.backgroundImage || match.poster || placeholderImg;
    img.onload = () => setImageLoaded(true);
  }, [match]);
  
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

  const isDark = theme === 'dark';

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* Fixed aspect ratio container for consistent layout */}
      <AspectRatio ratio={isMobile ? 16/9 : 21/9} className="min-h-[200px] max-h-[50vh] rounded-lg">
        {/* Background image with proper overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 rounded-lg",
            imageLoaded ? (isDark ? "opacity-50" : "opacity-30") : "opacity-0"
          )}
          style={{ 
            backgroundImage: `url(${match.backgroundImage || match.poster || placeholderImg})`,
            backgroundPosition: "center 30%"
          }}
          aria-hidden="true"
        />
        
        {/* Gradient overlay for better text readability */}
        <div 
          className={cn(
            "absolute inset-0 rounded-lg",
            isDark 
              ? "bg-gradient-to-t from-background via-background/80 to-transparent" 
              : "bg-gradient-to-t from-background/90 via-background/70 to-background/40"
          )}
          aria-hidden="true"
        />
        
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center animate-pulse rounded-lg">
            <div className="w-full h-full bg-muted/20"></div>
          </div>
        )}
        
        {/* Content container with improved padding */}
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-6 sm:pb-8">
          {/* Competition badge */}
          <div className={cn(
            "backdrop-blur-sm rounded-full px-3 py-1 w-fit mb-3",
            isDark ? "bg-secondary/90" : "bg-primary/10 border border-primary/20"
          )}>
            <span className={cn(
              "uppercase text-xs font-semibold tracking-wider",
              isDark ? "text-secondary-foreground" : "text-primary"
            )}>
              {match.competition.name}
            </span>
          </div>
          
          {/* Title and metadata with improved typography */}
          <motion.div 
            className={isDark ? "text-white" : "text-foreground"}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className={cn(
                "text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold break-words hyphens-auto line-clamp-2",
                isDark ? "drop-shadow-lg" : "text-gray-900"
              )}
              variants={itemVariants}
            >
              {match.homeTeam.name} vs {match.awayTeam.name}
            </motion.h1>
            
            {/* Match metadata with improved layout */}
            <motion.div 
              className={cn(
                "flex flex-wrap items-center gap-2 sm:gap-3 mt-3 text-xs sm:text-sm",
                isDark ? "text-white/90 drop-shadow-md" : "text-gray-700"
              )}
              variants={itemVariants}
            >
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{match.date}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                  {match.stadium.name}, {match.stadium.city}
                </span>
              </span>
            </motion.div>
            
            {/* Score and highlights row with improved spacing */}
            <motion.div 
              className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4"
              variants={itemVariants}
            >
              <div className={cn(
                "flex items-center gap-2 backdrop-blur-sm rounded-lg px-3 py-1.5",
                isDark ? "bg-black/50" : "bg-white/50 border border-gray-200"
              )}>
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="font-semibold">{formatScore()}</span>
              </div>
            </motion.div>

            {highlightLink && (
              <motion.div 
                className="mt-4 sm:mt-6"
                variants={itemVariants}
              >
                <a 
                  href={highlightLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 backdrop-blur-sm rounded-lg px-3 py-1.5 transition-colors w-fit",
                    isDark 
                      ? "bg-black/50 hover:bg-black/70" 
                      : "bg-primary/10 border border-primary/20 hover:bg-primary/20"
                  )}
                  aria-label="Watch highlights on YouTube"
                >
                  <Play className="w-4 h-4" />
                  <span className="font-medium">Watch Highlights</span>
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </AspectRatio>
    </div>
  );
};

export default MatchHeader;
