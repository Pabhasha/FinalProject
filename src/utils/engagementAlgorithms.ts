
import { mockMatches, Match } from './mockData';

/**
 * Calculate a trending score based on recency and engagement
 * Higher scores mean more trending
 */
export const calculateTrendingScore = (match: Match): number => {
  const now = new Date();
  const matchDate = new Date(match.date);
  
  // Calculate days since the match (recency factor)
  const daysSinceMatch = Math.max(0, (now.getTime() - matchDate.getTime()) / (1000 * 3600 * 24));
  
  // Recency score decreases as match gets older (max is 100 for very recent matches)
  // Score decays exponentially over time
  const recencyScore = 100 * Math.exp(-0.1 * daysSinceMatch);
  
  // Engagement metrics
  const engagement = match.engagement || { ratingAverage: 0, ratings: 0, reviews: 0, reviewCount: 0, views: 0, watchCount: 0 };
  
  // Use either the direct property or its alternative
  const ratings = engagement.ratings || 0;
  const reviews = engagement.reviews || engagement.reviewCount || 0;
  const views = engagement.views || engagement.watchCount || 0;
  
  // Weight recent activity more heavily
  const engagementScore = (views * 1) + (ratings * 5) + (reviews * 10);
  
  // For recent matches, emphasize recency. For older matches, emphasize engagement
  return (recencyScore * 0.7) + (engagementScore * 0.3);
};

/**
 * Calculate a quality score based on ratings and reviews
 * Higher scores mean higher quality
 */
export const calculateQualityScore = (match: Match): number => {
  const engagement = match.engagement || { 
    ratingAverage: 0, 
    ratings: 0,
    reviewCount: 0,
    reviews: 0
  };
  
  // Base quality is the average rating (0-5 scale)
  const ratingScore = engagement.ratingAverage * 20; // Convert to 0-100 scale
  
  // Volume factor - more ratings and reviews increase confidence
  const ratings = engagement.ratings || 0;
  const reviews = engagement.reviews || engagement.reviewCount || 0;
  const volumeFactor = Math.min(1, (ratings + reviews) / 10); // Caps at 1.0 when 10+ combined ratings/reviews
  
  // Content factor - matches with more reviews get a boost
  const contentFactor = Math.min(0.2, reviews * 0.02); // Up to 0.2 bonus for 10+ reviews
  
  return ratingScore * volumeFactor + contentFactor * 100;
};

/**
 * Get trending matches based on recency and engagement metrics
 */
export const getTrendingMatches = (limit = 3): Match[] => {
  return [...mockMatches]
    .map(match => ({
      ...match,
      trendingScore: calculateTrendingScore(match)
    }))
    .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
    .slice(0, limit);
};

/**
 * Get top rated matches based on quality metrics
 */
export const getTopRatedMatches = (limit = 3): Match[] => {
  return [...mockMatches]
    .map(match => ({
      ...match,
      qualityScore: calculateQualityScore(match)
    }))
    .sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0))
    .slice(0, limit);
};
