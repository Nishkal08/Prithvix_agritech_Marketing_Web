import { useState, useCallback, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';

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
import CropCalendar from './components/erp/pages/CropCalendar';

// Lazy load sections below the fold
const FeaturesSticky = lazy(() => import('./components/sections/FeaturesSticky'));
const StatsBar       = lazy(() => import('./components/sections/StatsBar'));
const HowItWorks     = lazy(() => import('./components/sections/HowItWorks'));
const Pricing        = lazy(() => import('./components/sections/Pricing'));
const Testimonials   = lazy(() => import('./components/sections/Testimonials'));
const CTABanner      = lazy(() => import('./components/sections/CTABanner'));
const Footer         = lazy(() => import('./components/layout/Footer'));

function SectionFallback() {
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function MarketingSite() {
  const [splashDone, setSplashDone] = useState(
    sessionStorage.getItem('splashSeen') === 'true'
  );
  const [contactOpen, setContactOpen] = useState(false);

  const handleSplashComplete = useCallback(() => setSplashDone(true), []);
  const openContact  = useCallback(() => setContactOpen(true),  []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      <div className={`transition-opacity duration-600 ${splashDone ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar onRequestDemo={openContact} />

        <main>
          <Hero onRequestDemo={openContact} />
          <Suspense fallback={<SectionFallback />}><FeaturesSticky /></Suspense>
          <Suspense fallback={<SectionFallback />}><StatsBar /></Suspense>
          <Suspense fallback={<SectionFallback />}><HowItWorks /></Suspense>
          <Suspense fallback={<SectionFallback />}><Pricing onRequestDemo={openContact} /></Suspense>
          <Suspense fallback={<SectionFallback />}><Testimonials /></Suspense>
          <Suspense fallback={<SectionFallback />}><CTABanner onRequestDemo={openContact} /></Suspense>
        </main>

        <Suspense fallback={<SectionFallback />}><Footer /></Suspense>
      </div>

      <ContactModal isOpen={contactOpen} onClose={closeContact} />
    </>
  );
}

/** Page transition wrapper used at the route level */
function RouteTransitionWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={   { opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Marketing Site */}
        <Route path="/" element={<RouteTransitionWrapper><MarketingSite /></RouteTransitionWrapper>} />

        {/* ERP Portal */}
        <Route path="/dashboard/login" element={<RouteTransitionWrapper><Login /></RouteTransitionWrapper>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardShell />}>
            <Route index                  element={<DashboardHome />} />
            <Route path="farmers"         element={<FarmerManagement />} />
            <Route path="inventory"       element={<Inventory />} />
            <Route path="udhaar"          element={<Udhaar />} />
            <Route path="analytics"       element={<Analytics />} />
            <Route path="crop-calendar"   element={<CropCalendar />} />
            <Route path="chat"            element={<AIChat />} />
            <Route path="settings"        element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DashboardProvider>
          <AnimatedRoutes />
        </DashboardProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
