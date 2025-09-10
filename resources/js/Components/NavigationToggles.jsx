import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function NavigationToggles({
  className = '',
  variant = 'default', // 'default', 'compact', 'mobile'
  showLabels = true
}) {
  const { t } = useTrans();
  const { locale } = usePage().props;

  // Theme management
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.theme === 'dark' || localStorage.theme === 'light') {
        return localStorage.theme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.theme = 'dark';
    } else if (theme === 'light') {
      root.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.removeItem('theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    router.post(route('locale.change'), {
      locale: newLocale
    }, {
      preserveScroll: true
    });
  };

  const getThemeIcon = () => {
    return theme === 'dark' ? 'fa-moon' : 'fa-sun';
  };

  const getThemeText = () => {
    return theme === 'dark' ? t('dark_mode') : t('light_mode');
  };

  const getLanguageText = () => {
    return locale === 'en' ? t('arabic') : t('english');
  };

  // Base button classes
  const baseButtonClasses = " flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors duration-200 ";

  // Variant-specific classes
  const variantClasses = {
    default: " px-3 py-2 rounded-lg ",
    compact: " px-2 py-1 rounded-md ",
    mobile: "  px-5 py-3 text-left  "
  };

  // Container classes based on variant
  const containerClasses = {
    default: "flex items-center gap-3",
    compact: "flex items-center gap-2",
    mobile: "flex justify-around  border-b border-neutral-200 dark:border-neutral-700"
  };

  const buttonClass = `${baseButtonClasses} ${variantClasses[variant]}`;
  const containerClass = `${containerClasses[variant]} ${className}`;

  return (
    <div className={containerClass}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={buttonClass}
        aria-label={`Toggle to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <i className={`fa-solid ${getThemeIcon()}`}></i>
        {showLabels && <span className="text-sm">{getThemeText()}</span>}
      </button>

      {/* Language Toggle */}
      <button
        onClick={toggleLocale}
        className={buttonClass}
        aria-label={`Toggle to ${locale === 'en' ? 'Arabic' : 'English'} language`}
        title={`Switch to ${locale === 'en' ? 'Arabic' : 'English'}`}
      >
        <i className="fa-solid fa-language"></i>
        {showLabels && <span className="text-sm">{getLanguageText()}</span>}
      </button>
    </div>
  );
}
