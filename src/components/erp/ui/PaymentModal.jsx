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
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-8 right-8 bg-forest border border-gold text-gold px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] flex items-center gap-4 max-w-sm backdrop-blur-md"
      role="alert"
      aria-live="polite"
    >
      <div className="w-8 h-8 rounded-full bg-gold text-forest flex items-center justify-center shrink-0 shadow-lg">
        <Check size={18} strokeWidth={3} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">Notification</p>
        <p className="text-sm font-bold tracking-tight">{message}</p>
      </div>
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
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-secondary border border-subtle rounded-3xl w-full max-w-md p-8 shadow-[0_32px_64px_rgba(0,0,0,0.2)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl text-primary tracking-tight">Record Payment</h2>
              <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mt-1">Manual Ledger Entry</p>
            </div>
            <button onClick={onClose} className="p-2.5 bg-tertiary hover:bg-gold/20 text-secondary hover:text-primary rounded-xl transition-all border border-subtle">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Farmer (pre-filled) */}
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">Farmer Account</label>
              <input value={farmer?.farmerName || farmer?.name || ''} readOnly className="w-full bg-tertiary border border-subtle rounded-xl px-4 py-3 text-sm text-primary font-bold cursor-not-allowed shadow-inner" />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold text-lg font-bold">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-tertiary border border-subtle rounded-xl pl-10 pr-4 py-4 text-lg font-mono font-bold text-primary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">Payment Channel</label>
              <div className="flex gap-3">
                {['Cash', 'UPI'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all shadow-sm ${
                      mode === m ? 'bg-gold text-dark border-gold scale-[1.02]' : 'bg-tertiary border-subtle text-secondary hover:text-primary hover:bg-tertiary/80'
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
                  className="space-y-2"
                >
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest px-1">UPI Reference ID</label>
                  <input
                    value={upiRef}
                    onChange={(e) => setUpiRef(e.target.value)}
                    placeholder="Enter TXN ID"
                    className="w-full bg-tertiary border border-subtle rounded-xl px-4 py-3 text-sm text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/30 shadow-inner"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Note */}
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Details of transaction..."
                rows={2}
                className="w-full bg-tertiary border border-subtle rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-gold/30 shadow-inner resize-none"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">Transaction Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-tertiary border border-subtle rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-gold/30 shadow-inner"
              />
            </div>

            {error && <p className="text-[#D44A4A] text-xs font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gold text-dark font-bold py-4 rounded-xl hover:scale-[1.02] transition-all shadow-lg active:scale-95 mt-4 uppercase tracking-widest text-xs"
            >
              Confirm & Record Entry
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { Toast };
