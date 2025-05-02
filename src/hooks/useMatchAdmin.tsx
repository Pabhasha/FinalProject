
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getWorkingHighlightLink } from '@/utils/videoLinks';

// Import initial data to populate the admin dashboard
import { mockMatches as importedMockMatches } from '@/utils/mockData';

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
  backgroundImage?: string;  // Field for admin background image
  engagementStats?: {
    ratingCount: number;
    reviewCount: number;
    watchedCount: number;
  };
}

// Convert mockMatches to the correct MatchData format with working highlight links
const initialMatches: MatchData[] = importedMockMatches.map(match => ({
  id: match.id,
  slug: `${match.homeTeam.name.toLowerCase()}-vs-${match.awayTeam.name.toLowerCase()}-${match.date.replace(/[^0-9]/g, '')}`,
  title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
  competition: match.competition.name,
  category: match.competition.name.toLowerCase().includes('world cup') ? 'world-cup' :
           match.homeTeam.name === 'Barcelona' || match.awayTeam.name === 'Barcelona' && 
           match.homeTeam.name === 'Real Madrid' || match.awayTeam.name === 'Real Madrid' ? 'el-clasico' : 'premier-league',
  date: match.date,
  result: `${match.score.homeScore}-${match.score.awayScore}${match.score.penalties ? ` (${match.score.penalties.homeScore}-${match.score.penalties.awayScore})` : ''}`,
  description: `${match.homeTeam.name} faced ${match.awayTeam.name} in an exciting match at ${match.stadium.name}.`,
  location: `${match.stadium.name}, ${match.stadium.city}, ${match.stadium.country}`,
  image: match.poster,
  background: match.poster,
  backgroundImage: match.poster,  // Initialize with the same poster image
  highlights: getWorkingHighlightLink(match.id) || match.highlights, // Use working links
  isPublished: true,
  ratings: [],
  reviews: [],
  engagementStats: {
    ratingCount: 0,
    reviewCount: 0,
    watchedCount: 0
  }
}));

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

  // Update match background image
  const updateMatchBackgroundImage = async (id: string, imageUrl: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setMatches((prev) =>
      prev.map((match) =>
        match.id === id ? { ...match, backgroundImage: imageUrl } : match
      )
    );
    return imageUrl;
  };

  // Update match highlight video
  const updateMatchHighlight = async (id: string, videoUrl: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setMatches((prev) =>
      prev.map((match) =>
        match.id === id ? { ...match, highlights: videoUrl } : match
      )
    );
    return videoUrl;
  };

  return {
    matches,
    getMatches,
    addMatch,
    updateMatch,
    deleteMatch,
    updateMatchBackgroundImage,
    updateMatchHighlight
  };
};
