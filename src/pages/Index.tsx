
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { categories } from '@/utils/categoryData';
import CategoryCarousel from '@/components/ui/CategoryCarousel';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  return (
    <MainLayout>
      <div className="page-transition">
        <section className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Discover Football</h1>
          <p className="text-muted-foreground">
            Track, rate, and review your favorite football matches. Create lists of the best matches you've watched.
          </p>
        </section>
        
        <ScrollArea className="w-full">
          <div className="space-y-10 pb-8">
            {categories.map((category) => (
              <CategoryCarousel 
                key={category.id}
                title={category.title}
                matches={category.matches}
                categorySlug={category.slug}
                description={category.description}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  );
};

export default Index;
