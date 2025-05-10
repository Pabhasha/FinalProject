
import { Toaster } from '@/components/ui/sonner';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import { ThemeProvider } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, lazy } from "react";
import { AuthRoutes } from "@/components/auth/AuthRoutes";
import { AdminRoutes } from "@/components/admin/AdminRoutes";

import Index from "./pages/Index";

// Lazy-loaded pages for better performance
const MatchDetails = lazy(() => import('./pages/MatchDetails'));
const Matches = lazy(() => import('./pages/Matches'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Lists = lazy(() => import('./pages/Lists'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Enhanced loading fallback with skeleton UI
const PageLoader = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="space-y-8">
      <Skeleton className="h-12 w-[250px]" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdminProvider>
            <ThemeProvider defaultTheme="dark" attribute="class">
              <TooltipProvider>
                <Toaster />
                <Sonner 
                  position="top-right" 
                  closeButton 
                  richColors 
                  expand={false}
                  className="z-[100]"
                />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/match/:id" element={
                    <Suspense fallback={<PageLoader />}>
                      <MatchDetails />
                    </Suspense>
                  } />
                  <Route path="/matches" element={
                    <Suspense fallback={<PageLoader />}>
                      <Matches />
                    </Suspense>
                  } />
                  <Route path="/category/:slug" element={
                    <Suspense fallback={<PageLoader />}>
                      <CategoryPage />
                    </Suspense>
                  } />
                  <Route path="/lists" element={
                    <Suspense fallback={<PageLoader />}>
                      <Lists />
                    </Suspense>
                  } />
                  
                  {/* Auth Routes */}
                  <AuthRoutes />
                  
                  {/* Admin Routes */}
                  <AdminRoutes />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={
                    <Suspense fallback={<PageLoader />}>
                      <NotFound />
                    </Suspense>
                  } />
                </Routes>
              </TooltipProvider>
            </ThemeProvider>
          </AdminProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
