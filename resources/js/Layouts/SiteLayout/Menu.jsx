import React from 'react'
import Dock from "@/Components/Dock";
import { useTrans } from '@/Hooks/useTrans';
import { useSmoothScroll } from '@/Hooks/useSmoothScroll';
import { router } from '@inertiajs/react';

export default function Menu({ footerRef }) {
  const { t } = useTrans();

  const { activeSection, scrollToSection } = useSmoothScroll();

  // Check if we're on the home page
  const isHomePage = route().current("home");

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (isHomePage) {
      scrollToSection(sectionId);
    } else {
      // If not on home page, navigate to home with hash
      router.visit(route('home') + '#' + sectionId);
    }
  };
  const items = [
    {
      icon: <i className="fa-solid fa-home text-white"></i>,
      label: t('home'),
      onClick: (e) => handleNavClick(e, 'home'),
      className: isHomePage && activeSection === 'home' ? 'bg-green-600' : ''
    },
    {
      icon: <i className="fa-solid fa-info-circle text-white"></i>,
      label: t('about'),
      onClick: (e) => handleNavClick(e, 'about'),
      className: isHomePage && activeSection === 'about' ? 'bg-green-600' : ''
    },
    {
      icon: <i className="fa-solid fa-tag text-white"></i>,
      label: t('pricing'),
      onClick: (e) => handleNavClick(e, 'pricing'),
      className: isHomePage && activeSection === 'pricing' ? 'bg-green-600' : ''
    },

    {
      icon: <i className="fa-solid fa-envelope text-white"></i>,
      label: t('contact_us'),
      onClick: (e) => handleNavClick(e, 'contact'),
      className: isHomePage && activeSection === 'contact' ? 'bg-green-600' : ''
    },
  ];
  return (
    <Dock
      items={items}
      panelHeight={68}
      baseItemSize={50}
      magnification={70}
      footerRef={footerRef}
    />
  )
}
