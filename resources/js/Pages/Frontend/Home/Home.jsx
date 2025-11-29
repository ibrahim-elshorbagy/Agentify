import SiteLayout from '@/Layouts/SiteLayout/SiteLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import HeroSection from './Partials/HeroSection';
import PricingSection from './Partials/PricingSection';
import ContactSection from './Partials/ContactSection';
import AboutSection from './Partials/AboutSection';

export default function Home({ plans }) {
  return (
    <SiteLayout>
      <Head title={'Welcome'} />

      <HeroSection />
      <AboutSection/>
      <PricingSection plans={plans} />
      <ContactSection />
    </SiteLayout>
  );
}
