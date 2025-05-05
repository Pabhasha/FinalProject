
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useLists, List } from '@/hooks/useLists';
import { ListPlus, Search, Trash2, Plus, LucideEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getMatchById, Match } from '@/utils/mockData';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import CreateListModal from '@/components/ui/CreateListModal';

const Lists = () => {
  const { isAuthenticated } = useAuth();
  const { lists, deleteList, openCreateListModal, isCreateListModalOpen, closeCreateListModal } = useLists();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [isViewListModalOpen, setIsViewListModalOpen] = useState(false);
  
  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleOpenListDetails = (list: List) => {
    setSelectedList(list);
    setIsViewListModalOpen(true);
  };
  
  const handleDeleteList = (listId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this list?');
    if (confirmed) {
      deleteList(listId);
      toast("List deleted successfully");
    }
  };

  // Get match data for the selected list
  const selectedListMatches = selectedList?.matches.map(id => getMatchById(id)).filter(Boolean) as Match[];

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Sign in to view your lists</h1>
          <p className="text-muted-foreground mb-6">
            Create an account or sign in to create and manage your lists.
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="page-transition max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Lists</h1>
          <Button onClick={() => openCreateListModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Create List
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {filteredLists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredLists.map(list => (
              <div 
                key={list.id}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-all"
                onClick={() => handleOpenListDetails(list)}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-medium">{list.name}</h2>
                  <Button variant="ghost" size="icon" onClick={(e) => handleDeleteList(list.id, e)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                
                {list.description && (
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{list.description}</p>
                )}
                
                <div className="mt-3 flex items-center text-sm text-muted-foreground">
                  <span>{list.matches.length} {list.matches.length === 1 ? 'match' : 'matches'}</span>
                  <span className="mx-2">•</span>
                  <span>Created {new Date(list.createdAt).toLocaleDateString()}</span>
                </div>
                
                {list.matches.length > 0 && (
                  <div className="mt-3 flex -space-x-2 overflow-hidden">
                    {list.matches.slice(0, 5).map(matchId => {
                      const match = getMatchById(matchId);
                      return match ? (
                        <div 
                          key={matchId} 
                          className="inline-block h-8 w-8 rounded-full border-2 border-background overflow-hidden"
                        >
                          <img 
                            src={match.homeTeam.logo} 
                            alt={match.homeTeam.name} 
                            className="h-full w-full object-contain" 
                          />
                        </div>
                      ) : null;
                    })}
                    {list.matches.length > 5 && (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-xs font-medium">
                        +{list.matches.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <ListPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No lists found</h2>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'No lists match your search criteria.' : 'Create your first list to organize your favorite matches.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => openCreateListModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Create List
              </Button>
            )}
          </div>
        )}
        
        {/* View List Modal */}
        {selectedList && (
          <Dialog open={isViewListModalOpen} onOpenChange={setIsViewListModalOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedList.name}</DialogTitle>
                {selectedList.description && (
                  <p className="text-muted-foreground mt-2">{selectedList.description}</p>
                )}
              </DialogHeader>
              
              <div className="py-4">
                {selectedListMatches && selectedListMatches.length > 0 ? (
                  <div className="space-y-3">
                    {selectedListMatches.map(match => (
                      <Link 
                        key={match.id} 
                        to={`/match/${match.id}`}
                        className="flex items-center p-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center flex-grow">
                          <div className="flex items-center space-x-2 mr-3">
                            <img 
                              src={match.homeTeam.logo} 
                              alt={match.homeTeam.name} 
                              className="w-6 h-6 object-contain" 
                            />
                            <span className="text-muted-foreground">vs</span>
                            <img 
                              src={match.awayTeam.logo} 
                              alt={match.awayTeam.name} 
                              className="w-6 h-6 object-contain" 
                            />
                          </div>
                          <div>
                            <div className="font-medium">{match.homeTeam.name} vs {match.awayTeam.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {match.competition.name} • {new Date(match.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No matches in this list yet.</p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewListModalOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Create List Modal */}
        <CreateListModal isOpen={isCreateListModalOpen} onClose={closeCreateListModal} />
      </div>
    </MainLayout>
  );
};

export default Lists;
