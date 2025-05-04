
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './dropdown-menu';
import { cn } from '@/lib/utils';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Ensure the component is mounted before rendering to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <Button variant="ghost" size="sm" className="w-9 h-9 px-0" disabled />;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center justify-center w-9 h-9 px-0 focus-visible:ring-primary/50"
          aria-label="Change theme"
        >
          {theme === 'dark' && <Moon className="h-[1.15rem] w-[1.15rem] text-yellow-400" />}
          {theme === 'light' && <Sun className="h-[1.15rem] w-[1.15rem] text-orange-500" />}
          {theme === 'system' && <Monitor className="h-[1.15rem] w-[1.15rem]" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-fade-in">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={cn("cursor-pointer", theme === 'light' && "bg-accent")}
        >
          <Sun className="mr-2 h-4 w-4 text-orange-500" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={cn("cursor-pointer", theme === 'dark' && "bg-accent")}
        >
          <Moon className="mr-2 h-4 w-4 text-blue-500" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={cn("cursor-pointer", theme === 'system' && "bg-accent")}
        >
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
