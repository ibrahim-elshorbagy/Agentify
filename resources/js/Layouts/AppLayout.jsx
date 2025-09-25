import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import { usePage, Link } from '@inertiajs/react';
import Toastify from './Partials/Toastify';
import { useTrans } from '@/Hooks/useTrans';
import SidebarProfileMenu from './Sidebar/SidebarProfileMenu';

export default function AppLayout({ children, title }) {
  const { locale } = usePage().props;

  const { t } = useTrans();
  const { auth } = usePage().props;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const handleSidebarToggleForMobile = () => {
    setSidebarIsOpen(v => !v);
  };

  return (
    <div className="font-sans antialiased" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className=" bg-gray-100 dark:bg-neutral-800 min-h-[100vh]" >

        {/* Mobile Navbar */}
        <nav className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
          <button
            type="button"
            className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={t('open_sidebar')}
            onClick={handleSidebarToggleForMobile}
          >
            <i className="fa-solid fa-bars size-6"></i>
          </button>
          <div className="w-8" />
          {/* Profile menu at the bottom */}
          <SidebarProfileMenu />
        </nav>

        {/* Dark overlay for mobile sidebar */}
        {sidebarIsOpen && (
          <div
            className="fixed inset-0 z-20 bg-neutral-800/10 backdrop-blur-xs md:hidden"
            aria-hidden="true"
            onClick={() => setSidebarIsOpen(false)}
            style={{ transition: 'opacity 0.2s' }}
          />
        )}

        <div className="relative flex w-full flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <Sidebar sidebarIsOpen={sidebarIsOpen} setSidebarIsOpen={setSidebarIsOpen} />

          {/* Main Content */}
          <main className="h-full w-full overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      <Toastify />
    </div>
  );
}
