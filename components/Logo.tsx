import React, { useState, useEffect } from 'react';
import { getLogo } from '../data/dataService';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateLogo = () => {
      setCustomLogo(getLogo());
      setIsLoading(false);
    };

    updateLogo(); // Initial load

    // Listen for custom event when logo is changed in settings
    window.addEventListener('logo-updated', updateLogo);
    // Also listen for general storage changes from other tabs
    window.addEventListener('storage', updateLogo);

    return () => {
      window.removeEventListener('logo-updated', updateLogo);
      window.removeEventListener('storage', updateLogo);
    };
  }, []);
  
  if (isLoading) {
    return <div className={`${className} bg-slate-700 rounded-lg animate-pulse`}></div>;
  }

  if (customLogo) {
    return <img src={customLogo} alt="Logo TQA APP" className={`${className} object-contain`} />;
  }

  // Fallback to original SVG
  return (
    <svg 
      viewBox="0 0 64 64" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Logo TQA APP"
    >
      <defs>
        <linearGradient id="monitorGradient" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#80D0FF" />
          <stop offset="100%" stopColor="#4A90E2" />
        </linearGradient>
      </defs>

      {/* Monitor body */}
      <path 
        d="M58,54H6a4,4,0,0,1-4-4V12a4,4,0,0,1,4-4H58a4,4,0,0,1,4,4V50A4,4,0,0,1,58,54Z" 
        fill="url(#monitorGradient)" 
      />
      
      {/* Stand */}
      <path d="M40 54 L40 58 L24 58 L24 54 Z" fill="#336699" />
      <path d="M46 62 L18 62 L20 58 L44 58 Z" fill="#336699" />
      
      {/* Screen */}
      <rect x="6" y="12" width="52" height="38" rx="2" fill="white" />
      
      {/* Illustration */}
      <g>
        {/* Student */}
        <g fill="#4A4A4A">
          {/* Body */}
          <path d="M16 40 L16 31 C16 28.7909 17.7909 27 20 27 H28 C30.2091 27 32 28.7909 32 31 L32 40Z" />
          {/* Head */}
          <circle cx="24" cy="21" r="5" />
        </g>
        
        {/* Bars */}
        <g fill="hsl(var(--color-accent-h) var(--color-accent-s) var(--color-accent-l))">
          <rect x="36" y="34" width="4" height="6" rx="1" />
          <rect x="42" y="30" width="4" height="10" rx="1" />
          <rect x="48" y="24" width="4" height="16" rx="1" />
        </g>
      </g>
    </svg>
  );
};

export default Logo;
