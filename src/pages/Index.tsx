
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { categories } from '@/utils/categoryData';
import CategoryCarousel from '@/components/ui/CategoryCarousel';

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
        
        {categories.map((category) => (
          <CategoryCarousel 
            key={category.id}
            title={category.title}
            matches={category.matches}
            categorySlug={category.slug}
          />
        ))}
      </div>
    </MainLayout>
  );
};

export default Index;
