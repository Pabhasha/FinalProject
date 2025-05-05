
import React from 'react';
import { Play } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  posterImage?: string;
  className?: string;
}

const VideoPlayer = ({ videoUrl, posterImage, className }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  
  // Convert YouTube URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Handle YouTube URLs
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
    
    return url;
  };
  
  const embedUrl = getEmbedUrl(videoUrl);
  
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <AspectRatio ratio={16/9} className="bg-black/20">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title="Video player"
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {posterImage && (
              <img 
                src={posterImage}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <Button 
              onClick={handlePlay}
              className="relative z-10 rounded-full size-12 sm:size-16 flex items-center justify-center bg-primary/90 hover:bg-primary hover:scale-105 transition-all"
              aria-label="Play video"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-1" />
            </Button>
          </div>
        )}
      </AspectRatio>
    </div>
  );
};

export default VideoPlayer;
