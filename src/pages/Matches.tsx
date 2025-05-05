
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { mockMatches } from '@/utils/mockData';
import MatchCard from '@/components/ui/MatchCard';

const Matches = () => {
  // Remove duplicates by checking for unique IDs
  const uniqueMatches = Array.from(
    new Map(mockMatches.map(match => [match.id, match])).values()
  );

  return (
    <MainLayout>
      <div className="page-transition">
        <h1 className="text-3xl font-bold mb-8">All Matches</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {uniqueMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Matches;
