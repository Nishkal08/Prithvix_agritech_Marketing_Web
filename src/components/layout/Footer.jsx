import { ExternalLink, MessageCircle } from 'lucide-react';
import Logo from '../ui/Logo';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const columns = [
    {
      title: t.footer.product,
      links: t.footer.productLinks,
    },
    {
      title: t.footer.company,
      links: t.footer.companyLinks,
    },
    {
      title: t.footer.support,
      links: t.footer.supportLinks,
    },
  ];

  return (
    <footer className="bg-dark pt-20 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">
          {/* Brand Column */}
          <div>
            <Logo variant="light" size="md" />
            <p className="font-body text-sm text-muted mt-4 leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-muted hover:text-gold transition-colors duration-200" aria-label="X (Twitter)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="text-muted hover:text-gold transition-colors duration-200" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="text-muted hover:text-gold transition-colors duration-200" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-offwhite text-sm tracking-wider-brand uppercase mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-body text-sm text-muted hover:text-offwhite transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-forest pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-[13px] text-muted">
            {t.footer.copyright}
          </p>
          <p className="font-body text-[13px] text-muted">
            {t.footer.madeIn}
          </p>
        </div>
      </div>
    </footer>
  );
}
