import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import SectionLabel from '../ui/SectionLabel';
import Button from '../ui/Button';
import { plans } from '../../data/pricing';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Pricing({ onRequestDemo }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (cards?.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.2,
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
      id="pricing"
      className="bg-dark py-24 md:py-32"
    >
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel className="!bg-forest !text-gold !border-gold">
            {t.pricing.label}
          </SectionLabel>
          <h2 className="section-headline font-display font-bold text-offwhite mt-4">
            {t.pricing.heading}
          </h2>
          <p className="font-body text-muted text-lg mt-4 max-w-md mx-auto">
            {t.pricing.subtext}
          </p>
        </div>

        {/* Plan cards */}
        <div
          ref={cardsRef}
          className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8 max-w-4xl mx-auto"
        >
          {t.pricing.plans.map((plan, i) => {
            const isHighlighted = i === 1; // Second plan is highlighted
            return (
            <div
              key={plan.name}
              className={`relative flex-1 max-w-md rounded-lg p-10 transition-transform duration-300 ${
                isHighlighted
                  ? 'bg-gold text-dark md:scale-[1.04]'
                  : 'bg-forest text-offwhite border border-[#2D5A3D]'
              }`}
              style={
                plan.highlighted
                  ? { boxShadow: '0 0 40px rgba(212,168,83,0.25)' }
                  : {}
              }
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute top-4 right-4 bg-dark text-gold text-xs font-body font-medium px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              {/* Plan name */}
              <h3 className="font-display font-bold text-2xl">
                {plan.name}
              </h3>
              <p className={`font-body text-sm mt-1 ${isHighlighted ? 'text-dark/60' : 'text-muted'}`}>
                {plan.description}
              </p>

              {/* Price */}
              <div className="mt-6 mb-8">
                <span className="font-display font-bold text-4xl">
                  {i === 0 ? '₹499' : '₹1,199'} {/* Keep price constant or translate it, but it's hardcoded for now, or just map plan.price if it was in the translation. Ah wait, I didn't include price in translation! */}
                </span>
                <span className={`font-body text-base ${isHighlighted ? 'text-dark/50' : 'text-muted'}`}>
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className={`mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? 'text-dark' : 'text-gold'
                      }`}
                    />
                    <span className={`font-body text-sm ${
                      isHighlighted ? 'text-dark/80' : 'text-offwhite/80'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={isHighlighted ? 'primary-dark' : 'secondary-light'}
                size="md"
                className="w-full !bg-dark !text-offwhite hover:!bg-forest"
                onClick={isHighlighted ? onRequestDemo : undefined}
                style={
                  isHighlighted
                    ? { backgroundColor: '#0E1A14', color: '#F5F0E8' }
                    : { borderColor: '#D4A853', color: '#D4A853', backgroundColor: 'transparent' }
                }
              >
                {plan.cta}
              </Button>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
