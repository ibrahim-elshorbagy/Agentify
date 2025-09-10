import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function LanguageToggle({ className = '' }) {
  const { t } = useTrans();
  const { locale, available_locales } = usePage().props;

  // Change the locale
  const toggleLocale = () => {
    // Switch between en and ar
    const newLocale = locale === 'en' ? 'ar' : 'en';

    // Use router.post similar to how logout is done
    router.post(route('locale.change'), {
      locale: newLocale
    }, {
      preserveScroll: true
    });
  };

  // Get the appropriate language text based on current locale
  const getLanguageText = () => {
    return locale === 'en' ? t('arabic') : t('english');
  };

  // Get the appropriate icon based on current locale
  const getLanguageIcon = () => {
    return locale === 'en' ? 'fa-language' : 'fa-language';
  };

  return (
    <button
      onClick={toggleLocale}
      className={`flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 ${className}`}
      aria-label={`Toggle to ${locale === 'en' ? 'Arabic' : 'English'} language`}
      title={`Switch to ${locale === 'en' ? 'Arabic' : 'English'}`}
    >
      <i className={`fa-solid ${getLanguageIcon()}`}></i>
      <span>{getLanguageText()}</span>
    </button>
  );
}
