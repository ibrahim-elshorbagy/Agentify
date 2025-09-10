import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useTrans } from '@/Hooks/useTrans';

export default function Footer() {
  const { t } = useTrans();

  return (
    <footer className="py-6 border-t border-t-neutral-300 dark:border-t-neutral-700 text-center text-sm text-neutral-600 dark:text-neutral-400 bg-green-50 dark:bg-neutral-800">
      <div className='mx-4'>
        <div className="flex justify-center mb-3">
          <div className='w-24'>
            <Link href={route("home")} >
              <ApplicationLogo />
            </Link>
          </div>
        </div>
        <p className='text-sm dark:text-white'>{t('agentify_description')}</p>
      </div>
    </footer>
  );
}
