import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SectionLabel from '../ui/SectionLabel';
import GrainOverlay from '../ui/GrainOverlay';
import { testimonials } from '../../data/testimonials';
import { useLanguage } from '../../context/LanguageContext';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { t } = useLanguage();

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  const card = testimonials[current];
  const translatedCard = t.testimonials.items?.[current] || card;

  return (
    <section
      id="about"
      className="bg-offwhite py-24 md:py-32 relative overflow-hidden"
    >
      <GrainOverlay />
      <div className="section-container relative z-20">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel>{t.testimonials.label}</SectionLabel>
          <h2 className="section-headline font-display font-bold text-dark">
            {t.testimonials.heading}
          </h2>
        </div>

        {/* Carousel */}
        <div className="max-w-2xl mx-auto relative">
          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-surface transition-colors z-30"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} className="text-dark" />
          </button>
          <button
            onClick={next}
            className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-surface transition-colors z-30"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} className="text-dark" />
          </button>

          {/* Card */}
          <div className="overflow-hidden min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full"
              >
                <div className="bg-white border border-border rounded-xl p-8 md:p-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < card.rating ? 'text-gold fill-gold' : 'text-border'}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="font-body text-[17px] text-dark italic leading-[1.8] mb-6">
                    "{translatedCard.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-forest flex items-center justify-center">
                      <span className="font-display font-semibold text-sm text-offwhite">
                        {card.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-semibold text-[15px] text-dark">
                        {card.name}
                      </p>
                      <p className="font-body text-[13px] text-muted">
                        {card.role} · {card.location}
                      </p>
                    </div>
                    <span className="ml-auto bg-surface text-forest text-xs font-body font-medium px-3 py-1 rounded-full">
                      {card.tag}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-gold w-6' : 'bg-border'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Labels */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-16">
          {t.testimonials.trustLabels.map((label) => (
            <span
              key={label}
              className="font-body font-medium text-sm text-muted"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
