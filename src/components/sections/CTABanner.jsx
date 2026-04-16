import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '../ui/Button';
import GrainOverlay from '../ui/GrainOverlay';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function CTABanner({ onRequestDemo }) {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading words stagger
      const words = headlineRef.current?.querySelectorAll('.cta-word');
      if (words?.length) {
        gsap.from(words, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = t.cta.heading.split(' ');

  return (
    <section
      ref={sectionRef}
      className="bg-forest py-24 relative overflow-hidden"
    >
      <GrainOverlay />
      <div className="section-container relative z-20 text-center">
        {/* Eyebrow */}
        <p className="font-body font-medium text-sm text-gold tracking-wider-brand mb-4">
          {t.cta.eyebrow}
        </p>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="section-headline font-display font-bold text-offwhite max-w-3xl mx-auto"
        >
          {headlineWords.map((word, i) => (
            <span key={i} className="cta-word inline-block mr-[0.3em]">
              {word}
            </span>
          ))}
        </h2>

        {/* Subtext */}
        <p className="font-body text-[17px] text-offwhite/60 mt-6 max-w-md mx-auto">
          {t.cta.subtext}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Button variant="primary" size="md" onClick={onRequestDemo}>
            {t.cta.cta1}
          </Button>
          <Button variant="secondary-light" size="md" onClick={() => window.open('#', '_blank')}>
            {t.cta.cta2}
          </Button>
        </div>
      </div>
    </section>
  );
}
