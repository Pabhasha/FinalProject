
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface Review {
  id: string;
  matchId: string;
  userId: string;
  author: string;
  comment: string;
  rating: number;
  createdAt: string;
  likes: number;
  dislikes: number;
}

interface UserReviewsMap {
  [matchId: string]: Review;
}

export function useReviews() {
  const { user } = useAuth();
  const [allReviews, setAllReviews] = useLocalStorage<Review[]>('footballtrackr-reviews', []);
  const [userReviews, setUserReviews] = useLocalStorage<UserReviewsMap>('footballtrackr-user-reviews', {});
  
  // Get reviews for a specific match
  const getMatchReviews = (matchId: string) => {
    return allReviews.filter(review => review.matchId === matchId);
  };

  // Check if user has already reviewed this match
  const hasUserReviewed = (matchId: string) => {
    if (!user) return false;
    return !!userReviews[matchId];
  };

  // Get user's review for a specific match
  const getUserReview = (matchId: string) => {
    if (!user) return null;
    return userReviews[matchId] || null;
  };

  // Add a new review
  const addReview = (matchId: string, comment: string, rating: number) => {
    if (!user) {
      toast("Sign in required", {
        description: "Please sign in to leave a review.",
      });
      return null;
    }

    // Check if user already reviewed this match
    if (hasUserReviewed(matchId)) {
      toast("Already reviewed", {
        description: "You've already reviewed this match. You can edit your review instead.",
      });
      return null;
    }

    const newReview: Review = {
      id: crypto.randomUUID(),
      matchId,
      userId: user.id,
      author: user.username,
      comment,
      rating,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };

    // Update both states
    setAllReviews([...allReviews, newReview]);
    setUserReviews({
      ...userReviews,
      [matchId]: newReview
    });

    toast("Review posted", {
      description: "Your review has been posted successfully!",
      variant: "success"
    });
    
    return newReview;
  };

  // Get all reviews by the current user
  const getAllUserReviews = () => {
    if (!user) return [];
    return Object.values(userReviews);
  };

  return {
    getMatchReviews,
    hasUserReviewed,
    getUserReview,
    addReview,
    getAllUserReviews
  };
}
