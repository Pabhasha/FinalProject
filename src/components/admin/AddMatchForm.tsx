
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
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useMatchAdmin } from '@/hooks/useMatchAdmin';

const matchSchema = z.object({
  home: z.string().min(1, 'Home team is required'),
  away: z.string().min(1, 'Away team is required'),
  competition: z.string().min(1, 'Competition is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  result: z.string().min(1, 'Result is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  image: z.any().optional(),
});

type MatchFormValues = z.infer<typeof matchSchema>;

const AddMatchForm = () => {
  const { addMatch } = useMatchAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      home: '',
      away: '',
      competition: '',
      category: 'el-clasico',
      date: '',
      result: '',
      description: '',
      location: '',
      image: undefined,
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

  const onSubmit = async (values: MatchFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, we would upload the image to a server and get back a URL
      // For this demo, we'll just use the image preview as the "URL"
      const imageUrl = imagePreview || '/placeholder.svg';
      
      await addMatch({
        id: crypto.randomUUID(),
        slug: `${values.home.toLowerCase()}-vs-${values.away.toLowerCase()}-${Date.now()}`,
        title: `${values.home} vs ${values.away}`,
        competition: values.competition,
        category: values.category,
        date: values.date,
        result: values.result,
        description: values.description,
        location: values.location,
        image: imageUrl,
        ratings: [],
        reviews: [],
      });
      
      toast.success('Match added successfully');
      form.reset();
      setImagePreview(null);
    } catch (error) {
      toast.error('Failed to add match');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
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
                      <Input placeholder="FC Barcelona" {...field} />
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
                      <Input placeholder="Real Madrid" {...field} />
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
                      <Input placeholder="La Liga" {...field} />
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
                      <Input placeholder="2-0" {...field} />
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
                      <Input placeholder="Camp Nou, Barcelona" {...field} />
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
                      placeholder="Provide a brief description of the match..."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <Button 
              type="submit" 
              className="w-full md:w-auto" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Match...' : 'Add Match'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddMatchForm;
