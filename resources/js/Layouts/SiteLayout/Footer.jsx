import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useTrans } from '@/Hooks/useTrans';


export default function Footer() {
  const { t } = useTrans();


  return (
    <footer className="relative border-t border-neutral-200 dark:border-neutral-700 bg-gradient-to-br from-green-50 via-neutral-50 to-green-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-green-900/30">
      {/* Decorative top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>


      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Logo and Brand */}
          <div className="flex justify-center mb-3">
            <Link href={route("home")} className="w-32 transition-transform duration-300 hover:scale-110">
              <ApplicationLogo />
            </Link>
          </div>


          {/* Main Description */}
          <div className="text-center mb-4">
            <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
              {t('footer_description')}
            </p>
          </div>

          {/* Links */}
          <div className="flex justify-center space-x-6 mb-4">
            <Link href={route('privacy-policy')} className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href={route('terms')} className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
              Terms of Service
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © {new Date().getFullYear()} {t('footer_brand_name')}. {t('footer_rights_reserved')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
