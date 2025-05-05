
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { List, useLists } from '@/hooks/useLists';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getMatchById, Match } from '@/utils/mockData';
import { toast } from 'sonner';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateListModal = ({ isOpen, onClose }: CreateListModalProps) => {
  const { createList } = useLists();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [watchedMatches] = useLocalStorage<string[]>('footballtrackr-watched', []);
  const [selectedMatches, setSelectedMatches] = useState<string[]>([]);

  // Get the actual match objects for display
  const userWatchedMatches = watchedMatches
    .map(id => getMatchById(id))
    .filter((match): match is Match => match !== undefined);

  const handleCreateList = () => {
    if (name.trim()) {
      createList(name.trim(), description.trim() || undefined, selectedMatches);
      toast("List created successfully!");
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedMatches([]);
    onClose();
  };

  const handleMatchToggle = (matchId: string) => {
    setSelectedMatches(current => 
      current.includes(matchId) 
        ? current.filter(id => id !== matchId) 
        : [...current, matchId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
          <DialogDescription>
            Create a new list to organize your matches
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="list-name">List Name</Label>
            <Input
              id="list-name"
              placeholder="My Favorite Matches"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="list-description">Description (Optional)</Label>
            <Textarea
              id="list-description"
              placeholder="A collection of my favorite matches..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          {userWatchedMatches.length > 0 && (
            <div className="space-y-2">
              <Label>Add matches from your history</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-2">
                {userWatchedMatches.map(match => (
                  <div key={match.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`match-${match.id}`}
                      checked={selectedMatches.includes(match.id)}
                      onCheckedChange={() => handleMatchToggle(match.id)}
                    />
                    <Label 
                      htmlFor={`match-${match.id}`}
                      className="text-sm flex items-center cursor-pointer w-full"
                    >
                      <div className="flex items-center space-x-1 mr-2">
                        <img 
                          src={match.homeTeam.logo} 
                          alt={match.homeTeam.name} 
                          className="w-4 h-4 object-contain" 
                        />
                        <span className="mx-0.5 text-xs">vs</span>
                        <img 
                          src={match.awayTeam.logo} 
                          alt={match.awayTeam.name} 
                          className="w-4 h-4 object-contain" 
                        />
                      </div>
                      <span className="truncate">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleCreateList}
            disabled={!name.trim()}
          >
            Create List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListModal;
