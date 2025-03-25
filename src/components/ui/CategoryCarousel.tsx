
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ 
  title, 
  matches,
  categorySlug
}) => {
  return (
    <div className="space-y-3 mb-10">
      <div className="flex items-center justify-between">
        <Link 
          to={`/category/${categorySlug}`}
          className="text-xl font-semibold hover:text-primary transition-colors letterboxd-link"
        >
          {title}
        </Link>
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
          {matches.map((match) => (
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
