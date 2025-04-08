
import React from 'react';

interface LogoProps {
  variant?: 'default' | 'small';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', className = '' }) => {
  const isSmall = variant === 'small';
  
  return (
    <div className={`relative ${className}`}>
      {/* Text-only logo */}
      <span className={`font-bold ${isSmall ? 'text-lg' : 'text-xl'} bg-gradient-to-r from-blaugrana-secondary to-blaugrana-primary bg-clip-text text-transparent`}>
        Football<span className="text-foreground">Trackr</span>
      </span>
    </div>
  );
};

export default Logo;
