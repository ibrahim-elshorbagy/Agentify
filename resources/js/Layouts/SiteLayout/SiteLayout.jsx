import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import Toastify from '../Partials/Toastify';
import Header from './Header';
import Footer from './Footer';
import { useTrans } from '@/Hooks/useTrans';

export default function SiteLayout({ children, title }) {
  const { locale } = usePage().props;

  const { t } = useTrans();
  const { auth } = usePage().props;

  return (
    <div className="min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="">{children}</main>

      {/* Footer */}
      <Footer />

      <Toastify />
    </div>
  );
}
