import ApplicationLogo from '@/Components/ApplicationLogo'
import NavLink from '@/Components/NavLink'
import PrimaryButton from '@/Components/PrimaryButton'
import NavigationToggles from '@/Components/NavigationToggles'
import { useTrans } from '@/Hooks/useTrans'
import { useSmoothScroll } from '@/Hooks/useSmoothScroll'
import { Link, usePage } from '@inertiajs/react'
import React from 'react'

export default function WebNavigation() {
  const { locale } = usePage().props;
  const { t } = useTrans();
  const { auth } = usePage().props;
  const { activeSection, scrollToSection } = useSmoothScroll();

  // Check if we're on the home page
  const isHomePage = route().current("home");

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (isHomePage) {
      scrollToSection(sectionId);
    } else {
      // If not on home page, navigate to home with hash
      window.location.href = route('home') + '#' + sectionId;
    }
  };

  return (
    <div className='py-2 border-b border-b-neutral-300 dark:border-b-neutral-700 bg-green-50 dark:bg-green-800 max-md:hidden'>
      <div className='container mx-auto'>
        <div className='flex justify-between items-center mx-4'>
          {/* Logo */}
          <Link
            href={route('home')}
            className="w-24"
          >
            <ApplicationLogo />
          </Link>

          {/* Center Navigation */}
          <ul className="flex gap-10 items-center justify-center">
            <li>
              <NavLink
                href="#home"
                onClick={(e) => handleNavClick(e, 'home')}
                active={isHomePage && activeSection === 'home'}
              >
                {t('home')}
              </NavLink>
            </li>
            <li>
              <NavLink
                href="#about"
                onClick={(e) => handleNavClick(e, 'about')}
                active={isHomePage && activeSection === 'about'}
              >
                {t('about')}
              </NavLink>
            </li>
            <li>
              <NavLink
                href="#pricing"
                onClick={(e) => handleNavClick(e, 'pricing')}
                active={isHomePage && activeSection === 'pricing'}
              >
                {t('plans')}
              </NavLink>
            </li>
            <li>
              <NavLink
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                active={isHomePage && activeSection === 'contact'}
              >
                {t('contact_us')}
              </NavLink>
            </li>
          </ul>

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
  )
}
