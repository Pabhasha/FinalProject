
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Logo variant="default" className="flex items-center" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/matches" className="text-foreground hover:text-primary transition-colors letterboxd-link">
            Matches
          </Link>
          <Link to="/lists" className="text-foreground hover:text-primary transition-colors letterboxd-link">
            Lists
          </Link>
          <Link to="/search" className="text-foreground hover:text-primary transition-colors letterboxd-link">
            Search
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:block">
          <SearchBar />
        </div>

        {/* User Menu / Auth */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-2">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 py-2 bg-card rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-border z-50">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  Profile
                </Link>
                <Link 
                  to="/lists" 
                  className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  My Lists
                </Link>
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="hidden md:inline-block text-foreground hover:text-primary transition-colors letterboxd-link"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="hidden md:inline-block px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="ml-4 md:hidden flex items-center"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border animate-fade-in z-50">
          <div className="px-4 py-3">
            <SearchBar />
          </div>
          <nav className="px-4 pb-4 space-y-2">
            <Link 
              to="/matches" 
              className="block py-2 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Matches
            </Link>
            <Link 
              to="/lists" 
              className="block py-2 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Lists
            </Link>
            <Link 
              to="/search" 
              className="block py-2 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search
            </Link>
            {!isAuthenticated && (
              <>
                <Link 
                  to="/login" 
                  className="block py-2 text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="block py-2 text-foreground font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
              </>
            )}
            {/* Mobile Theme Toggle */}
            <div className="py-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
