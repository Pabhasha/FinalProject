
import React from 'react';

interface LogoProps {
  variant?: 'default' | 'small';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', className = '' }) => {
  const isSmall = variant === 'small';
  
  return (
    <div className={`relative ${className}`}>
      {/* Main logo shape - Blaugrana shield */}
      <div className="relative">
        {/* Shield container */}
        <div 
          className={`relative ${isSmall ? 'w-8 h-8' : 'w-10 h-10'} overflow-hidden`}
        >
          {/* Primary shield with gradient */}
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blaugrana-secondary to-blaugrana-primary overflow-hidden">
            {/* Inner decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1/2 flex">
              {/* Stripes pattern - resembling Barca crest but abstract */}
              <div className="w-1/3 h-full bg-blaugrana-secondary"></div>
              <div className="w-1/3 h-full bg-blaugrana-primary"></div>
              <div className="w-1/3 h-full bg-blaugrana-secondary"></div>
            </div>
            
            {/* Bottom geometric shape */}
            <div className={`absolute bottom-0 left-0 w-full ${isSmall ? 'h-1/2' : 'h-2/5'} flex items-center justify-center`}>
              <div className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} rotate-45 bg-white/90 transform -translate-y-1/4`}></div>
            </div>
            
            {/* Decorative circle - geometric element */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 rounded-full bg-white/90"></div>
          </div>
        </div>
      </div>
      
      {/* Text for default variant only */}
      {!isSmall && (
        <div className="ml-2 inline-flex items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-blaugrana-secondary to-blaugrana-primary bg-clip-text text-transparent">
            Football<span className="text-foreground">Trackr</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
