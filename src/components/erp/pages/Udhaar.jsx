import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import PageTransition from '../ui/PageTransition';
import FarmerAvatar from '../ui/FarmerAvatar';
import StatusBadge from '../ui/StatusBadge';
import SkeletonRow from '../ui/SkeletonRow';
import PaymentModal, { Toast } from '../ui/PaymentModal';
import { udhaarData as initialData } from '../../../data/erp/udhaar';

export default function Udhaar() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const displayed = activeTab === 'overdue'
    ? data.filter(d => d.daysOverdue >= 30)
    : data;

  const totalExposure = data.reduce((acc, d) => acc + d.amountDue, 0);
  const overdueAmount = data.filter(d => d.daysOverdue >= 30).reduce((acc, d) => acc + d.amountDue, 0);

  const handlePaymentSuccess = ({ farmerId, amount, farmerName }) => {
    setData(prev => prev.map(d =>
      d.farmerId === farmerId
        ? { ...d, amountDue: Math.max(0, d.amountDue - amount), lastPaymentDate: format(new Date(), 'yyyy-MM-dd'), lastPaymentAmount: amount }
        : d
    ).filter(d => d.amountDue > 0));
    setToast(`Payment of ₹${amount.toLocaleString('en-IN')} recorded for ${farmerName}`);
  };

  const getDaysStatus = (days) => {
    if (days === 0) return 'Clear';
    if (days < 30) return 'Due';
    return 'Overdue';
  };

  return (
    <PageTransition>
      <div className="space-y-5">
        {/* Header */}
        <h1 className="font-display font-bold text-2xl text-dark">Udhaar / Credit</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Credit Exposure', value: `₹${totalExposure.toLocaleString('en-IN')}`, color: 'text-dark' },
            { label: 'Overdue (30+ days)', value: `₹${overdueAmount.toLocaleString('en-IN')}`, color: 'text-[#D44A4A]' },
            { label: 'Farmers with Dues', value: data.length, color: 'text-[#D4A853]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-[#E8E3DA] rounded-xl p-5">
              <p className="text-[12px] text-muted mb-2">{label}</p>
              <p className={`font-display font-bold text-3xl ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E8E3DA] relative">
          {[
            { id: 'all', label: 'All Dues' },
            { id: 'overdue', label: `Overdue (30+ days)` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-gold text-dark' : 'border-transparent text-muted hover:text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Credit Table */}
        <div className="bg-white border border-[#E8E3DA] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F0E8] border-b border-[#E8E3DA]">
                  {['Farmer', 'Amount Due', 'Days Overdue', 'Last Payment', 'Credit Usage', 'Action'].map(h => (
                    <th key={h} scope="col" className="px-4 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                ) : displayed.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-muted text-sm">
                      <div className="text-4xl mb-3">✓</div>
                      <p className="font-semibold text-[#2D9E5A] text-base">All clear! No outstanding dues.</p>
                      <p className="text-muted text-sm mt-1">All farmers are up to date.</p>
                    </td>
                  </tr>
                ) : (
                  displayed
                    .sort((a, b) => b.amountDue - a.amountDue)
                    .map((row, i) => {
                      const utilPct = Math.min(100, Math.round((row.amountDue / row.creditLimit) * 100));
                      const daysStatus = getDaysStatus(row.daysOverdue);
                      return (
                        <tr key={row.farmerId} className={`border-b border-[#F5F0E8] last:border-0 ${i % 2 === 1 ? 'bg-[#FAFAF8]' : 'bg-white'}`} style={{ height: '52px' }}>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-3">
                              <FarmerAvatar initials={row.avatar} size="sm" />
                              <div>
                                <p className="font-medium text-sm text-dark">{row.farmerName}</p>
                                <p className="text-[12px] text-muted">{row.village}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <span className="font-mono font-bold text-sm text-[#D44A4A]">₹{row.amountDue.toLocaleString('en-IN')}</span>
                          </td>
                          <td className="px-4 py-2">
                            <StatusBadge status={daysStatus} />
                            {row.daysOverdue > 0 && (
                              <p className="text-[11px] text-muted mt-0.5">{row.daysOverdue} days</p>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <p className="text-sm text-dark">{row.lastPaymentDate && row.lastPaymentDate !== 'N/A' ? format(new Date(row.lastPaymentDate), 'dd MMM yyyy') : 'N/A'}</p>
                            {row.lastPaymentAmount > 0 && <p className="text-[12px] text-muted">₹{row.lastPaymentAmount.toLocaleString('en-IN')}</p>}
                          </td>
                          <td className="px-4 py-2 w-40">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-[#EDE8DF] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${utilPct}%`,
                                    backgroundColor: utilPct >= 80 ? '#D44A4A' : utilPct >= 50 ? '#D4A853' : '#1A3C2B'
                                  }}
                                />
                              </div>
                              <span className="text-[11px] text-muted shrink-0">{utilPct}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => setSelectedFarmer(row)}
                              className="text-xs bg-[#EDE8DF] hover:bg-[#D4A853]/20 text-dark font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                            >
                              Record Payment
                            </button>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {selectedFarmer && (
          <PaymentModal
            farmer={selectedFarmer}
            onClose={() => setSelectedFarmer(null)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      </AnimatePresence>
    </PageTransition>
  );
}
