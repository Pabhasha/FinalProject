
import React, { Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";

const Auth = React.lazy(() => import('@/pages/Auth'));
const Profile = React.lazy(() => import('@/pages/Profile'));

// Enhanced loading fallback with skeleton UI
const AuthLoader = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="max-w-md mx-auto space-y-4">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  </div>
);

export const AuthRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <Route 
        path="/auth" 
        element={
          <Suspense fallback={<AuthLoader />}>
            {isAuthenticated ? <Navigate to="/profile" replace /> : <Auth />}
          </Suspense>
        } 
      />
      <Route 
        path="/register" 
        element={
          <Suspense fallback={<AuthLoader />}>
            {isAuthenticated ? 
              <Navigate to="/profile" replace /> : 
              <Navigate to="/auth" replace state={{ activeTab: "register" }} />
            }
          </Suspense>
        } 
      />
      <Route 
        path="/login" 
        element={
          <Suspense fallback={<AuthLoader />}>
            {isAuthenticated ? 
              <Navigate to="/profile" replace /> : 
              <Navigate to="/auth" replace state={{ activeTab: "login" }} />
            }
          </Suspense>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <Suspense fallback={<AuthLoader />}>
            {isAuthenticated ? <Profile /> : <Navigate to="/auth" replace />}
          </Suspense>
        } 
      />
    </>
  );
};
