
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { categories } from '@/utils/categoryData';
import CategoryCarousel from '@/components/ui/CategoryCarousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <MainLayout>
      <div className="page-transition">
        <section className="space-y-4 mb-8">
          <div className="flex items-end justify-between">
            <div>
              {isLoading ? (
                <Skeleton className="h-10 w-[250px] mb-4" />
              ) : (
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                  Discover Football
                </h1>
              )}
              
              {isLoading ? (
                <Skeleton className="h-5 w-[450px]" />
              ) : (
                <p className="text-muted-foreground">
                  Track, rate, and review your favorite football matches. Create lists of the best matches you've watched.
                </p>
              )}
            </div>
          </div>
        </section>
        
        <ScrollArea className="w-full">
          <div className="space-y-10 pb-8">
            {categories.map((category, index) => (
              isLoading ? (
                <div key={`skeleton-${index}`} className="mb-8">
                  <Skeleton className="h-8 w-[200px] mb-6" />
                  <div className="flex gap-4 overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-60 w-40 flex-shrink-0 rounded-lg" />
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CategoryCarousel 
                    title={category.title}
                    matches={category.matches}
                    categorySlug={category.slug}
                    description={category.description}
                  />
                </motion.div>
              )
            ))}
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  );
};

export default Index;
