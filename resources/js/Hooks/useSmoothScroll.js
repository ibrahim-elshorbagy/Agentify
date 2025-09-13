import { useState, useEffect, useCallback } from 'react';

export function useSmoothScroll() {
  const [activeSection, setActiveSection] = useState('home');

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Adjust based on your header height
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });

      // Update URL hash without triggering navigation
      if (window.location.hash !== `#${sectionId}`) {
        window.history.replaceState(null, '', `#${sectionId}`);
      }
    }
  }, []);

  // Handle scroll events to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'pricing', 'about', 'contact'];
      const headerHeight = 80;
      const scrollPosition = window.scrollY + headerHeight + 100; // Add some offset for better UX

      // Find the current section
      let currentSection = 'home';

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          currentSection = sections[i];
          break;
        }
      }

      // Special case for when we're at the very top
      if (window.scrollY < 100) {
        currentSection = 'home';
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    // Set initial active section
    handleScroll();

    // Add scroll event listener with throttling
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [activeSection]);

  // Handle URL hash changes (for direct links)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['home', 'features', 'pricing', 'contact'].includes(hash)) {
        scrollToSection(hash);
      } else if (!hash) {
        // If no hash, scroll to top
        scrollToSection('home');
      }
    };

    // Check initial hash on component mount
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && ['home', 'features', 'pricing', 'about', 'contact'].includes(initialHash)) {
      // Small delay to ensure page is fully loaded
      setTimeout(() => scrollToSection(initialHash), 100);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [scrollToSection]);

  return {
    activeSection,
    scrollToSection
  };
}
