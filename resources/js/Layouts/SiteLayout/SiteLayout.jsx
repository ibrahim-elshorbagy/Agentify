import React, { useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Toastify from '../Partials/Toastify';
import Header from './Header';
import Footer from './Footer';
import { useTrans } from '@/Hooks/useTrans';
import Menu from './Menu';
import Squares from '@/Components/Squares';

export default function SiteLayout({ children, title }) {
  const { locale } = usePage().props;

  const { t } = useTrans();
  const { auth } = usePage().props;

  const footerRef = useRef();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-200 to-green-200 dark:from-green-900 dark:via-neutral-900 dark:to-green-800" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Animated Grid Background  */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor="#22c55e30"
          squareSize={40}
          hoverFillColor="#22c55e15"
          gradientCenterColor="#00000000"
          gradientEdgeColor="#10b98130"
        />
      </div>

      {/* Header */}
      <div className="relative z-50">
        <Header />
      </div>

      {/* Main content */}
      <main className="relative z-10">{children}</main>

      <Menu footerRef={footerRef} />
      {/* Footer */}
      <div ref={footerRef} className="relative z-50">
        <Footer />
      </div>

      <Toastify />
    </div>
  );
}
