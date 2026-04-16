import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Phone, Store, MapPin, MessageSquare } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

export default function ContactModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    shopName: '',
    location: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', shopName: '', location: '', message: '' });
      onClose();
    }, 2500);
  };

  const fields = [
    { name: 'name', label: t.contact.fields.name, icon: User, type: 'text', required: true, placeholder: t.contact.placeholders.name },
    { name: 'email', label: t.contact.fields.email, icon: Mail, type: 'email', required: true, placeholder: t.contact.placeholders.email },
    { name: 'phone', label: t.contact.fields.phone, icon: Phone, type: 'tel', required: true, placeholder: t.contact.placeholders.phone },
    { name: 'shopName', label: t.contact.fields.shopName, icon: Store, type: 'text', required: false, placeholder: t.contact.placeholders.shopName },
    { name: 'location', label: t.contact.fields.location, icon: MapPin, type: 'text', required: false, placeholder: t.contact.placeholders.location },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className="bg-offwhite rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors"
                aria-label="Close"
              >
                <X size={16} className="text-dark" />
              </button>

              <div className="p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
                      <Send size={24} className="text-forest" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-dark">
                      {t.contact.successHeading}
                    </h3>
                    <p className="font-body text-sm text-muted mt-2">
                      {t.contact.successSubtext}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="mb-6">
                      <span className="font-body text-[11px] text-gold font-medium uppercase tracking-widest-brand">
                        {t.contact.label}
                      </span>
                      <h3 className="font-display font-bold text-2xl text-dark mt-1">
                        {t.contact.heading}
                      </h3>
                      <p className="font-body text-sm text-muted mt-1">
                        {t.contact.subtext}
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {fields.map((field) => {
                        const Icon = field.icon;
                        return (
                          <div key={field.name}>
                            <label className="font-body text-xs text-dark/70 font-medium mb-1.5 block">
                              {field.label} {field.required && <span className="text-gold">*</span>}
                            </label>
                            <div className="relative">
                              <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                              <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                                placeholder={field.placeholder}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg font-body text-sm text-dark placeholder:text-muted/50 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition-colors"
                              />
                            </div>
                          </div>
                        );
                      })}

                      {/* Message */}
                      <div>
                        <label className="font-body text-xs text-dark/70 font-medium mb-1.5 block">
                          {t.contact.fields.message}
                        </label>
                        <div className="relative">
                          <MessageSquare size={16} className="absolute left-3 top-3.5 text-muted" />
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={3}
                            placeholder={t.contact.placeholders.message}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg font-body text-sm text-dark placeholder:text-muted/50 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition-colors resize-none"
                          />
                        </div>
                      </div>

                      <Button type="submit" variant="primary" size="md" className="w-full mt-2">
                        {t.contact.button}
                      </Button>

                      <p className="font-body text-[11px] text-muted text-center mt-2">
                        {t.contact.footer}
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
