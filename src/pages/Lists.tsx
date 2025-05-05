
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Plus } from 'lucide-react';

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

        {/* Empty state with create list option */}
        <div className="bg-card/50 border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Create Your First List</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start compiling your favorite matches, greatest comebacks, or most memorable moments.
          </p>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Create a List
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Lists;
