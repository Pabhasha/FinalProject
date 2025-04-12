
import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { useMatchAdmin } from '@/hooks/useMatchAdmin';
import EditMatchForm from './EditMatchForm';

interface MatchesListProps {
  category: string;
}

const MatchesList = ({ category }: MatchesListProps) => {
  const { getMatches, deleteMatch } = useMatchAdmin();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get matches filtered by category if needed
  const matches = getMatches(category === 'all' ? undefined : category);

  const handleEditClick = (match: any) => {
    setSelectedMatch(match);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (match: any) => {
    setSelectedMatch(match);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMatch) return;
    
    setIsDeleting(true);
    try {
      await deleteMatch(selectedMatch.id);
      toast.success('Match deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete match');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-card border border-border/40 rounded-lg">
        <p className="text-muted-foreground">No matches found in this category.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match</TableHead>
              <TableHead>Competition</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                      <img 
                        src={match.image || '/placeholder.svg'} 
                        alt={match.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      {match.title}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{match.competition}</TableCell>
                <TableCell>{match.date}</TableCell>
                <TableCell>{match.result}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(match)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(match)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Match</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this match? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Match Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Match</DialogTitle>
          </DialogHeader>
          {selectedMatch && (
            <EditMatchForm 
              match={selectedMatch}
              onClose={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchesList;
