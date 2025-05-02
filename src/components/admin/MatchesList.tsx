
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
import { Pencil, Trash2, Star, MessageSquare, Eye, EyeOff, ChevronDown, ChevronUp, Image, Video } from 'lucide-react';
import { useMatchAdmin } from '@/hooks/useMatchAdmin';
import EditMatchForm from './EditMatchForm';

interface MatchesListProps {
  category: string;
}

const MatchesList = ({ category }: MatchesListProps) => {
  const { getMatches, deleteMatch, updateMatchBackgroundImage, updateMatchHighlight } = useMatchAdmin();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBackgroundDialogOpen, setIsBackgroundDialogOpen] = useState(false);
  const [isHighlightDialogOpen, setIsHighlightDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [highlightVideoUrl, setHighlightVideoUrl] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingBackground, setIsUpdatingBackground] = useState(false);
  const [isUpdatingHighlight, setIsUpdatingHighlight] = useState(false);
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
  
  const handleBackgroundClick = (match: any) => {
    setSelectedMatch(match);
    setBackgroundImageUrl(match.backgroundImage || match.image || '');
    setIsBackgroundDialogOpen(true);
  };
  
  const handleHighlightClick = (match: any) => {
    setSelectedMatch(match);
    setHighlightVideoUrl(match.highlights || '');
    setIsHighlightDialogOpen(true);
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
  
  const confirmBackgroundUpdate = async () => {
    if (!selectedMatch || !backgroundImageUrl.trim()) return;
    
    setIsUpdatingBackground(true);
    try {
      await updateMatchBackgroundImage(selectedMatch.id, backgroundImageUrl);
      toast.success('Background image updated successfully');
      setIsBackgroundDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update background image');
      console.error(error);
    } finally {
      setIsUpdatingBackground(false);
    }
  };
  
  const confirmHighlightUpdate = async () => {
    if (!selectedMatch || !highlightVideoUrl.trim()) return;
    
    setIsUpdatingHighlight(true);
    try {
      await updateMatchHighlight(selectedMatch.id, highlightVideoUrl);
      toast.success('Highlight video updated successfully');
      setIsHighlightDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update highlight video');
      console.error(error);
    } finally {
      setIsUpdatingHighlight(false);
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
                <TableHead className="w-[180px]">Actions</TableHead>
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
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit match"
                        onClick={() => handleEditClick(match)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Set background image"
                        onClick={() => handleBackgroundClick(match)}
                      >
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Set highlight video"
                        onClick={() => handleHighlightClick(match)}
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete match"
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
      
      {/* Background Image Dialog */}
      <Dialog open={isBackgroundDialogOpen} onOpenChange={setIsBackgroundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Background Image</DialogTitle>
            <DialogDescription>
              Enter the URL of the image you want to use as the background for this match.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="backgroundUrl" className="text-sm font-medium">
                Background Image URL
              </label>
              <Input
                id="backgroundUrl"
                value={backgroundImageUrl}
                onChange={(e) => setBackgroundImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            {backgroundImageUrl && (
              <div className="mt-4 rounded-md overflow-hidden border border-border h-[150px]">
                <img 
                  src={backgroundImageUrl} 
                  alt="Background Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBackgroundDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmBackgroundUpdate}
              disabled={isUpdatingBackground || !backgroundImageUrl.trim()}
            >
              {isUpdatingBackground ? 'Updating...' : 'Update Background'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Highlight Video Dialog */}
      <Dialog open={isHighlightDialogOpen} onOpenChange={setIsHighlightDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Highlight Video</DialogTitle>
            <DialogDescription>
              Enter the YouTube URL for the match highlights video.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="highlightUrl" className="text-sm font-medium">
                YouTube Video URL
              </label>
              <Input
                id="highlightUrl"
                value={highlightVideoUrl}
                onChange={(e) => setHighlightVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            
            {highlightVideoUrl && highlightVideoUrl.includes('youtube.com') && (
              <div className="mt-4 rounded-md overflow-hidden border border-border aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${highlightVideoUrl.split('v=')[1]?.split('&')[0] || ''}`}
                  title="YouTube video preview"
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHighlightDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmHighlightUpdate}
              disabled={isUpdatingHighlight || !highlightVideoUrl.trim()}
            >
              {isUpdatingHighlight ? 'Updating...' : 'Update Highlights'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchesList;
