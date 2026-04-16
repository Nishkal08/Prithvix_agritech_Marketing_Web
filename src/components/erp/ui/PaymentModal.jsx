import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { format } from 'date-fns';

// Toast notification
function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 bg-forest text-offwhite px-5 py-3.5 rounded-xl shadow-2xl z-[100] flex items-center gap-3 max-w-sm"
      role="alert"
      aria-live="polite"
    >
      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
        <Check size={14} className="text-forest" />
      </div>
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
}

export default function PaymentModal({ farmer, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('Cash');
  const [upiRef, setUpiRef] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (mode === 'UPI' && !upiRef.trim()) {
      setError('Please enter a UPI reference ID.');
      return;
    }
    setError('');
    onSuccess?.({ farmerId: farmer.farmerId || farmer.id, amount: num, mode, upiRef, note, date, farmerName: farmer.farmerName || farmer.name });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-panel border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl text-dark">Record Payment</h2>
            <button onClick={onClose} className="p-2 hover:bg-surface rounded-lg transition-colors">
              <X size={20} className="text-muted hover:text-dark" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Farmer (pre-filled) */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Farmer</label>
              <input value={farmer?.farmerName || farmer?.name || ''} readOnly className="w-full bg-surface/50 border border-border rounded-lg px-4 py-2.5 text-sm text-muted cursor-not-allowed" />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full border border-border bg-surface text-dark rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:bg-panel"
                />
              </div>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Payment Mode</label>
              <div className="flex gap-2">
                {['Cash', 'UPI'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                      mode === m ? 'bg-dark text-offwhite border-dark' : 'border-border text-muted hover:bg-surface hover:text-dark'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI Reference (conditional) */}
            <AnimatePresence>
              {mode === 'UPI' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 pt-2">UPI Reference ID</label>
                  <input
                    value={upiRef}
                    onChange={(e) => setUpiRef(e.target.value)}
                    placeholder="TXNID123456"
                    className="w-full border border-border bg-surface text-dark rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:bg-panel"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Payment for seed purchase..."
                rows={2}
                className="w-full border border-border bg-surface text-dark rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none focus:bg-panel"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-border bg-surface text-dark rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:bg-panel"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gold text-dark font-display font-semibold py-3 rounded-xl hover:bg-gold/90 transition-colors mt-2"
            >
              Record Payment
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { Toast };
