
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMatchAdmin } from '@/hooks/useMatchAdmin';
import { useReviews } from '@/hooks/useReviews';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const AdminStats = () => {
  const { matches, getMatches } = useMatchAdmin();
  const { getAllReviews } = useReviews();
  
  const allMatches = getMatches();
  const allReviews = getAllReviews();
  
  // Simple stats
  const totalMatches = allMatches.length;
  const publishedMatches = allMatches.filter(match => match.isPublished).length;
  const draftMatches = totalMatches - publishedMatches;
  const totalReviews = allReviews.length;
  
  // Category stats
  const categoryData = allMatches.reduce((acc, match) => {
    const category = match.category || 'uncategorized';
    if (!acc[category]) acc[category] = 0;
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryChartData = Object.entries(categoryData).map(([name, count]) => ({
    name,
    count,
  }));
  
  // Reviews per match data
  const reviewsPerMatch = allMatches.map(match => {
    const matchReviews = allReviews.filter(review => review.matchId === match.id);
    return {
      name: match.title,
      reviews: matchReviews.length,
    };
  }).sort((a, b) => b.reviews - a.reviews).slice(0, 5); // Top 5 matches by review count
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMatches}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{publishedMatches}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{draftMatches}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalReviews}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Matches by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top 5 Matches by Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reviewsPerMatch}>
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reviews" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;
