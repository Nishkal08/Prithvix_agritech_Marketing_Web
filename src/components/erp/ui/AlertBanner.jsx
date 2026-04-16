import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

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
        className="bg-gold/10 border border-gold/30 border-l-[3px] border-l-gold rounded-lg px-5 py-3.5 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle size={16} className="text-gold shrink-0" />
          <p className="text-sm font-medium text-dark">
            <span className="font-bold">{count} farmers</span> are overdue on credit repayment.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onViewOverdue}
            className="text-gold text-xs font-semibold underline hover:no-underline transition-all"
          >
            View Overdue
          </button>
          <button
            onClick={handleDismiss}
            className="text-gold/70 hover:text-gold transition-colors"
            aria-label="Dismiss alert"
          >
            <X size={15} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
