import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLabel from '../ui/SectionLabel';
import { features } from '../../data/features';
import { useLanguage } from '../../context/LanguageContext';
import {
  FarmerCardMockup,
  FieldVisitMockup,
  UdhaarMockup,
  InventoryMockup,
  AnalyticsMockup,
  AIChatMockup,
} from './FeatureMockups';

gsap.registerPlugin(ScrollTrigger);

const mockupComponents = {
  FarmerCardMockup,
  FieldVisitMockup,
  UdhaarMockup,
  InventoryMockup,
  AnalyticsMockup,
  AIChatMockup,
};

export default function FeaturesSticky() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const { t } = useLanguage();

  useEffect(() => {
    if (isMobile) return;

    const sections = containerRef.current?.querySelectorAll('.scroll-trigger-area');
    if (!sections?.length) return;

    const triggers = [];

    sections.forEach((section, i) => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveIndex(i),
        onEnterBack: () => setActiveIndex(i),
      });
      triggers.push(st);
    });

    return () => triggers.forEach((st) => st.kill());
  }, [isMobile]);

  const ActiveMockup = mockupComponents[features[activeIndex]?.mockup];

  // Mobile layout — stacked
  if (isMobile) {
    return (
      <section id="features" className="bg-offwhite py-24">
        <div className="section-container">
          <SectionLabel>{t.features.label}</SectionLabel>
          <h2 className="section-headline font-display font-bold text-dark mb-16">
            {t.features.heading}
          </h2>
          <div className="space-y-16">
            {features.map((feature, i) => {
              const Mockup = mockupComponents[feature.mockup];
              const translatedFeature = t.features.items?.[i] || feature;
              return (
                <div key={feature.id} className="space-y-6">
                  <div>
                    <span className="font-display font-bold text-gold text-sm">{feature.id}</span>
                    <h3 className="sub-headline font-display font-semibold text-dark mt-2">
                      {translatedFeature.headline}
                    </h3>
                    <p className="font-body text-muted mt-3 leading-relaxed">
                      {translatedFeature.body}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <PhoneFrame>
                      {Mockup && <Mockup />}
                    </PhoneFrame>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Desktop — sticky scroll
  return (
    <section id="features" ref={containerRef} className="bg-offwhite relative">
      <div style={{ height: `${features.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex items-center">
          <div className="section-container flex gap-12 w-full">
            {/* Left Panel — Feature Nav */}
            <div className="w-[40%] flex flex-col justify-center">
              <SectionLabel>{t.features.label}</SectionLabel>
              <h2 className="section-headline font-display font-bold text-dark mb-12">
                {t.features.heading}
              </h2>
              <div className="space-y-4">
                {features.map((feature, i) => {
                  const translatedFeature = t.features.items?.[i] || feature;
                  return (
                  <div
                    key={feature.id}
                    className={`py-4 pl-4 border-l-2 transition-all duration-300 cursor-pointer ${
                      activeIndex === i
                        ? 'border-gold text-dark'
                        : 'border-transparent text-muted'
                    }`}
                    onClick={() => setActiveIndex(i)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-display font-bold text-sm ${
                        activeIndex === i ? 'text-gold' : 'text-muted/40'
                      }`}>
                        {feature.id}
                      </span>
                      <span className={`font-display text-base ${
                        activeIndex === i ? 'font-semibold' : 'font-normal'
                      }`}>
                        {translatedFeature.title}
                      </span>
                    </div>
                    <AnimatePresence>
                      {activeIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="font-body text-sm text-muted mt-2 leading-relaxed pl-8">
                            {translatedFeature.body}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )})}
              </div>
            </div>

            {/* Right Panel — Mockup Display */}
            <div className="w-[60%] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <PhoneFrame>
                      {ActiveMockup && <ActiveMockup />}
                    </PhoneFrame>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Invisible trigger sections for ScrollTrigger */}
        {features.map((_, i) => (
          <div
            key={i}
            className="scroll-trigger-area"
            style={{ height: '100vh', position: 'absolute', top: `${i * 100}vh`, left: 0, width: '100%', pointerEvents: 'none' }}
          />
        ))}
      </div>
    </section>
  );
}

function PhoneFrame({ children }) {
  return (
    <div className="relative w-[280px] h-[560px] rounded-[2rem] border-2 border-dark/20 shadow-lg bg-white overflow-hidden">
      {/* Status bar */}
      <div className="h-8 bg-dark/5 flex items-center justify-center">
        <div className="w-20 h-1.5 bg-dark/10 rounded-full" />
      </div>
      {/* Screen content */}
      <div className="p-4 h-[calc(100%-2rem)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
