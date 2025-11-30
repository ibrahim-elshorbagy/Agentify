import React, { useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Toastify from '../Partials/Toastify';
import Header from './Header';
import Footer from './Footer';
import { useTrans } from '@/Hooks/useTrans';
// import Squares from '@/Components/Squares';
import Plasma from '@/Components/Plasma';

export default function SiteLayout({ children, title }) {
  const { locale } = usePage().props;

  const { t } = useTrans();
  const { auth } = usePage().props;


  return (
    <div className="min-h-screen bg-gradient-to-r from-green-500 via-green-400 to-green-500 dark:from-[#000201] dark:via-neutral-800 dark:to-[#000201]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>

      {/* Header */}
      <Header />

      {/* Responsive Background - Animated on desktop, static on mobile/tablet */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <Plasma
          color="#5dea82"
          speed={0.5}
          direction="forward"
          scale={1.7}
          opacity={1}
          mouseInteractive={false}
        />
      </div>

      {/* Main content */}
      <main className="relative z-10">{children}</main>

      {/* Footer */}
      <Footer />

      <Toastify />
    </div>
  );
}
