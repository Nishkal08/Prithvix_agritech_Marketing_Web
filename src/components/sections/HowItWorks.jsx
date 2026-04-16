import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Store, Users, ClipboardList, BarChart3, ArrowRight } from 'lucide-react';
import SectionLabel from '../ui/SectionLabel';
import GrainOverlay from '../ui/GrainOverlay';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const icons = [Store, Users, ClipboardList, BarChart3];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const lineRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards stagger entrance
      const cards = cardsRef.current?.children;
      if (cards?.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Connecting line draws
      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="bg-offwhite py-24 md:py-32 relative overflow-hidden"
    >
      <GrainOverlay />
      <div className="section-container relative z-20">
        <div className="text-center mb-16">
          <SectionLabel>{t.howItWorks.label}</SectionLabel>
          <h2 className="section-headline font-display font-bold text-dark">
            {t.howItWorks.heading}
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div
            ref={lineRef}
            className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[1px] border-t-2 border-dashed border-border z-0"
          />

          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10"
          >
            {t.howItWorks.steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <div
                  key={i}
                  className="bg-white border border-border rounded-3xl p-8 relative group hover:shadow-md transition-shadow duration-300"
                >
                  {/* Decorative step number */}
                  <span className="font-display font-bold text-5xl text-gold/20 absolute top-4 right-4">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-5">
                    <Icon size={22} className="text-forest" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-semibold text-lg text-dark mb-2">
                    {step.title}
                  </h3>

                  {/* Body */}
                  <p className="font-body text-[15px] text-muted leading-relaxed">
                    {step.body}
                  </p>

                  {/* Step tag */}
                  <div className="mt-5 pt-4 border-t border-border/50">
                    <span className="font-body text-xs text-muted/60 uppercase tracking-wider">
                      Step {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Arrow (on desktop, except last) */}
                  {i < 3 && (
                    <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-offwhite rounded-full items-center justify-center border border-border">
                      <ArrowRight size={14} className="text-gold" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
