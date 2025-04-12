
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('footballtrackr-favorites', []);
  
  const isFavorite = (matchId: string): boolean => {
    return favorites.includes(matchId);
  };

  const toggleFavorite = (matchId: string): boolean => {
    let isNowFavorite = false;
    
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(matchId)) {
        return prevFavorites.filter(id => id !== matchId);
      } else {
        isNowFavorite = true;
        return [...prevFavorites, matchId];
      }
    });
    
    return isNowFavorite;
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite
  };
};
