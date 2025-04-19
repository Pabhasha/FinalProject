
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockMatches, Match } from '@/utils/mockData';
import { cn } from '@/lib/utils';

// Create a component that doesn't depend on router context for initial render
const SearchBarContent: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Match[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter matches based on query
    if (query.trim().length > 1) {
      const filteredMatches = mockMatches.filter(match => {
        const lowerQuery = query.toLowerCase();
        return (
          match.homeTeam.name.toLowerCase().includes(lowerQuery) ||
          match.awayTeam.name.toLowerCase().includes(lowerQuery) ||
          match.competition.name.toLowerCase().includes(lowerQuery) ||
          match.stadium.name.toLowerCase().includes(lowerQuery)
        );
      });
      setResults(filteredMatches);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultClick = (match: Match) => {
    navigate(`/match/${match.id}`);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search matches, teams, competitions..."
          className="w-full h-10 px-4 pl-10 bg-secondary text-foreground rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-12 left-0 w-full bg-popover shadow-lg rounded-md overflow-hidden z-50 animate-fade-in">
          <div className="max-h-80 overflow-y-auto py-2">
            {results.map((match) => (
              <div
                key={match.id}
                className="px-4 py-2 hover:bg-secondary/50 cursor-pointer transition-colors"
                onClick={() => handleResultClick(match)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <img 
                      src={match.homeTeam.logo} 
                      alt={match.homeTeam.name} 
                      className="w-6 h-6 object-contain" 
                    />
                    <span className="text-foreground font-medium">vs</span>
                    <img 
                      src={match.awayTeam.logo} 
                      alt={match.awayTeam.name} 
                      className="w-6 h-6 object-contain" 
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">
                      {match.homeTeam.name} vs {match.awayTeam.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {match.competition.name} • {new Date(match.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.trim().length > 1 && results.length === 0 && (
        <div className="absolute top-12 left-0 w-full bg-popover shadow-lg rounded-md z-50 animate-fade-in">
          <div className="py-4 px-4 text-center">
            <p className="text-muted-foreground">No matches found</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrapper component that safely uses router hooks
const SearchBar: React.FC = () => {
  // Check if we're in a browser environment before using router hooks
  if (typeof window === "undefined") {
    // Server-side rendering fallback
    return <div className="w-full max-w-md h-10"></div>;
  }
  
  try {
    // Try to use the navigate hook, but handle errors gracefully
    const navigate = useNavigate();
    return <SearchBarContent navigate={navigate} />;
  } catch (error) {
    console.error("Router context not available for SearchBar:", error);
    // Return a non-interactive version as fallback
    return (
      <div className="relative w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search matches, teams, competitions..."
            className="w-full h-10 px-4 pl-10 bg-secondary text-foreground rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            disabled
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
      </div>
    );
  }
};

export default SearchBar;
