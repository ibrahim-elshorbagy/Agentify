import Dock from "@/Components/Dock";
import ApplicationLogo from '@/Components/ApplicationLogo';
import PrimaryButton from '@/Components/PrimaryButton';
import NavigationToggles from '@/Components/NavigationToggles';
import { useTrans } from '@/Hooks/useTrans';
import { useSmoothScroll } from '@/Hooks/useSmoothScroll';
import { Link, usePage } from '@inertiajs/react';

export default function Header() {
  const { t } = useTrans();





  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
      {/* Top Bar with Logo, Toggles and CTA */}
      <div className='py-2 border-b border-b-neutral-300 dark:border-b-neutral-700 bg-green-50 dark:bg-green-800'>
        <div className='container mx-auto'>
          <div className='flex justify-between items-center mx-4'>
            {/* Logo */}
            <Link
              href={route('home')}
              className="w-24"
            >
              <ApplicationLogo />
            </Link>

            {/* Right Side - Toggles and CTA */}
            <div className="flex items-center gap-4">
              <NavigationToggles
                variant="compact"
                showLabels={false}
                className="hidden lg:flex"
              />
              <PrimaryButton
                as="a"
                variant="edit"
                icon="fa-play"
                className='ltr:flex-row-reverse gap-3'
                href={route('dashboard')}
              >
                {t('get_started')}
              </PrimaryButton>
            </div>
          </div>

          {/* Secondary row for toggles on smaller screens */}
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-600 mt-2 pt-2 mx-4">
            <NavigationToggles
              variant="compact"
              showLabels={true}
              className="justify-center"
            />
          </div>
        </div>
      </div>

      
    </header>
  );
}
