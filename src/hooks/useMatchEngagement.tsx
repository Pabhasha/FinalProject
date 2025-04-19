
import { useState, useEffect } from 'react';
import { Match } from '@/utils/mockData';
import { getTrendingMatches, getTopRatedMatches } from '@/utils/engagementAlgorithms';

export function useMatchEngagement() {
  const [trendingMatches, setTrendingMatches] = useState<Match[]>([]);
  const [topRatedMatches, setTopRatedMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setTrendingMatches(getTrendingMatches());
      setTopRatedMatches(getTopRatedMatches());
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Re-fetch matches (would connect to real API in production)
  const refreshMatches = () => {
    setIsLoading(true);
    setTrendingMatches(getTrendingMatches());
    setTopRatedMatches(getTopRatedMatches());
    setIsLoading(false);
  };

  return {
    trendingMatches,
    topRatedMatches,
    isLoading,
    refreshMatches
  };
}
