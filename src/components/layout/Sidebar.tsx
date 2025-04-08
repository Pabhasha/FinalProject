
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronsRight, ChevronsLeft, TrendingUp, Star, ListChecks, Clock, Trophy, ChevronsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockMatches, mockLists } from '@/utils/mockData';
import { categories } from '@/utils/categoryData';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [competitionsExpanded, setCompetitionsExpanded] = useState(true);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleCompetitions = () => {
    setCompetitionsExpanded(!competitionsExpanded);
  };

  // Get trending and top rated matches
  const trendingMatches = mockMatches.slice(0, 3);
  const topRatedMatches = [...mockMatches].sort(() => Math.random() - 0.5).slice(0, 3);
  const recentLists = mockLists.slice(0, 3);

  return (
    <aside 
      className={cn(
        "h-[calc(100vh-4rem)] sticky top-16 bg-sidebar border-r border-border overflow-y-auto transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-4 right-2 w-8 h-8 flex items-center justify-center text-sidebar-foreground hover:text-primary transition-colors"
      >
        {collapsed ? (
          <ChevronsRight className="w-5 h-5" />
        ) : (
          <ChevronsLeft className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className="p-4">
        {/* Sections */}
        <div className="space-y-6">
          {/* Competitions Section */}
          <div>
            <div 
              className="flex items-center mb-3 cursor-pointer"
              onClick={!collapsed ? toggleCompetitions : undefined}
            >
              <Trophy className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
              {!collapsed && (
                <>
                  <h3 className="font-semibold text-sidebar-foreground">Competitions</h3>
                  <div className="ml-auto">
                    {competitionsExpanded ? (
                      <ChevronsDown className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <ChevronsRight className="w-4 h-4 flex-shrink-0" />
                    )}
                  </div>
                </>
              )}
            </div>
            
            {!collapsed && competitionsExpanded ? (
              <ul className="space-y-2 pl-7">
                {categories.map(category => (
                  <li key={category.id}>
                    <Link 
                      to={`/category/${category.slug}`}
                      className="flex items-center py-1.5 px-2 rounded hover:bg-sidebar-accent transition-colors text-sm"
                    >
                      <span className="truncate">{category.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : collapsed ? (
              <div className="flex justify-center">
                <Link 
                  to="/matches"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sidebar-accent"
                  title="View Competitions"
                >
                  <Trophy className="w-5 h-5" />
                </Link>
              </div>
            ) : null}
          </div>
          
          {/* Trending Matches */}
          <div>
            <div className="flex items-center mb-3">
              <TrendingUp className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
              {!collapsed && (
                <h3 className="font-semibold text-sidebar-foreground">Trending Matches</h3>
              )}
            </div>
            
            {!collapsed ? (
              <ul className="space-y-2">
                {trendingMatches.map(match => (
                  <li key={match.id}>
                    <Link 
                      to={`/match/${match.id}`}
                      className="flex items-center py-1.5 px-2 rounded hover:bg-sidebar-accent transition-colors text-sm"
                    >
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <img 
                          src={match.homeTeam.logo} 
                          alt={match.homeTeam.name} 
                          className="w-4 h-4 object-contain" 
                        />
                        <span className="mx-0.5 text-xs">vs</span>
                        <img 
                          src={match.awayTeam.logo} 
                          alt={match.awayTeam.name} 
                          className="w-4 h-4 object-contain" 
                        />
                      </div>
                      <span className="ml-2 truncate">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/matches" 
                    className="text-xs text-primary hover:underline block pt-1"
                  >
                    View all matches
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2">
                {trendingMatches.map(match => (
                  <li key={match.id}>
                    <Link 
                      to={`/match/${match.id}`}
                      className="flex justify-center py-1.5 rounded hover:bg-sidebar-accent transition-colors"
                      title={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
                    >
                      <div className="flex items-center">
                        <img 
                          src={match.homeTeam.logo} 
                          alt={match.homeTeam.name} 
                          className="w-5 h-5 object-contain" 
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Top Rated Matches */}
          <div>
            <div className="flex items-center mb-3">
              <Star className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
              {!collapsed && (
                <h3 className="font-semibold text-sidebar-foreground">Top Rated</h3>
              )}
            </div>
            
            {!collapsed ? (
              <ul className="space-y-2">
                {topRatedMatches.map(match => (
                  <li key={match.id}>
                    <Link 
                      to={`/match/${match.id}`}
                      className="flex items-center py-1.5 px-2 rounded hover:bg-sidebar-accent transition-colors text-sm"
                    >
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <img 
                          src={match.homeTeam.logo} 
                          alt={match.homeTeam.name} 
                          className="w-4 h-4 object-contain" 
                        />
                        <span className="mx-0.5 text-xs">vs</span>
                        <img 
                          src={match.awayTeam.logo} 
                          alt={match.awayTeam.name} 
                          className="w-4 h-4 object-contain" 
                        />
                      </div>
                      <span className="ml-2 truncate">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/matches" 
                    className="text-xs text-primary hover:underline block pt-1"
                  >
                    View all matches
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2">
                {topRatedMatches.map(match => (
                  <li key={match.id}>
                    <Link 
                      to={`/match/${match.id}`}
                      className="flex justify-center py-1.5 rounded hover:bg-sidebar-accent transition-colors"
                      title={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
                    >
                      <div className="flex items-center">
                        <img 
                          src={match.awayTeam.logo} 
                          alt={match.awayTeam.name} 
                          className="w-5 h-5 object-contain" 
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Lists */}
          <div>
            <div className="flex items-center mb-3">
              <ListChecks className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
              {!collapsed && (
                <h3 className="font-semibold text-sidebar-foreground">Popular Lists</h3>
              )}
            </div>
            
            {!collapsed ? (
              <ul className="space-y-2">
                {recentLists.map(list => (
                  <li key={list.id}>
                    <Link 
                      to={`/list/${list.id}`}
                      className="flex items-start py-1.5 px-2 rounded hover:bg-sidebar-accent transition-colors text-sm"
                    >
                      <span className="truncate">{list.title}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/lists" 
                    className="text-xs text-primary hover:underline block pt-1"
                  >
                    View all lists
                  </Link>
                </li>
              </ul>
            ) : (
              <div className="flex justify-center">
                <Link 
                  to="/lists"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sidebar-accent"
                  title="View Lists"
                >
                  <ListChecks className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>

          {/* Recently Added */}
          <div>
            <div className="flex items-center mb-3">
              <Clock className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
              {!collapsed && (
                <h3 className="font-semibold text-sidebar-foreground">Recently Added</h3>
              )}
            </div>
            
            {!collapsed ? (
              <ul className="space-y-2">
                {mockMatches.slice(3, 6).map(match => (
                  <li key={match.id}>
                    <Link 
                      to={`/match/${match.id}`}
                      className="flex items-center py-1.5 px-2 rounded hover:bg-sidebar-accent transition-colors text-sm"
                    >
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <img 
                          src={match.homeTeam.logo} 
                          alt={match.homeTeam.name} 
                          className="w-4 h-4 object-contain" 
                        />
                        <span className="mx-0.5 text-xs">vs</span>
                        <img 
                          src={match.awayTeam.logo} 
                          alt={match.awayTeam.name} 
                          className="w-4 h-4 object-contain" 
                        />
                      </div>
                      <span className="ml-2 truncate">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex justify-center">
                <Link 
                  to="/matches"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sidebar-accent"
                  title="Recently Added"
                >
                  <Clock className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
