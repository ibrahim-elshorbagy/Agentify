import React, { useEffect, useState } from 'react';
import { useTrans } from '@/Hooks/useTrans'

export default function ThemeToggle({ className = '' }) {
  const { t } = useTrans()

  // Initialize theme state from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      // Check if theme is stored in localStorage
      if (localStorage.theme === 'dark' || localStorage.theme === 'light') {
        return localStorage.theme;
      }
      // If no theme in localStorage, use system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default fallback
  });

  // Update the theme when component mounts and whenever theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Apply dark mode
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.theme = 'dark';
    }
    // Apply light mode
    else if (theme === 'light') {
      root.classList.remove('dark');
      localStorage.theme = 'light';
    }
    // Apply system preference
    else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.removeItem('theme');
    }
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Get the appropriate icon based on current theme
  const getThemeIcon = () => {
    return theme === 'dark' ? 'fa-moon' : 'fa-sun';
  };

  // Get theme text for aria-label and title
  const getThemeText = () => {
    return theme === 'dark' ? t('dark_mode') : t('light_mode');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 ${className}`}
      aria-label={`Toggle to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <i className={`fa-solid ${getThemeIcon()}`}></i>
      <span>{getThemeText()}</span>
    </button>
  );
}
