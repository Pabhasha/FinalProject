
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { categories } from '@/utils/categoryData';
import CategoryCarousel from '@/components/ui/CategoryCarousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MatchCard from '@/components/ui/MatchCard';
import { mockMatches } from '@/utils/mockData';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Football classics - featured legendary matches
  const classicMatches = mockMatches
    .filter(match => match.rating >= 4.5)
    .slice(0, 10);
  
  return (
    <MainLayout>
      <div className="page-transition">
        <section className="mb-8">
          <div className="flex items-end justify-between">
            <div className="max-w-2xl">
              {isLoading ? (
                <>
                  <Skeleton className="h-12 w-[280px] mb-4" />
                  <Skeleton className="h-5 w-[450px] mb-1" />
                  <Skeleton className="h-5 w-[380px]" />
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent mb-2">
                    Discover Football Classics
                  </h1>
                  
                  <p className="text-muted-foreground md:text-lg">
                    Track, rate, and review your favorite football matches. Create lists of the best matches you've watched and share with friends.
                  </p>
                </motion.div>
              )}
            </div>

            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Link to="/matches">
                  <Button variant="outline" className="group">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          {!isLoading && (
            <motion.div 
              className="flex gap-2 mt-6 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {['Champions League', 'Premier League', 'La Liga', 'World Cup'].map((tag) => (
                <Link 
                  key={tag} 
                  to={`/category/${tag.toLowerCase().replace(' ', '-')}`}
                  className="px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </motion.div>
          )}
        </section>
        
        {/* Discover Football Classics - Horizontal Scrolling Section */}
        {!isLoading && (
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative">
              <div className="overflow-x-auto pb-6 -mx-4 px-4 scroll-smooth scrollbar-none">
                <div className="flex gap-4 min-w-max">
                  {classicMatches.map((match, index) => (
                    <div 
                      key={match.id} 
                      className="w-72 flex-shrink-0 transition-all"
                    >
                      <MatchCard 
                        match={match} 
                        size="lg" 
                        variant={index % 3 === 0 ? 'premium' : 'default'}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
            </div>
          </motion.section>
        )}
        
        <ScrollArea className="w-full">
          <div className="space-y-10 pb-8">
            {isLoading ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[...Array(3)].map((_, index) => (
                  <motion.div key={`skeleton-${index}`} className="mb-8" variants={itemVariants}>
                    <Skeleton className="h-8 w-[200px] mb-6" />
                    <div className="flex gap-4 overflow-hidden">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-60 w-40 flex-shrink-0 rounded-lg" />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-14"
              >
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    className="relative group"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Link to={`/category/${category.slug}`} className="group/title flex items-center">
                        <h2 className="text-2xl font-bold hover:text-primary transition-colors">{category.title}</h2>
                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-primary" />
                      </Link>
                    </div>
                    
                    {category.description && (
                      <p className="text-muted-foreground mb-4 text-sm max-w-2xl">
                        {category.description}
                      </p>
                    )}
                    
                    <CategoryCarousel 
                      title={category.title}
                      matches={category.matches}
                      categorySlug={category.slug}
                      description={category.description}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  );
};

export default Index;
