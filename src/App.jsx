import { useState, useCallback, Suspense, lazy } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import SplashScreen from './components/sections/SplashScreen';
import Hero from './components/sections/Hero';
import ContactModal from './components/sections/ContactModal';

// Lazy load sections below the fold
const FeaturesSticky = lazy(() => import('./components/sections/FeaturesSticky'));
const StatsBar = lazy(() => import('./components/sections/StatsBar'));
const HowItWorks = lazy(() => import('./components/sections/HowItWorks'));
const Pricing = lazy(() => import('./components/sections/Pricing'));
const Testimonials = lazy(() => import('./components/sections/Testimonials'));
const CTABanner = lazy(() => import('./components/sections/CTABanner'));
const Footer = lazy(() => import('./components/layout/Footer'));

function SectionFallback() {
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(
    sessionStorage.getItem('splashSeen') === 'true'
  );
  const [contactOpen, setContactOpen] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  const openContact = useCallback(() => {
    setContactOpen(true);
  }, []);

  const closeContact = useCallback(() => {
    setContactOpen(false);
  }, []);

  return (
    <LanguageProvider>
      {/* Splash Screen */}
      {!splashDone && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {/* Main Site */}
      <div
        className={`transition-opacity duration-600 ${
          splashDone ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Navbar onRequestDemo={openContact} />

        <main>
          <Hero onRequestDemo={openContact} />

          <Suspense fallback={<SectionFallback />}>
            <FeaturesSticky />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <StatsBar />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <HowItWorks />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <Pricing onRequestDemo={openContact} />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <Testimonials />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <CTABanner onRequestDemo={openContact} />
          </Suspense>
        </main>

        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </div>

      {/* Contact Modal */}
      <ContactModal isOpen={contactOpen} onClose={closeContact} />
    </LanguageProvider>
  );
}
