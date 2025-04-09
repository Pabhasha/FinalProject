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
        "h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto transition-all duration-300 ease-in-out",
        "bg-gradient-to-b from-sidebar to-sidebar/95 backdrop-blur-sm border-r border-sidebar-border",
        "shadow-lg shadow-sidebar/10",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-4 right-2 w-8 h-8 flex items-center justify-center text-sidebar-foreground hover:text-primary transition-all hover:scale-110"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronsRight className="w-5 h-5" />
        ) : (
          <ChevronsLeft className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className="p-4 mt-14">
        {/* Sections */}
        <div className="space-y-6">
          {/* Competitions Section */}
          <div className="relative">
            <div 
              className={cn(
                "flex items-center mb-3 cursor-pointer rounded-md p-2",
                "transition-all duration-200 hover:bg-sidebar-accent/80 group",
                !collapsed && "hover:shadow-inner-glow"
              )}
              onClick={!collapsed ? toggleCompetitions : undefined}
            >
              <Trophy className={cn(
                "w-5 h-5 text-blaugrana-primary mr-2 flex-shrink-0",
                "transition-all group-hover:text-blaugrana-accent"
              )} />
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
              <ul className="space-y-1 pl-7">
                {categories.map(category => (
                  <li key={category.id} className="group">
                    <Link 
                      to={`/category/${category.slug}`}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md",
                        "transition-all duration-200 group-hover:bg-sidebar-accent/90",
                        "group-hover:shadow-md group-hover:translate-x-1",
                        "text-sm text-sidebar-foreground/90 group-hover:text-sidebar-accent-foreground"
                      )}
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
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full",
                    "hover:bg-sidebar-accent/90 transition-all hover:shadow-glow-primary"
                  )}
                  title="View Competitions"
                >
                  <Trophy className="w-5 h-5" />
                </Link>
              </div>
            ) : null}
          </div>
          
          {/* Trending Matches */}
          <div className="relative">
            <div className={cn(
              "flex items-center mb-3 rounded-md p-2",
              "transition-all duration-200 group hover:bg-sidebar-accent/80",
              !collapsed && "hover:shadow-inner-glow"
            )}>
              <TrendingUp className={cn(
                "w-5 h-5 text-blaugrana-primary mr-2 flex-shrink-0",
                "transition-all group-hover:text-blaugrana-accent"
              )} />
              {!collapsed && (
                <h3 className="font-semibold text-sidebar-foreground group-hover:text-sidebar-accent-foreground">Trending Matches</h3>
              )}
            </div>
            
            {!collapsed ? (
              <ul className="space-y-1">
                {trendingMatches.map(match => (
                  <li key={match.id} className="group">
                    <Link 
                      to={`/match/${match.id}`}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md",
                        "transition-all duration-200 hover:bg-sidebar-accent/90",
                        "group-hover:shadow-md group-hover:translate-x-1",
                        "text-sm text-sidebar-foreground/90"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <img 
                          src={match.homeTeam.logo} 
                          alt={match.homeTeam.name} 
                          className="w-4 h-4 object-contain" 
                        />
                        <span className="text-xs">vs</span>
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
                    className="text-xs text-blaugrana-primary hover:underline block pt-2 px-3"
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
                      className={cn(
                        "flex justify-center py-1.5 rounded-full",
                        "transition-all duration-200 hover:bg-sidebar-accent/80",
                        "hover:shadow-glow-primary"
                      )}
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
          <div className="relative">
            <div className={cn(
              "flex items-center mb-3 rounded-md p-2",
              "transition-all duration-200 group hover:bg-sidebar-accent/80",
              !collapsed && "hover:shadow-inner-glow"
            )}>
              <Star className={cn(
                "w-5 h-5 text-blaugrana-primary mr-2 flex-shrink-0",
                "transition-all group-hover:text-blaugrana-accent"
              )} />
              {!collapsed && (
                <h3 className="font-semibold text-sidebar-foreground">Top Rated</h3>
              )}
            </div>
            
            {!collapsed ? (
              <ul className="space-y-1">
                {topRatedMatches.map(match => (
                  <li key={match.id} className="group">
                    <Link 
                      to={`/match/${match.id}`}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md",
                        "transition-all duration-200 hover:bg-sidebar-accent/90",
                        "group-hover:shadow-md group-hover:translate-x-1",
                        "text-sm text-sidebar-foreground/90"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <img 
                          src={match.homeTeam.logo} 
                          alt={match.homeTeam.name} 
                          className="w-4 h-4 object-contain" 
                        />
                        <span className="text-xs">vs</span>
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
                    className="text-xs text-blaugrana-primary hover:underline block pt-2 px-3"
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
                      className={cn(
                        "flex justify-center py-1.5 rounded-full",
                        "transition-all duration-200 hover:bg-sidebar-accent/80",
                        "hover:shadow-glow-primary"
                      )}
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
          <div className="relative">
            <div className={cn(
              "flex items-center mb-3 rounded-md p-2",
              "transition-all duration-200 group hover:bg-sidebar-accent/80",
              !collapsed && "hover:shadow-inner-glow"
            )}>
              <ListChecks className={cn(
                "w-5 h-5 text-blaugrana-primary mr-2 flex-shrink-0",
                "transition-all group-hover:text-blaugrana-accent"
              )} />
              {!collapsed && (
                <h3 className="font-semibold text-sidebar-foreground">Popular Lists</h3>
              )}
            </div>
            
            {!collapsed ? (
              <ul className="space-y-1">
                {recentLists.map(list => (
                  <li key={list.id} className="group">
                    <Link 
                      to={`/list/${list.id}`}
                      className={cn(
                        "flex items-start py-2 px-3 rounded-md",
                        "transition-all duration-200 hover:bg-sidebar-accent/90",
                        "group-hover:shadow-md group-hover:translate-x-1",
                        "text-sm text-sidebar-foreground/90"
                      )}
                    >
                      <span className="truncate">{list.title}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/lists" 
                    className="text-xs text-blaugrana-primary hover:underline block pt-2 px-3"
                  >
                    View all lists
                  </Link>
                </li>
              </ul>
            ) : (
              <div className="flex justify-center">
                <Link 
                  to="/lists"
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full",
                    "transition-all duration-200 hover:bg-sidebar-accent/80",
                    "hover:shadow-glow-primary"
                  )}
                  title="View Lists"
                >
                  <ListChecks className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>

          {/* Recently Added */}
          <div className="relative">
            <div className={cn(
              "flex items-center mb-3 rounded-md p-2",
              "transition-all duration-200 group hover:bg-sidebar-accent/80",
              !collapsed && "hover:shadow-inner-glow"
            )}>
              <Clock className={cn(
                "w-5 h-5 text-blaugrana-primary mr-2 flex-shrink-0",
                "transition-all group-hover:text-blaugrana-accent"
              )} />
              {!collapsed && (
                <h3 className="font-semibold text-sidebar-foreground">Recently Added</h3>
              )}
            </div>
            
            {!collapsed ? (
              <ul className="space-y-1">
                {mockMatches.slice(3, 6).map(match => (
                  <li key={match.id} className="group">
                    <Link 
                      to={`/match/${match.id}`}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md",
                        "transition-all duration-200 hover:bg-sidebar-accent/90",
                        "group-hover:shadow-md group-hover:translate-x-1",
                        "text-sm text-sidebar-foreground/90"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <img 
                          src={match.homeTeam.logo} 
                          alt={match.homeTeam.name} 
                          className="w-4 h-4 object-contain" 
                        />
                        <span className="text-xs">vs</span>
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
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full",
                    "transition-all duration-200 hover:bg-sidebar-accent/80",
                    "hover:shadow-glow-primary"
                  )}
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
