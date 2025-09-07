import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

export const ACCENT_COLORS = {
  emerald: { h: 158, s: 78, l: 44 },
  blue: { h: 217, s: 91, l: 60 },
  purple: { h: 262, s: 84, l: 65 },
  rose: { h: 347, s: 90, l: 61 },
  orange: { h: 35, s: 92, l: 60 },
};

export type AccentColorName = keyof typeof ACCENT_COLORS;
export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  accentColor: AccentColorName;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColorName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColor] = useState<AccentColorName>('blue');

  // Effect to initialize state from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('themeMode') as ThemeMode | null;
    const storedAccent = localStorage.getItem('accentColor') as AccentColorName | null;
    
    if (storedTheme) {
      setThemeMode(storedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(prefersDark ? 'dark' : 'light');
    }

    if (storedAccent && ACCENT_COLORS[storedAccent]) {
      setAccentColor(storedAccent);
    }
  }, []);

  // Effect to apply changes and save to localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme mode class
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('themeMode', themeMode);

    // Apply accent color CSS variables
    const colors = ACCENT_COLORS[accentColor];
    root.style.setProperty('--color-accent-h', `${colors.h}`);
    root.style.setProperty('--color-accent-s', `${colors.s}%`);
    root.style.setProperty('--color-accent-l', `${colors.l}%`);
    root.style.setProperty('--color-accent-darker-l', `${colors.l * 0.9}%`);

    localStorage.setItem('accentColor', accentColor);
  }, [themeMode, accentColor]);

  const value = useMemo(() => ({
    themeMode,
    accentColor,
    setThemeMode,
    setAccentColor,
  }), [themeMode, accentColor]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};