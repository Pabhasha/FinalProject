
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useMatchAdmin } from '@/hooks/useMatchAdmin';
import { MatchData } from '@/hooks/useMatchAdmin';

const matchSchema = z.object({
  home: z.string().min(1, 'Home team is required'),
  away: z.string().min(1, 'Away team is required'),
  competition: z.string().min(1, 'Competition is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  result: z.string().min(1, 'Result is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  highlights: z.string().optional(),
  isPublished: z.boolean().default(true),
  image: z.any().optional(),
  background: z.any().optional(),
});

type MatchFormValues = z.infer<typeof matchSchema>;

interface EditMatchFormProps {
  match: MatchData;
  onClose: () => void;
}

const EditMatchForm = ({ match, onClose }: EditMatchFormProps) => {
  const { updateMatch } = useMatchAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(match.image || null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(match.background || match.image || null);

  // Extract home and away from title
  const titleParts = match.title.split(' vs ');
  const initialHome = titleParts[0] || '';
  const initialAway = titleParts[1] || '';

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      home: initialHome,
      away: initialAway,
      competition: match.competition || '',
      category: match.category || 'el-clasico',
      date: match.date || '',
      result: match.result || '',
      description: match.description || '',
      location: match.location || '',
      highlights: match.highlights || '',
      isPublished: match.isPublished !== false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('image', file);
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('background', file);
    }
  };

  const onSubmit = async (values: MatchFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, we would upload any new image to a server
      // For this demo, we'll just use the image preview as the "URL"
      const imageUrl = imagePreview || match.image || '/placeholder.svg';
      const backgroundUrl = backgroundPreview || match.background || imageUrl;
      
      await updateMatch({
        ...match,
        title: `${values.home} vs ${values.away}`,
        competition: values.competition,
        category: values.category,
        date: values.date,
        result: values.result,
        description: values.description,
        location: values.location,
        image: imageUrl,
        background: backgroundUrl,
        highlights: values.highlights || undefined,
        isPublished: values.isPublished,
      });
      
      toast.success('Match updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update match');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="home"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Team</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="away"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Away Team</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="competition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Competition</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="el-clasico">El Clásico</option>
                    <option value="world-cup">World Cup</option>
                    <option value="premier-league">Premier League</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="result"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Result</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stadium/Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match Description</FormLabel>
              <FormControl>
                <Textarea 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highlights"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube Highlights URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  type="url"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <FormLabel>Match Poster Image</FormLabel>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="cursor-pointer"
            />
            
            {imagePreview && (
              <div className="mt-4 border rounded-md overflow-hidden w-full max-w-md">
                <img 
                  src={imagePreview} 
                  alt="Match poster preview" 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel>Match Background Image</FormLabel>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleBackgroundChange} 
              className="cursor-pointer"
            />
            
            {backgroundPreview && (
              <div className="mt-4 border rounded-md overflow-hidden w-full max-w-md">
                <img 
                  src={backgroundPreview} 
                  alt="Match background preview" 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Publish Match
                </FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            type="button"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Match'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditMatchForm;
