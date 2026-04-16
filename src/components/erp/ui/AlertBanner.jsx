import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
        className="bg-[#FDF3D0] border-l-[3px] border-[#D4A853] rounded-lg px-5 py-3.5 flex items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-[#D4A853] text-lg">⚠</span>
          <p className="text-sm font-medium text-[#7C5C1A]">
            <span className="font-bold">{count} farmers</span> are overdue on credit repayment.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onViewOverdue}
            className="text-[#7C5C1A] text-xs font-semibold underline hover:no-underline transition-all"
          >
            View Overdue
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
