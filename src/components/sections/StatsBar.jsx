import { useRef, useEffect } from 'react';
import { Users, Globe, Star, MapPin } from 'lucide-react';
import CountUp from 'react-countup';
import { useLanguage } from '../../context/LanguageContext';

const iconMap = {
  Users: Users,
  Globe: Globe,
  Star: Star,
  MapPin: MapPin,
};

export default function StatsBar() {
  const { t } = useLanguage();
  const stats = [
    { value: 2000,  suffix: '+', label: 'Farmers Registered',  icon: 'Users' },
    { value: 5,     suffix: '',  label: 'Languages Supported', icon: 'Globe' },
    { value: 98,    suffix: '%', label: 'Dealer Satisfaction',  icon: 'Star' },
    { value: 10000, suffix: '+', label: 'Field Visits Logged', icon: 'MapPin' },
  ];

  return (
    <section className="bg-dark py-20 relative overflow-hidden">
      <div className="section-container">
        {/* Heading */}
        <p className="font-display font-semibold text-xl text-offwhite text-center mb-16 tracking-wider-brand">
          {t.stats.heading}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => {
            const Icon = iconMap[stat.icon];
            const translatedLabel = t.stats.items?.[i]?.label || stat.label;
            return (
              <div
                key={stat.label}
                className={`text-center relative ${
                  i < stats.length - 1 ? 'lg:border-r lg:border-forest' : ''
                }`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-3">
                  <Icon size={24} className="text-gold" />
                </div>
                {/* Number */}
                <div className="font-display font-bold text-gold" style={{ fontSize: 'clamp(48px, 5vw, 72px)' }}>
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    suffix={stat.suffix}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                {/* Label */}
                <p className="font-body font-medium text-[15px] text-muted mt-2">
                  {translatedLabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
