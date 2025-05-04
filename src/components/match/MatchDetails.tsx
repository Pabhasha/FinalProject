
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Match } from '@/utils/mockData';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface MatchDetailsProps {
  match: Match & { 
    backgroundImage?: string;
    description?: string;
  };
}

const MatchDetails = ({ match }: MatchDetailsProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      "hover:shadow-md",
      isDark ? "hover:border-primary/30" : "hover:border-primary/50"
    )}>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">Match Details</h2>
        
        <div className={cn(
          "mb-4 p-3 rounded-md text-sm",
          isDark ? "bg-muted/40" : "bg-muted/80"
        )}>
          <p className="text-sm text-muted-foreground line-clamp-6 md:line-clamp-none">
            {match?.description || "No description available."}
          </p>
        </div>
        
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span>{match.date}</span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="break-words">{match.stadium.name}, {match.stadium.city}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default MatchDetails;
