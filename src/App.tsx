
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";

import Index from "./pages/Index";
import MatchDetails from "./pages/MatchDetails";
import CategoryPage from "./pages/CategoryPage";
import Lists from "./pages/Lists";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/match/:id" element={<MatchDetails />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/lists" element={<Lists />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
