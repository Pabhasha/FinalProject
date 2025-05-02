
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import AdminLayout from '@/components/admin/AdminLayout';
import AddMatchForm from '@/components/admin/AddMatchForm';
import MatchesList from '@/components/admin/MatchesList';
import AdminHeader from '@/components/admin/AdminHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard = () => {
  const { isAuthenticated } = useAdmin();
  const [activeTab, setActiveTab] = useState<string>('manage');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Protect route - redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <AdminLayout>
      <AdminHeader title="FootballTrackr Admin" />
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add Match</TabsTrigger>
          <TabsTrigger value="manage">Manage Matches</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="px-1">
          <AddMatchForm />
        </TabsContent>
        
        <TabsContent value="manage" className="px-1">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 rounded-md ${activeCategory === 'all' ? 
                  'bg-primary text-primary-foreground' : 
                  'bg-secondary text-secondary-foreground'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveCategory('el-clasico')}
                className={`px-3 py-1 rounded-md ${activeCategory === 'el-clasico' ? 
                  'bg-primary text-primary-foreground' : 
                  'bg-secondary text-secondary-foreground'}`}
              >
                El Clásico
              </button>
              <button 
                onClick={() => setActiveCategory('world-cup')}
                className={`px-3 py-1 rounded-md ${activeCategory === 'world-cup' ? 
                  'bg-primary text-primary-foreground' : 
                  'bg-secondary text-secondary-foreground'}`}
              >
                World Cup
              </button>
              <button 
                onClick={() => setActiveCategory('premier-league')}
                className={`px-3 py-1 rounded-md ${activeCategory === 'premier-league' ? 
                  'bg-primary text-primary-foreground' : 
                  'bg-secondary text-secondary-foreground'}`}
              >
                Premier League
              </button>
            </div>
          </div>
          <MatchesList category={activeCategory} />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
