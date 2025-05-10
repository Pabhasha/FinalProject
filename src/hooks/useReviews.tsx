import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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
  const [allReviews, setAllReviews] = useLocalStorage<Review[]>(
    "footballtrackr-reviews",
    []
  );
  const [userReviews, setUserReviews] = useLocalStorage<UserReviewsMap>(
    "footballtrackr-user-reviews",
    {}
  );
const user_id = localStorage.getItem("userId");


console.log(user_id, "user_iduser_iduser_iduser_id");

  // Get reviews for a specific match
  const getMatchReviews = (matchId: string) => {
    return allReviews.filter((review) => review.matchId === matchId);
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
    }

    // Check if user already reviewed this match
    if (hasUserReviewed(matchId)) {
      toast("Already reviewed", {
        description:
          "You've already reviewed this match. You can edit your review instead.",
      });
      return null;
    }

    const newReview: Review = {
      id: crypto.randomUUID(),
      matchId,
      userId: user_id,
      author: user.username,
      comment,
      rating,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };

    // Update both states
    setAllReviews([...allReviews, newReview]);
    setUserReviews({
      ...userReviews,
      [matchId]: newReview,
    });

    console.log(newReview, "|||||||||||||||||||||---newReview");

    // Use the standard toast API without variant property
    toast("Review posted", {
      description: "Your review has been posted successfully!",
    });

    return newReview;
  };

  // Get all reviews by the current user
  const getAllUserReviews = () => {
    if (!user) return [];
    return Object.values(userReviews);
  };

  // Admin functions

  // Get all reviews (admin only)
  const getAllReviews = () => {
    return allReviews;
  };

  // Delete a review (admin only)
  const deleteReview = async (reviewId: string) => {
    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const reviewToDelete = allReviews.find((review) => review.id === reviewId);

    if (reviewToDelete) {
      // Remove from all reviews
      setAllReviews(allReviews.filter((review) => review.id !== reviewId));

      // If it belongs to a user, remove from their reviews too
      if (reviewToDelete.userId) {
        setUserReviews((prev) => {
          const updated = { ...prev };
          if (updated[reviewToDelete.matchId]) {
            delete updated[reviewToDelete.matchId];
          }
          return updated;
        });
      }
    }

    return true;
  };

  return {
    getMatchReviews,
    hasUserReviewed,
    getUserReview,
    addReview,
    getAllUserReviews,
    // Admin functions
    getAllReviews,
    deleteReview,
  };
}
