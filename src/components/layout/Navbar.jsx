import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function Navbar({ onRequestDemo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const { t, lang, switchLanguage, languages } = useLanguage();
  const langRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { label: t.nav.features, href: '#features' },
    { label: t.nav.howItWorks, href: '#how-it-works' },
    { label: t.nav.pricing, href: '#pricing' },
    { label: t.nav.about, href: '#about' },
  ];

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50 px-4 md:px-8 mt-4 md:mt-6 flex justify-center pointer-events-none">
        <nav
          className={`pointer-events-auto transition-all duration-300 w-full max-w-5xl rounded-full shadow-lg ${
            scrolled
              ? 'bg-forest/95 backdrop-blur-md border border-offwhite/10'
              : 'bg-forest border border-transparent'
          }`}
          style={{ height: 68 }}
        >
          <div className="px-6 h-full flex items-center justify-between">
            {/* Logo */}
            <Logo
              size="sm"
              variant="light"
            />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="relative font-body font-medium text-[15px] text-offwhite/80 hover:text-gold transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-250 ease-out" />
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-1.5 font-body text-sm text-offwhite/80 hover:text-gold transition-colors px-2 py-1"
                aria-label="Select language"
              >
                <span>{languages.find((l) => l.code === lang)?.flag}</span>
                <span>{languages.find((l) => l.code === lang)?.display}</span>
                <ChevronDown size={14} className={`transition-transform ${langDropdown ? 'rotate-180 text-gold' : ''}`} />
              </button>
              <AnimatePresence>
                {langDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-4 bg-forest border border-offwhite/10 rounded-2xl shadow-xl overflow-hidden min-w-[140px]"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { switchLanguage(l.code); setLangDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-body flex items-center gap-2 hover:bg-[#122b1e] transition-colors ${
                          lang === l.code ? 'text-gold font-medium bg-[#122b1e]' : 'text-offwhite/80'
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/dashboard" 
              className="font-body text-sm font-medium text-offwhite/80 hover:text-gold transition-colors mr-2 pointer-events-auto"
            >
              Dealer Login
            </Link>

            <Button variant="primary" size="sm" onClick={onRequestDemo}>
              {t.nav.requestDemo}
            </Button>
          </div>


          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-offwhite hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-dark flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => scrollTo(link.href)}
                  className="font-display font-semibold text-[32px] text-offwhite hover:text-gold transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
            <div className="mt-12 flex flex-col items-center gap-4">
              {/* Language switch in mobile */}
              <div className="flex gap-3 mb-4">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => switchLanguage(l.code)}
                    className={`px-3 py-1.5 text-sm font-body rounded transition-colors ${
                      lang === l.code ? 'bg-gold text-dark' : 'text-offwhite/60 hover:text-offwhite'
                    }`}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3 w-full px-8">
                <Button variant="primary" size="md" onClick={() => { setMobileOpen(false); onRequestDemo(); }}>
                  {t.nav.requestDemo}
                </Button>
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileOpen(false)}
                  className="w-full bg-white/10 text-offwhite font-display font-semibold py-4 rounded-xl text-center hover:bg-white/20 transition-colors"
                >
                  Dealer Portal Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
