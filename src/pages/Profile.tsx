
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/context/AuthContext';
import { Settings, ListChecks, Star, MessageSquare } from 'lucide-react';
import MatchCard from '@/components/ui/MatchCard';
import { mockMatches } from '@/utils/mockData';
import { cn } from '@/lib/utils';

type TabType = 'logged' | 'reviews' | 'lists';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('logged');
  const [watchedMatches] = useLocalStorage<string[]>('footballtrackr-watched', []);
  
  // Filter matches that the user has watched
  const userWatchedMatches = mockMatches.filter(match => 
    watchedMatches.includes(match.id)
  );

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-2xl font-bold mb-4">You need to sign in</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Please sign in or create an account to view your profile and track your watched matches.
          </p>
          <div className="flex space-x-4">
            <a 
              href="/login" 
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              Sign In
            </a>
            <a 
              href="/register" 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-transition">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Banner Image */}
          <div className="h-48 rounded-xl overflow-hidden bg-gradient-to-r from-primary/30 to-primary/10">
            {user?.banner && (
              <img 
                src={user.banner} 
                alt="Profile Banner" 
                className="w-full h-full object-cover" 
              />
            )}
          </div>
          
          {/* Profile Info */}
          <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-12 px-4 md:px-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background overflow-hidden bg-card">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className="mt-4 md:mt-0 md:ml-6 md:mb-3">
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <p className="text-muted-foreground">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </p>
              {user?.bio && (
                <p className="mt-2 text-sm max-w-2xl">{user.bio}</p>
              )}
            </div>
            
            {/* Edit Profile */}
            <button className="mt-4 md:mt-0 md:ml-auto md:mb-3 flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-3xl font-bold">{userWatchedMatches.length}</div>
            <div className="text-sm text-muted-foreground">Matches Logged</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-3xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Reviews</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-3xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Lists Created</div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('logged')}
              className={cn(
                "py-4 px-1 font-medium text-sm flex items-center border-b-2 -mb-px",
                activeTab === 'logged' 
                  ? "border-primary text-foreground" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Star className="w-4 h-4 mr-2" />
              Logged Matches
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={cn(
                "py-4 px-1 font-medium text-sm flex items-center border-b-2 -mb-px",
                activeTab === 'reviews' 
                  ? "border-primary text-foreground" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Reviews
            </button>
            <button 
              onClick={() => setActiveTab('lists')}
              className={cn(
                "py-4 px-1 font-medium text-sm flex items-center border-b-2 -mb-px",
                activeTab === 'lists' 
                  ? "border-primary text-foreground" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <ListChecks className="w-4 h-4 mr-2" />
              Lists
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div>
          {activeTab === 'logged' && (
            <div>
              {userWatchedMatches.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {userWatchedMatches.map(match => (
                    <MatchCard key={match.id} match={match} size="sm" />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No matches logged yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your football watching history by logging matches you've watched.
                  </p>
                  <a 
                    href="/matches" 
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Explore Matches
                  </a>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="bg-card rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-4">
                Share your thoughts on matches you've watched by writing reviews.
              </p>
              {userWatchedMatches.length > 0 ? (
                <a 
                  href={`/match/${userWatchedMatches[0].id}`} 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Write Your First Review
                </a>
              ) : (
                <a 
                  href="/matches" 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Explore Matches
                </a>
              )}
            </div>
          )}
          
          {activeTab === 'lists' && (
            <div className="bg-card rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No lists created yet</h3>
              <p className="text-muted-foreground mb-4">
                Create lists to organize your favorite matches, memorable moments, or greatest comebacks.
              </p>
              <a 
                href="/lists" 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Create Your First List
              </a>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
