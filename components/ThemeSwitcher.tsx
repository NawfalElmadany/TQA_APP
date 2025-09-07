import React from 'react';
import { useTheme, ACCENT_COLORS, AccentColorName } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useTheme();

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="bg-white/50 dark:bg-black/50 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-full p-2 flex items-center space-x-2 shadow-lg">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
        >
          {themeMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

        {Object.keys(ACCENT_COLORS).map((color) => (
          <button
            key={color}
            onClick={() => setAccentColor(color as AccentColorName)}
            className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
              accentColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-800 ring-brand-accent' : ''
            }`}
            style={{ backgroundColor: `hsl(${ACCENT_COLORS[color as AccentColorName].h}, ${ACCENT_COLORS[color as AccentColorName].s}%, ${ACCENT_COLORS[color as AccentColorName].l}%)` }}
            aria-label={`Set accent color to ${color}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
