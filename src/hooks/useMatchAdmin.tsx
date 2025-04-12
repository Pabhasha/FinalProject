
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Import initial data to populate the admin dashboard
import { matches as initialMatches } from '@/utils/mockData';

export const useMatchAdmin = () => {
  const [matches, setMatches] = useLocalStorage<any[]>('footballtrackr-matches', initialMatches);

  // Get all matches, optionally filtered by category
  const getMatches = (category?: string) => {
    if (!category) return matches;
    return matches.filter((match) => match.category === category);
  };

  // Add a new match
  const addMatch = async (match: any) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setMatches((prev) => [match, ...prev]);
    return match;
  };

  // Update an existing match
  const updateMatch = async (updatedMatch: any) => {
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
