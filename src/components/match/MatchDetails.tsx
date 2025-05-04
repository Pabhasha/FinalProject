
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Match } from '@/utils/mockData';

interface MatchDetailsProps {
  match: Match & { 
    backgroundImage?: string;
    description?: string;
  };
}

const MatchDetails = ({ match }: MatchDetailsProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">Match Details</h2>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-6 md:line-clamp-none">
          {match?.description || "No description available."}
        </p>
        
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
