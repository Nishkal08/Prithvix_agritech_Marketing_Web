import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Leaf, Globe } from 'lucide-react';
import Button from '../ui/Button';
import CropField from '../3d/CropField';
import { useLanguage } from '../../context/LanguageContext';

export default function Hero({ onRequestDemo }) {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);
  const trustRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Label
      tl.from(labelRef.current, { opacity: 0, y: 20, duration: 0.7 }, 0.1);

      // Headline words
      const words = headlineRef.current?.querySelectorAll('.word-wrap');
      if (words?.length) {
        tl.from(words, { opacity: 0, y: 30, stagger: 0.12, duration: 0.7 }, 0.2);
      }

      // Subtext
      tl.from(subtextRef.current, { opacity: 0, duration: 0.8 }, 0.6);

      // CTAs
      const ctas = ctaRef.current?.children;
      if (ctas?.length) {
        tl.from(ctas, { opacity: 0, y: 15, stagger: 0.1, duration: 0.6 }, 0.9);
      }

      // Trust row
      tl.from(trustRef.current, { opacity: 0, duration: 0.6 }, 1.1);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const trustIcons = [
    { icon: <Leaf size={14} />, text: t.hero.trust[0] },
    { icon: <Globe size={14} />, text: t.hero.trust[1] },
    { icon: null, text: t.hero.trust[2] },
  ];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="min-h-screen bg-offwhite pt-20 pb-16 md:pt-28 md:pb-24 relative overflow-hidden flex items-center"
    >
      <div className="section-container flex flex-col lg:flex-row items-center gap-12 lg:gap-8 w-full">
        {/* Left — Text Content (55%) */}
        <div className="w-full lg:w-[55%] relative z-10">
          {/* Label */}
          <div ref={labelRef}>
            <span className="font-body font-medium text-[13px] text-gold uppercase tracking-widest-brand">
              {t.hero.label}
            </span>
          </div>

          {/* Headline */}
          <h1 ref={headlineRef} className="hero-headline font-display font-bold text-dark mt-5">
            {t.hero.headline.map((line, i) => (
              <span key={i} className="word-wrap block">
                {i === t.hero.headline.length - 1 ? (
                  <>
                    {line.replace(/\S+\.$/, '')}<span className="text-gold">{line.match(/\S+\.$/)?.[0]}</span>
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="font-body text-lg text-muted mt-6 max-w-[480px] leading-relaxed"
          >
            {t.hero.subtext}
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 mt-10">
            <Button variant="primary" size="md" onClick={onRequestDemo}>
              {t.hero.cta1}
            </Button>
            <Button variant="secondary" size="md">
              {t.hero.cta2}
            </Button>
          </div>

          {/* Trust row */}
          <div
            ref={trustRef}
            className="flex flex-wrap items-center gap-6 mt-8"
          >
            {trustIcons.map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 font-body font-medium text-[13px] text-muted"
              >
                {item.icon && <span className="text-gold">{item.icon}</span>}
                {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* Right — 3D Canvas (45%) */}
        <div className="relative w-full lg:w-[45%] h-[280px] md:h-[420px] lg:h-[560px]">
          <CropField className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
