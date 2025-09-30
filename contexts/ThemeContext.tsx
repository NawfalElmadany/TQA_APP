import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem('themeMode') as ThemeMode | null;
    if (storedTheme) {
      return storedTheme;
    }
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    return localStorage.getItem('customLogoUrl');
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme mode class
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('themeMode', themeMode);

    // Apply fixed accent color CSS variables
    const accentColor = { h: 217, s: 91, l: 60 }; // Hardcoded blue color
    root.style.setProperty('--color-accent-h', `${accentColor.h}`);
    root.style.setProperty('--color-accent-s', `${accentColor.s}%`);
    root.style.setProperty('--color-accent-l', `${accentColor.l}%`);
    root.style.setProperty('--color-accent-darker-l', `${accentColor.l * 0.9}%`);

    // Persist custom logo
    if (logoUrl) {
      localStorage.setItem('customLogoUrl', logoUrl);
    } else {
      localStorage.removeItem('customLogoUrl');
    }

  }, [themeMode, logoUrl]);

  const value = useMemo(() => ({
    themeMode,
    setThemeMode,
    logoUrl,
    setLogoUrl,
  }), [themeMode, logoUrl]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
