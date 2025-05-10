
import React, { Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Skeleton } from "@/components/ui/skeleton";

const AdminLogin = React.lazy(() => import('@/pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'));

// Enhanced loading fallback with skeleton UI
const AdminLoader = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="space-y-8">
      <Skeleton className="h-12 w-[250px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-[150px] rounded-lg" />
        <Skeleton className="h-[150px] rounded-lg" />
        <Skeleton className="h-[150px] rounded-lg" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  </div>
);

export const AdminRoutes = () => {
  const { isAuthenticated } = useAdmin();
  
  return (
    <>
      <Route 
        path="/admin-login" 
        element={
          <Suspense fallback={<AdminLoader />}>
            {isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />}
          </Suspense>
        } 
      />
      <Route 
        path="/admin/dashboard" 
        element={
          <Suspense fallback={<AdminLoader />}>
            {isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin-login" replace />}
          </Suspense>
        } 
      />
      <Route 
        path="/admin/*" 
        element={
          <Navigate to="/admin/dashboard" replace />
        }
      />
    </>
  );
};
