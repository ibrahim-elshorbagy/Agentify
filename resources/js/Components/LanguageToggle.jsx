import React from 'react';
import { usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function LanguageToggle({ className = '' }) {
  const { t } = useTrans();
  const { locale } = usePage().props;

  const getLanguageText = () => {
    return locale === 'en' ? t('arabic') : t('english');
  };

  const getLanguageIcon = () => {
    return locale === 'en' ? 'fa-language' : 'fa-language';
  };

  return (
    <form
      action={route('locale.change')}
      method="POST"
      style={{ display: 'inline' }}
    >
      <input
        type="hidden"
        name="_token"
        value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')}
      />
      <input
        type="hidden"
        name="locale"
        value={locale === 'en' ? 'ar' : 'en'}
      />
      <button
        type="submit"
        className={`flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 ${className}`}
        aria-label={`Toggle to ${locale === 'en' ? 'Arabic' : 'English'} language`}
        title={`Switch to ${locale === 'en' ? 'Arabic' : 'English'}`}
      >
        <i className={`fa-solid ${getLanguageIcon()}`}></i>
        <span>{getLanguageText()}</span>
      </button>
    </form>
  );
}
