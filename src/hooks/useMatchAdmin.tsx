
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Import initial data to populate the admin dashboard
import { mockMatches as initialMatches } from '@/utils/mockData';

export interface MatchData {
  id: string;
  slug: string;
  title: string;
  competition: string;
  category: string;
  date: string;
  result: string;
  description: string;
  location: string;
  image: string;
  ratings?: any[];
  reviews?: any[];
  highlights?: string;
  isPublished?: boolean;
  background?: string;
  engagementStats?: {
    ratingCount: number;
    reviewCount: number;
    watchedCount: number;
  };
}

export const useMatchAdmin = () => {
  const [matches, setMatches] = useLocalStorage<MatchData[]>('footballtrackr-matches', initialMatches || []);

  // Get all matches, optionally filtered by category
  const getMatches = (category?: string, showDrafts = true) => {
    let filteredMatches = matches;
    
    // Filter by published status if not showing drafts
    if (!showDrafts) {
      filteredMatches = filteredMatches.filter(match => match.isPublished !== false);
    }
    
    // Then filter by category if specified
    if (!category || category === 'all') return filteredMatches;
    return filteredMatches.filter((match) => match.category === category);
  };

  // Add a new match
  const addMatch = async (match: MatchData) => {
    // Ensure isPublished is set (defaults to true if not specified)
    if (match.isPublished === undefined) {
      match.isPublished = true;
    }
    
    // Add engagement stats
    match.engagementStats = {
      ratingCount: 0,
      reviewCount: 0,
      watchedCount: 0
    };
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setMatches((prev) => [match, ...prev]);
    return match;
  };

  // Update an existing match
  const updateMatch = async (updatedMatch: MatchData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setMatches((prev) =>
      prev.map((match) =>
        match.id === updatedMatch.id ? updatedMatch : match
      )
    );
    return updatedMatch;
  };

  // Delete a match
  const deleteMatch = async (id: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setMatches((prev) => prev.filter((match) => match.id !== id));
    return id;
  };

  return {
    matches,
    getMatches,
    addMatch,
    updateMatch,
    deleteMatch,
  };
};
