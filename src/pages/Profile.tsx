import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { getTeamById } from '@/utils/teamData';
import { Settings, ListChecks, Star, MessageSquare } from 'lucide-react';
import MatchCard from '@/components/ui/MatchCard';
import { mockMatches } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import RegisterForm from '@/components/auth/RegisterForm';
import LoginForm from '@/components/auth/LoginForm';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

type TabType = 'logged' | 'reviews' | 'lists';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('logged');
  const [watchedMatches] = useLocalStorage<string[]>('footballtrackr-watched', []);
  
  // Get favorite team data if user has selected one
  const favoriteTeam = user?.favoriteTeamId ? getTeamById(user.favoriteTeamId) : undefined;
  
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
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Sign In</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Sign In</DialogTitle>
                  <DialogDescription>
                    Sign in to your FootballTrackr account
                  </DialogDescription>
                </DialogHeader>
                <LoginForm />
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>Create Account</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Account</DialogTitle>
                  <DialogDescription>
                    Join FootballTrackr to track your football watching history
                  </DialogDescription>
                </DialogHeader>
                <RegisterForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-transition max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-2 border-primary/20">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user.username} />
              ) : (
                <AvatarFallback className="bg-primary/5 text-lg">
                  {user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold mb-1">{user?.username}</h1>
              <p className="text-muted-foreground text-sm">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </p>
              {user?.bio && (
                <p className="mt-2 text-sm max-w-2xl">{user.bio}</p>
              )}
              
              {favoriteTeam && (
                <div className="mt-3 flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Favorite Team:</span>
                  <div className="flex items-center bg-card rounded-full px-3 py-1">
                    {favoriteTeam.logo && (
                      <img 
                        src={favoriteTeam.logo} 
                        alt={favoriteTeam.name} 
                        className="w-5 h-5 mr-2 object-contain" 
                      />
                    )}
                    <span className="text-sm">{favoriteTeam.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Edit Profile */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your profile information
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="profile" className="mt-4">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="team">Favorite Team</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="w-24 h-24">
                        {user?.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.username} />
                        ) : (
                          <AvatarFallback>
                            {user?.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Change Profile Picture
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="team" className="space-y-4 pt-4">
                  <p>Team editing coming soon...</p>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
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
                  <Button asChild>
                    <Link to="/">Explore Matches</Link>
                  </Button>
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
                <Button asChild>
                  <Link to={`/match/${userWatchedMatches[0].id}`}>Write Your First Review</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/">Explore Matches</Link>
                </Button>
              )}
            </div>
          )}
          
          {activeTab === 'lists' && (
            <div className="bg-card rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No lists created yet</h3>
              <p className="text-muted-foreground mb-4">
                Create lists to organize your favorite matches, memorable moments, or greatest comebacks.
              </p>
              <Button asChild>
                <Link to="/lists">Create Your First List</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
