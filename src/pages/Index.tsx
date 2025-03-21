
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MatchCard from '@/components/ui/MatchCard';
import { mockMatches } from '@/utils/mockData';

const Index = () => {
  const [featured, setFeatured] = useState(mockMatches[0]);
  const [trending, setTrending] = useState(mockMatches.slice(1, 5));
  const [recentlyAdded, setRecentlyAdded] = useState(mockMatches.slice(5));
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = featured.poster;
    img.onload = () => setImageLoaded(true);
  }, [featured]);

  return (
    <MainLayout>
      <div className="page-transition space-y-12">
        {/* Hero Section with Featured Match */}
        <section className="relative overflow-hidden rounded-xl h-[60vh] min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ 
              backgroundImage: `url(${featured.poster})`,
              opacity: imageLoaded ? 0.6 : 0,
            }}
          ></div>
          
          {!imageLoaded && (
            <div className="absolute inset-0 bg-card animate-pulse"></div>
          )}
          
          <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-10">
            <div className="max-w-3xl animate-fade-in">
              <div className="inline-block bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Featured Match
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {featured.homeTeam.name} vs {featured.awayTeam.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <img 
                  src={featured.competition.logo} 
                  alt={featured.competition.name} 
                  className="w-5 h-5 mr-2" 
                />
                <span className="text-gray-200 text-sm md:text-base">
                  {featured.competition.name} • {featured.stage}
                </span>
              </div>
              
              <p className="text-gray-300 mb-6 max-w-2xl">
                An incredible {featured.score.homeScore}-{featured.score.awayScore} 
                {featured.score.extraTime ? " thriller that went to extra time" : " match"} 
                {featured.score.penalties ? " and was decided on penalties" : ""}. 
                One of the most memorable games in recent football history.
              </p>
              
              <a 
                href={`/match/${featured.id}`} 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                View Match Details
              </a>
            </div>
          </div>
        </section>

        {/* Trending Matches */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trending Matches</h2>
            <a href="/matches" className="text-primary hover:underline text-sm">
              View All →
            </a>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {trending.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        {/* Recently Added */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recently Added</h2>
            <a href="/matches" className="text-primary hover:underline text-sm">
              View All →
            </a>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {recentlyAdded.map(match => (
              <MatchCard key={match.id} match={match} size="sm" />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
