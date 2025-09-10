import SiteLayout from '@/Layouts/SiteLayout/SiteLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import HeroSection from './Partials/HeroSection';
import FeaturesSection from './Partials/FeaturesSection';
import PricingSection from './Partials/PricingSection';
import ContactSection from './Partials/ContactSection';
import AboutSection from './Partials/AboutSection';

export default function Home({ plans }) {
  return (
    <SiteLayout>
      <Head title={'Welcome'} />

      <HeroSection />
      <FeaturesSection />
      <PricingSection plans={plans} />
      <AboutSection/>
      <ContactSection />
    </SiteLayout>
  );
}
