
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check } from 'lucide-react';
import { List, useLists } from '@/hooks/useLists';
import { cn } from '@/lib/utils';

interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string | null;
}

const ListModal = ({ isOpen, onClose, matchId }: ListModalProps) => {
  const { lists, createList, addMatchToList, isMatchInList } = useLists();
  const [newListName, setNewListName] = useState('');
  const [creatingList, setCreatingList] = useState(false);

  const handleAddToList = (listId: string) => {
    if (matchId) {
      addMatchToList(listId, matchId);
    }
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName.trim());
      setNewListName('');
      setCreatingList(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to List</DialogTitle>
          <DialogDescription>
            Select a list or create a new one to add this match.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 max-h-[300px] overflow-y-auto">
          {lists.length > 0 ? (
            <div className="space-y-2">
              {lists.map((list) => (
                <div 
                  key={list.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-md cursor-pointer",
                    isMatchInList(list.id, matchId || '') 
                      ? "bg-primary/10 border border-primary/20" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => handleAddToList(list.id)}
                >
                  <div>
                    <div className="font-medium">{list.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {list.matches.length} {list.matches.length === 1 ? 'match' : 'matches'}
                    </div>
                  </div>
                  
                  {isMatchInList(list.id, matchId || '') && (
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No lists yet. Create your first list below.
            </div>
          )}
        </div>
        
        {creatingList ? (
          <div className="flex space-x-2">
            <Input
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              autoFocus
            />
            <Button onClick={handleCreateList} disabled={!newListName.trim()}>
              Create
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setCreatingList(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Create New List
          </Button>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ListModal;
