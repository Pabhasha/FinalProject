
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { mockMatches } from '@/utils/mockData';
import MatchCard from '@/components/ui/MatchCard';
import { motion } from 'framer-motion';

const Matches = () => {
  // Remove duplicates by checking for unique IDs
  const uniqueMatches = Array.from(
    new Map(mockMatches.map(match => [match.id, match])).values()
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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

  return (
    <MainLayout>
      <div className="page-transition">
        <h1 className="text-3xl font-bold mb-8">All Matches</h1>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {uniqueMatches.map((match, index) => (
            <motion.div key={match.id} variants={itemVariants}>
              <MatchCard match={match} size="md" variant={index % 5 === 0 ? 'premium' : 'default'} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Matches;
