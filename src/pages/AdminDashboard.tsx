
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminHeader from '@/components/admin/AdminHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminStats from '@/components/admin/AdminStats';
import MatchesList from '@/components/admin/MatchesList';
import ReviewsManagement from '@/components/admin/ReviewsManagement';
import AddMatchForm from '@/components/admin/AddMatchForm';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AdminLayout title="Dashboard" subtitle="Manage your football tracker application">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="add-match">Add Match</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <AdminStats />
        </TabsContent>
        
        <TabsContent value="matches" className="space-y-4">
          <MatchesList category="all" />
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <ReviewsManagement />
        </TabsContent>
        
        <TabsContent value="add-match" className="space-y-4">
          <AddMatchForm />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
