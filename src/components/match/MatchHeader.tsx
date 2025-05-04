
import React from 'react';
import { Calendar, MapPin, Award, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Match } from '@/utils/mockData';
import { getWorkingHighlightLink, getYouTubeThumbnail } from '@/utils/videoLinks';

interface MatchHeaderProps {
  match: Match & { 
    backgroundImage?: string;
    description?: string;
  };
  formatScore: () => string;
}

const MatchHeader = ({ match, formatScore }: MatchHeaderProps) => {
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

  return (
    <div className="relative w-full overflow-hidden">
      {/* Fixed aspect ratio container for consistent layout */}
      <AspectRatio ratio={isMobile ? 16/9 : 21/9} className="min-h-[250px] max-h-[60vh]">
        {/* Background image with proper overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
            imageLoaded ? "opacity-40" : "opacity-0"
          )}
          style={{ 
            backgroundImage: `url(${match.backgroundImage || match.poster || placeholderImg})`,
            backgroundPosition: "center 30%"
          }}
          aria-hidden="true"
        />
        
        {/* Gradient overlay for better text readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" 
          aria-hidden="true"
        />
        
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <div className="w-full h-full bg-muted/20"></div>
          </div>
        )}
        
        {/* Content container with improved padding */}
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-6 sm:pb-8">
          {/* Competition badge */}
          <div className="bg-secondary/90 backdrop-blur-sm rounded-full px-3 py-1 w-fit mb-3">
            <span className="uppercase text-xs font-semibold tracking-wider text-secondary-foreground">
              {match.competition.name}
            </span>
          </div>
          
          {/* Title and metadata with improved typography */}
          <motion.div 
            className="text-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg break-words hyphens-auto line-clamp-2"
              variants={itemVariants}
            >
              {match.homeTeam.name} vs {match.awayTeam.name}
            </motion.h1>
            
            {/* Match metadata with improved layout */}
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
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
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
                  className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 hover:bg-black/70 transition-colors w-fit"
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
