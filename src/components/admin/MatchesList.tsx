
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Pencil, Trash2, Star, MessageSquare, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showDrafts, setShowDrafts] = useState(true);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Get matches filtered by category if needed
  let matches = getMatches(category === 'all' ? undefined : category, showDrafts);

  // Sort matches if needed
  if (sortField) {
    matches = [...matches].sort((a, b) => {
      let valueA: any, valueB: any;
      
      // Handle nested fields like engagementStats.ratingCount
      if (sortField.includes('.')) {
        const [parent, child] = sortField.split('.');
        valueA = a[parent]?.[child] || 0;
        valueB = b[parent]?.[child] || 0;
      } else {
        valueA = a[sortField] || '';
        valueB = b[sortField] || '';
      }
      
      // Compare values based on type
      if (typeof valueA === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        return sortDirection === 'asc' 
          ? valueA - valueB 
          : valueB - valueA;
      }
    });
  }

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

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1 inline" /> : 
      <ChevronDown className="h-4 w-4 ml-1 inline" />;
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
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setShowDrafts(!showDrafts)}
            className="flex items-center gap-2"
          >
            {showDrafts ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Hide Drafts</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Show Drafts</span>
              </>
            )}
          </Button>
          
          <Input
            placeholder="Search matches..."
            className="max-w-xs"
            // Search functionality could be implemented here
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  Match {renderSortIcon('title')}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('competition')}
                >
                  Competition {renderSortIcon('competition')}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  Date {renderSortIcon('date')}
                </TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Engagement</TableHead>
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
                        {match.isPublished === false && (
                          <Badge variant="outline" className="ml-2">Draft</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{match.competition}</TableCell>
                  <TableCell>{match.date}</TableCell>
                  <TableCell>{match.result}</TableCell>
                  <TableCell>
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1" title="Ratings">
                        <Star className="h-3.5 w-3.5" />
                        {match.engagementStats?.ratingCount || 0}
                      </span>
                      <span className="flex items-center gap-1" title="Reviews">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {match.engagementStats?.reviewCount || 0}
                      </span>
                      <span className="flex items-center gap-1" title="Views">
                        <Eye className="h-3.5 w-3.5" />
                        {match.engagementStats?.watchedCount || 0}
                      </span>
                    </div>
                  </TableCell>
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
