import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

export default function AlertBanner({ count = 3, onViewOverdue, onDismiss }) {
  const [dismissed, setDismissed] = useState(
    sessionStorage.getItem('overdueAlertDismissed') === 'true'
  );

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem('overdueAlertDismissed', 'true');
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="bg-[#FDF3D0] dark:bg-[#2C2410] border border-[#D4A853]/30 rounded-xl p-4 flex items-center justify-between shadow-sm mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#D4A853]/20 flex items-center justify-center text-[#D4A853]">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#7C5C1A] dark:text-[#F0D898]">Action Required</h4>
            <p className="text-[13px] text-[#7C5C1A]/80 dark:text-[#F0D898]/80 mt-0.5">You have {count} farmers with overdue payments. Please follow up today.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onViewOverdue}
            className="text-xs font-bold uppercase tracking-wider text-[#7C5C1A] dark:text-[#F0D898] hover:underline"
          >
            View All
          </button>
          <button
            onClick={handleDismiss}
            className="text-[#D4A853] hover:text-[#7C5C1A] transition-colors"
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
