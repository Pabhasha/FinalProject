
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from '@/components/ui/carousel';
import MatchCard from '@/components/ui/MatchCard';
import { Match } from '@/utils/mockData';
import { Button } from '@/components/ui/button';

interface CategoryCarouselProps {
  title: string;
  matches: Match[];
  categorySlug: string;
  description?: string;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ 
  title, 
  matches,
  categorySlug,
  description
}) => {
  // Take only the first 12 matches for the carousel
  const displayMatches = matches.slice(0, 12);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Link 
            to={`/category/${categorySlug}`}
            className="text-2xl font-semibold hover:text-primary transition-colors letterboxd-link group flex items-center"
          >
            {title}
            <ChevronRight className="w-5 h-5 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </Link>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link to={`/category/${categorySlug}`}>
            View All
          </Link>
        </Button>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {displayMatches.map((match) => (
            <CarouselItem key={match.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <MatchCard match={match} size="sm" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="h-8 w-8 -left-3 opacity-70 hover:opacity-100" />
        <CarouselNext className="h-8 w-8 -right-3 opacity-70 hover:opacity-100" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
