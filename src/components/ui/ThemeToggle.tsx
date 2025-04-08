
import React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Switch } from './switch';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className={`
          relative w-14 h-8 rounded-full transition-colors duration-300
          ${isDark 
            ? 'bg-gradient-to-r from-blaugrana-secondary to-blaugrana-primary shadow-glow-secondary' 
            : 'bg-gradient-to-r from-amber-300 to-yellow-500 shadow-glow-accent'
          }
        `}
      >
        <div 
          className={`
            absolute top-1 left-1 flex items-center justify-center
            w-6 h-6 rounded-full transition-transform duration-500
            ${isDark 
              ? 'bg-gray-900 transform translate-x-6' 
              : 'bg-white'
            }
          `}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-blue-100" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-500" />
          )}
        </div>
        <span className="sr-only">Toggle theme</span>
      </Switch>
    </div>
  );
};

export default ThemeToggle;
