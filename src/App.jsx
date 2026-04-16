import { useState, useCallback, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { ThemeProvider } from './context/ThemeContext';

// Existing Marketing Layout
import Navbar from './components/layout/Navbar';
import SplashScreen from './components/sections/SplashScreen';
import Hero from './components/sections/Hero';
import ContactModal from './components/sections/ContactModal';

// ERP Routes
import ProtectedRoute from './components/erp/layout/ProtectedRoute';
import DashboardShell from './components/erp/layout/DashboardShell';
import Login from './components/erp/pages/Login';
import DashboardHome from './components/erp/pages/DashboardHome';
import FarmerManagement from './components/erp/pages/FarmerManagement';
import Inventory from './components/erp/pages/Inventory';
import Udhaar from './components/erp/pages/Udhaar';
import Analytics from './components/erp/pages/Analytics';
import AIChat from './components/erp/pages/AIChat';
import Settings from './components/erp/pages/Settings';

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

// Extract the original static marketing site into a separate component
function MarketingSite() {
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
    <>
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
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DashboardProvider>
            <Routes>
              {/* Marketing Site */}
              <Route path="/" element={<MarketingSite />} />
              
              {/* ERP Portal */}
              <Route path="/dashboard/login" element={<Login />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardShell />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="farmers" element={<FarmerManagement />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="udhaar" element={<Udhaar />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="chat" element={<AIChat />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>

            </Routes>
          </DashboardProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
