import MenuNavLink from '@/Components/MenuNavLink'
import NavigationToggles from '@/Components/NavigationToggles'
import { usePage, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import PrimaryButton from '@/Components/PrimaryButton';
import { useTrans } from '@/Hooks/useTrans';
import { useSmoothScroll } from '@/Hooks/useSmoothScroll';

export default function TabletNavigation() {

  const {
    auth: { user },
  } = usePage().props;
  const { t } = useTrans();
  const { activeSection, scrollToSection } = useSmoothScroll();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Check if we're on the home page
  const isHomePage = route().current("home");

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu

    if (isHomePage) {
      scrollToSection(sectionId);
    } else {
      // If not on home page, navigate to home with hash
      window.location.href = route('home') + '#' + sectionId;
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    router.post(route("logout"));
  };

  return (
    <>
      {/* Mobile Menu Trigger */}
      <div className="flex justify-between items-center p-4 border-b border-b-neutral-300 dark:border-b-neutral-700 bg-green-50 dark:bg-green-800 md:hidden ">
        <div className='w-24'>
          <Link href={route("home")} >
            <ApplicationLogo />
          </Link>
        </div>

        {/* Header toggles and menu button */}
        <div className="flex items-center gap-3">
          <NavigationToggles
            variant="compact"
            showLabels={false}
            className="hidden sm:flex"
          />
          <button
            onClick={toggleMobileMenu}
            className="px-3 py-2 rounded-full bg-green-500 text-white shadow-md"
            aria-label="Open menu"
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[60] bg-green-50  dark:bg-neutral-900 text-neutral-800 dark:text-white transition-all duration-300 ease-in-out h-full
        ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <nav className="flex flex-col h-full ">
          {/* Header with Logo + Close */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-400 dark:border-neutral-700 bg-green-50 dark:bg-green-800">
            <div className="w-32">
              <Link href={route("home")} >
                <ApplicationLogo />
              </Link>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
              aria-label="Close menu"
            >
              <i className="fa-solid fa-xmark text-2xl text-neutral-700 dark:text-neutral-300"></i>
            </button>
          </div>

          {/* Menu Links */}
          <ul className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700 bg-green-50">
            {user && (
              <li>
                <MenuNavLink
                  href={route('dashboard')}
                  icon="fa-gauge-high"
                >
                  {t('dashboard')}
                </MenuNavLink>
              </li>
            )}

            <li>
              <MenuNavLink
                href="#home"
                onClick={(e) => handleNavClick(e, 'home')}
                active={isHomePage && activeSection === 'home'}
                icon="fa-house"
              >
                {t('home')}
              </MenuNavLink>
            </li>
            <li>
              <MenuNavLink
                href="#about"
                onClick={(e) => handleNavClick(e, 'about')}
                active={isHomePage && activeSection === 'about'}
                icon="fa-building"
              >
                {t('about')}
              </MenuNavLink>
            </li>
            <li>
              <MenuNavLink
                href="#pricing"
                onClick={(e) => handleNavClick(e, 'pricing')}
                active={isHomePage && activeSection === 'pricing'}
                icon="fa-tags"
              >
                {t('plans')}
              </MenuNavLink>
            </li>

            <li>
              <MenuNavLink
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                active={isHomePage && activeSection === 'contact'}
                icon="fa-building"
              >
                {t('contact_us')}
              </MenuNavLink>
            </li>

            {user ? (
              <li>
                <MenuNavLink
                  href="#"
                  icon="fa-right-from-bracket"
                  className="text-red-600 hover:text-red-700"
                >
                  <button onClick={handleLogout}>{t('logout')}</button>
                </MenuNavLink>
              </li>
            ) : (
              <>
                <li>
                  <MenuNavLink
                    href={route("register")}
                    active={route().current("register")}
                    icon="fa-user-plus"
                  >
                    {t('register')}
                  </MenuNavLink>
                </li>
                <li>
                  <MenuNavLink
                    href={route("login")}
                    active={route().current("login")}
                    icon="fa-right-to-bracket"
                  >
                    {t('login')}
                  </MenuNavLink>
                </li>
              </>
            )}
          </ul>

          {/* Settings Section */}
          <div className="border-t border-neutral-400 dark:border-neutral-700 bg-green-50 dark:bg-green-800">

            <NavigationToggles
              variant="mobile"
              showLabels={true}
            />

          </div>



        </nav>
      </div>
    </>
  );
}
