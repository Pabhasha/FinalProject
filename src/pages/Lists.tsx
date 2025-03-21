
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { mockLists, mockMatches } from '@/utils/mockData';
import { Pencil, Heart, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Lists = () => {
  return (
    <MainLayout>
      <div className="page-transition">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Lists</h1>
          <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockLists.map(list => {
            // Get the first match in the list to use as a cover image if none is provided
            const firstMatchId = list.matches[0];
            const firstMatch = mockMatches.find(m => m.id === firstMatchId);
            const coverImage = list.coverImage || firstMatch?.poster;

            return (
              <Link 
                to={`/list/${list.id}`} 
                key={list.id}
                className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-gray-800">
                  {coverImage && (
                    <img 
                      src={coverImage} 
                      alt={list.title} 
                      className="w-full h-full object-cover opacity-80" 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  
                  {/* Match Count Badge */}
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
                    {list.matches.length} {list.matches.length === 1 ? 'Match' : 'Matches'}
                  </div>
                </div>
                
                {/* List Info */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2 text-overflow-ellipsis">{list.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {list.description}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>Created by user</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{list.likes}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          
          {/* Your Lists */}
          <div className="bg-card/50 border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Pencil className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Create Your Own List</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Compile your favorite matches, greatest comebacks, or most memorable moments.
            </p>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Create a List
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Lists;
