
import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Detect system preference for initial theme
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    // Set default theme to dark (Letterboxd-style)
    if (!theme) {
      setTheme('dark');
    }
  }, [theme, setTheme]);

  return (
    <div className={cn(
      "flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300",
      "bg-gradient-to-br from-background to-background/95"
    )}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto py-8 px-4 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
      <footer className="border-t border-border py-6 px-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <a href="/" className="hover:text-primary transition-colors letterboxd-link">About</a>
              <a href="/" className="hover:text-primary transition-colors letterboxd-link">Help</a>
              <a href="/" className="hover:text-primary transition-colors letterboxd-link">Terms</a>
              <a href="/" className="hover:text-primary transition-colors letterboxd-link">API</a>
              <a href="/" className="hover:text-primary transition-colors letterboxd-link">Contact</a>
            </div>
            <div>
              © {new Date().getFullYear()} FootballTrackr. Made with passion for football.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
