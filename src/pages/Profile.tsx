
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
import { useReviews } from '@/hooks/useReviews';
import { getMatchById } from '@/utils/mockData';
import { useLists } from '@/hooks/useLists';
import CreateListModal from '@/components/ui/CreateListModal';
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
  const { getAllUserReviews } = useReviews();
  const { lists, openCreateListModal, isCreateListModalOpen, closeCreateListModal } = useLists();
  
  // Get favorite team data if user has selected one
  const favoriteTeam = user?.favoriteTeamId ? getTeamById(user.favoriteTeamId) : undefined;
  
  // Filter matches that the user has watched
  const userWatchedMatches = mockMatches.filter(match => 
    watchedMatches.includes(match.id)
  );
  
  // Get all reviews by the current user
  const userReviews = getAllUserReviews();

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
            <div className="text-3xl font-bold">{userReviews.length}</div>
            <div className="text-sm text-muted-foreground">Reviews</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-3xl font-bold">{lists.length}</div>
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
            <div>
              {userReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userReviews.map(review => {
                    const match = getMatchById(review.matchId);
                    return match ? (
                      <div key={review.id} className="bg-card rounded-lg overflow-hidden">
                        <div className="flex border-b">
                          <Link to={`/match/${match.id}`} className="flex-grow p-4">
                            <div className="flex items-center">
                              <div className="flex items-center gap-2 flex-1">
                                <div className="flex">
                                  <img 
                                    src={match.homeTeam.logo} 
                                    alt={match.homeTeam.name} 
                                    className="w-5 h-5 object-contain" 
                                  />
                                  <span className="mx-1 text-sm">vs</span>
                                  <img 
                                    src={match.awayTeam.logo} 
                                    alt={match.awayTeam.name} 
                                    className="w-5 h-5 object-contain" 
                                  />
                                </div>
                                <span className="font-medium text-sm line-clamp-1 pl-2">
                                  {match.homeTeam.name} vs {match.awayTeam.name}
                                </span>
                              </div>
                              <div className="flex items-center ml-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className={cn(
                                    "text-xs",
                                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                                  )}>
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </Link>
                        </div>
                        <div className="p-4">
                          <p className="text-sm mb-2">{review.comment}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link to={`/match/${match.id}`}>
                                View Match
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
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
            </div>
          )}
          
          {activeTab === 'lists' && (
            <div>
              {lists.length > 0 ? (
                <div>
                  <div className="flex justify-between mb-6">
                    <h2 className="text-lg font-medium">Your Lists</h2>
                    <Button size="sm" onClick={() => openCreateListModal()}>Create New List</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {lists.map(list => (
                      <Link 
                        key={list.id} 
                        to={`/lists`} 
                        className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle list click action here
                        }}
                      >
                        <h3 className="font-medium">{list.name}</h3>
                        {list.description && (
                          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                            {list.description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {list.matches.length} {list.matches.length === 1 ? 'match' : 'matches'}
                          </span>
                          {list.matches.length > 0 && (
                            <div className="flex -space-x-2 overflow-hidden">
                              {list.matches.slice(0, 3).map(matchId => {
                                const match = getMatchById(matchId);
                                return match ? (
                                  <div 
                                    key={matchId} 
                                    className="inline-block h-6 w-6 rounded-full border-2 border-background"
                                  >
                                    <img 
                                      src={match.homeTeam.logo} 
                                      alt={match.homeTeam.name} 
                                      className="h-full w-full object-contain" 
                                    />
                                  </div>
                                ) : null;
                              })}
                              {list.matches.length > 3 && (
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-secondary text-xs font-medium">
                                  +{list.matches.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No lists created yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create lists to organize your favorite matches, memorable moments, or greatest comebacks.
                  </p>
                  <Button onClick={() => openCreateListModal()}>Create Your First List</Button>
                </div>
              )}
              
              <CreateListModal isOpen={isCreateListModalOpen} onClose={closeCreateListModal} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
