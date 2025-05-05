
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Trash2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';

const ReviewsManagement = () => {
  const { getAllReviews, deleteReview } = useReviews();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<string | null>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Get all reviews
  const reviews = getAllReviews();

  // Sort reviews if needed
  const sortedReviews = [...reviews].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA = a[sortField] || '';
    let valueB = b[sortField] || '';
    
    if (sortField === 'rating') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    } else if (sortField === 'createdAt') {
      return sortDirection === 'asc' 
        ? new Date(valueA).getTime() - new Date(valueB).getTime()
        : new Date(valueB).getTime() - new Date(valueA).getTime();
    } else {
      return sortDirection === 'asc' 
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    }
  });

  const handleDeleteClick = (review: any) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedReview) return;
    
    setIsDeleting(true);
    try {
      await deleteReview(selectedReview.id);
      toast.success('Review deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete review');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (sortedReviews.length === 0) {
    return (
      <div className="text-center py-12 bg-card border border-border/40 rounded-lg">
        <p className="text-muted-foreground">No reviews found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('author')}
                >
                  Author {renderSortIcon('author')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('rating')}
                >
                  Rating {renderSortIcon('rating')}
                </TableHead>
                <TableHead>
                  Comment
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Date {renderSortIcon('createdAt')}
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.author}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      {review.rating}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">{review.comment}</div>
                  </TableCell>
                  <TableCell>{formatDate(review.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete review"
                      onClick={() => handleDeleteClick(review)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
            <DialogTitle>Delete Review</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this review by {selectedReview?.author}? This action cannot be undone.
          </p>
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
    </>
  );
};

export default ReviewsManagement;
