import { useState, useEffect, useMemo, useContext } from 'react';
import { Eye, X, Download, Printer, QrCode as QrCodeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import PageTransition from '../ui/PageTransition';
import FarmerAvatar from '../ui/FarmerAvatar';
import LoyaltyBadge from '../ui/LoyaltyBadge';
import StatusBadge from '../ui/StatusBadge';
import SkeletonRow from '../ui/SkeletonRow';
import { farmers } from '../../../data/erp/farmers';
import { AuthContext } from '../../../context/AuthContext';

// --- FARMER DETAIL PANEL ---
function FarmerDetailPanel({ farmer, onClose }) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Profile');
  const tabs = ['Profile', 'Visit History', 'Credit Ledger', 'QR Card'];

  if (!farmer) return null;

  const handleDownloadQR = () => {
    const svg = document.getElementById('farmer-qr-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 200; canvas.height = 200;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = `${farmer.id}-QR.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-dark/30 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      <motion.aside
        key="panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-secondary z-50 shadow-2xl flex flex-col overflow-hidden border-l border-subtle"
      >
        {/* Header */}
        <div className="p-5 border-b border-subtle flex items-start gap-4">
          <FarmerAvatar initials={farmer.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-bold text-xl text-primary">{farmer.name}</h2>
              <LoyaltyBadge tier={farmer.loyaltyTier} />
            </div>
            <p className="text-secondary text-sm mt-0.5">{farmer.village}</p>
            <p className="text-secondary/60 text-xs font-mono mt-0.5 uppercase tracking-tight">{farmer.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-tertiary rounded-lg transition-colors text-secondary hover:text-primary">
            <X size={20} />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 divide-x divide-subtle border-b border-subtle bg-tertiary">
          {[
            { label: 'Total Visits', value: farmer.totalVisits },
            { label: 'Outstanding', value: farmer.outstandingAmount > 0 ? `₹${farmer.outstandingAmount.toLocaleString('en-IN')}` : '₹0' },
            { label: 'Member Since', value: format(new Date(farmer.registeredAt), 'MMM yy') },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 text-center">
              <p className="font-display font-bold text-lg text-primary">{value}</p>
              <p className="text-[11px] text-secondary mt-0.5 font-medium uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-subtle shrink-0 overflow-x-auto bg-secondary">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t ? 'border-gold text-primary bg-gold/5' : 'border-transparent text-secondary hover:text-primary hover:bg-tertiary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin' }}>
          {activeTab === 'Profile' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[11px] text-secondary/60 mb-1 uppercase tracking-wider font-semibold">Mobile</p><p className="text-sm font-medium text-primary">{farmer.mobile}</p></div>
                <div><p className="text-[11px] text-secondary/60 mb-1 uppercase tracking-wider font-semibold">Crop Cycle</p><p className="text-sm font-medium text-primary">{farmer.cropCycle}</p></div>
                <div><p className="text-[11px] text-secondary/60 mb-1 uppercase tracking-wider font-semibold">Credit Status</p><StatusBadge status={farmer.creditStatus} /></div>
                <div><p className="text-[11px] text-secondary/60 mb-1 uppercase tracking-wider font-semibold">Last Visit</p><p className="text-sm font-medium text-primary">{farmer.lastVisit ? formatDistanceToNow(new Date(farmer.lastVisit), { addSuffix: true }) : 'N/A'}</p></div>
              </div>
              <div>
                <p className="text-[11px] text-secondary/60 mb-1 uppercase tracking-wider font-semibold">Address</p>
                <p className="text-sm text-primary leading-relaxed">{farmer.address}</p>
              </div>
              <div>
                <p className="text-[11px] text-secondary/60 mb-1 uppercase tracking-wider font-semibold">Crops</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {farmer.crops.map(c => (
                    <span key={c} className="text-xs bg-tertiary text-secondary px-3 py-1 rounded-full border border-subtle">{c}</span>
                  ))}
                </div>
              </div>
              {farmer.notes && (
                <div>
                  <p className="text-[11px] text-secondary/60 mb-1 uppercase tracking-wider font-semibold">Notes</p>
                  <p className="text-sm text-secondary italic border-l-2 border-gold/30 pl-3">"{farmer.notes}"</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Visit History' && (
            <div className="space-y-4">
              {farmer.visitHistory?.length > 0 ? farmer.visitHistory.map((v, i) => (
                <div key={i} className="border-l-[3px] border-gold bg-tertiary/50 p-3 rounded-r-lg">
                  <p className="text-[11px] font-bold text-gold uppercase tracking-wider mb-1">{format(new Date(v.date), 'dd MMM yyyy')}</p>
                  <p className="text-sm text-primary leading-relaxed">{v.notes}</p>
                  {v.products?.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {v.products.map(p => <span key={p} className="text-[10px] bg-secondary text-secondary border border-subtle px-2 py-0.5 rounded shadow-sm">{p}</span>)}
                    </div>
                  )}
                </div>
              )) : (
                <p className="text-center text-secondary text-sm py-8 italic">No visit records yet.</p>
              )}
            </div>
          )}

          {activeTab === 'Credit Ledger' && (
            <div className="rounded-lg border border-subtle overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-tertiary text-secondary text-[10px] font-semibold uppercase tracking-wider">
                    <th className="text-left px-3 py-2.5">Date</th>
                    <th className="text-left px-3 py-2.5">Type</th>
                    <th className="text-right px-3 py-2.5">Amount</th>
                    <th className="text-right px-3 py-2.5">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {farmer.creditLedger?.length > 0 ? farmer.creditLedger.map((tx, i) => (
                    <tr key={i} className="border-b border-subtle last:border-0 hover:bg-tertiary/30 transition-colors">
                      <td className="px-3 py-3 text-secondary text-xs">{format(new Date(tx.date), 'dd MMM yy')}</td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tx.type === 'Credit' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
                          {tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-xs text-primary">₹{tx.amount.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-3 text-right font-mono text-xs font-bold text-primary">₹{tx.balance.toLocaleString('en-IN')}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="text-center text-secondary py-8 italic font-light">No transactions yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'QR Card' && (
            <div className="flex flex-col items-center gap-5">
              <div className="bg-tertiary text-primary rounded-2xl p-6 w-full max-w-[280px] flex flex-col items-center gap-4 border border-subtle shadow-lg overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gold" />
                <div className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold">Prithvix Farmer ID</div>
                <FarmerAvatar initials={farmer.avatar} size="lg" />
                <div className="text-center">
                  <p className="font-display font-bold text-xl text-primary">{farmer.name}</p>
                  <p className="text-secondary text-xs mt-1 font-medium">{farmer.village}</p>
                  <p className="text-secondary/50 text-[10px] font-mono mt-0.5 uppercase tracking-wider">{farmer.id}</p>
                </div>
                <div className="flex gap-1.5 flex-wrap justify-center border-y border-subtle/50 py-3 w-full">
                  {farmer.crops.map(c => <span key={c} className="text-[9px] font-bold uppercase bg-forest text-gold px-2 py-1 rounded shadow-sm">{c}</span>)}
                </div>
                <div className="bg-white p-3 rounded-xl shadow-inner group-hover:scale-105 transition-transform">
                  <QRCodeSVG id="farmer-qr-svg" value={farmer.qrData} size={140} />
                </div>
              </div>

              <div className="flex gap-3 w-full max-w-[280px]">
                <button
                  onClick={handleDownloadQR}
                  className="flex-1 flex justify-center items-center gap-2 bg-gold text-dark text-sm font-bold py-2.5 rounded-lg hover:bg-gold/90 transition-colors shadow-sm"
                >
                  <Download size={16} /> QR
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex justify-center items-center gap-2 bg-secondary border border-subtle text-primary text-sm font-bold py-2.5 rounded-lg hover:bg-tertiary transition-colors shadow-sm"
                >
                  <Printer size={16} /> Print
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

// --- MAIN FARMER MANAGEMENT PAGE ---
export default function FarmerManagement() {
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [cropFilter, setCropFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [creditFilter, setCreditFilter] = useState('All');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filteredData = useMemo(() => {
    return farmers.filter(f =>
      (cropFilter === 'All' || f.cropCycle === cropFilter) &&
      (tierFilter === 'All' || f.loyaltyTier === tierFilter) &&
      (creditFilter === 'All' || f.creditStatus === creditFilter)
    );
  }, [cropFilter, tierFilter, creditFilter]);

  const columns = useMemo(() => [
    {
      id: 'farmer',
      header: 'Farmer',
      accessorFn: (row) => row.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <FarmerAvatar initials={row.original.avatar} size="sm" />
          <div>
            <p className="font-medium text-sm text-primary">{row.original.name}</p>
            <p className="text-[12px] text-secondary">{row.original.village}</p>
          </div>
        </div>
      ),
    },
    { id: 'mobile', header: 'Mobile', accessorKey: 'mobile', cell: ({ getValue }) => <span className="text-sm font-mono text-secondary">{getValue()}</span> },
    { id: 'cropCycle', header: 'Crop Cycle', accessorKey: 'cropCycle', cell: ({ getValue }) => <span className="text-sm text-primary">{getValue()}</span> },
    { id: 'loyalty', header: 'Loyalty', accessorKey: 'loyaltyTier', cell: ({ getValue }) => <LoyaltyBadge tier={getValue()} /> },
    { id: 'creditStatus', header: 'Credit', accessorKey: 'creditStatus', cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    { id: 'visits', header: 'Visits', accessorKey: 'totalVisits', cell: ({ getValue }) => <span className="text-sm text-right block text-primary font-medium">{getValue()}</span> },

    {
      id: 'outstanding', header: 'Outstanding', accessorKey: 'outstandingAmount',
      cell: ({ getValue }) => {
        const v = getValue();
        return <span className={`text-sm text-right block font-mono font-medium ${v > 0 ? 'text-[#D44A4A]' : 'text-muted'}`}>
          {v > 0 ? `₹${v.toLocaleString('en-IN')}` : '—'}
        </span>;
      }
    },
    {
      id: 'lastVisit', header: 'Last Visit', accessorKey: 'lastVisit',
      cell: ({ getValue }) => <span className="text-[12px] text-muted">{getValue() ? formatDistanceToNow(new Date(getValue()), { addSuffix: true }) : 'Never'}</span>
    },
    {
      id: 'actions', header: '', accessorKey: 'id',
      cell: ({ row }) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedFarmer(row.original); }}
          className="p-2 hover:bg-tertiary rounded-lg transition-colors text-secondary hover:text-primary"
          aria-label={`View ${row.original.name}`}
        >
          <Eye size={16} />
        </button>
      )
    },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const CROP_OPTIONS = ['All', 'Kharif', 'Rabi', 'Zaid'];
  const TIER_OPTIONS = ['All', 'Bronze', 'Silver', 'Gold'];
  const CREDIT_OPTIONS = ['All', 'Clear', 'Due', 'Overdue'];

  return (
    <PageTransition>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-2xl text-primary">Farmers</h1>
            <span className="text-xs bg-tertiary text-secondary font-bold px-3 py-1 rounded-full border border-subtle shadow-sm">{filteredData.length} Farmers</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search farmers..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="border border-subtle rounded-lg px-3.5 py-2 text-sm bg-secondary text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 w-48 shadow-sm"
            />
            <button className="bg-gold text-dark text-sm font-bold px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors whitespace-nowrap shadow-sm">
              + New Farmer
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 items-center">
          {[
            { label: 'Crop', options: CROP_OPTIONS, state: cropFilter, setter: setCropFilter },
            { label: 'Tier', options: TIER_OPTIONS, state: tierFilter, setter: setTierFilter },
            { label: 'Credit', options: CREDIT_OPTIONS, state: creditFilter, setter: setCreditFilter },
          ].map(({ label, options, state, setter }) => (
            <div key={label} className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.1em] ml-2">{label}</span>
              {options.map((o) => (
                <button
                  key={o}
                  onClick={() => setter(o)}
                  className={`text-[11px] px-3.5 py-1.5 rounded-full font-bold transition-all border ${
                    state === o ? 'bg-gold border-gold text-dark shadow-sm' : 'bg-secondary border-subtle text-secondary hover:bg-tertiary'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-secondary border border-subtle rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-tertiary border-b border-subtle">
                  {table.getFlatHeaders().map((header) => (
                    <th key={header.id} scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-secondary uppercase tracking-wider whitespace-nowrap">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={9} />)
                ) : (
                  table.getRowModel().rows.map((row, i) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedFarmer(row.original)}
                      className={`border-b border-subtle last:border-0 cursor-pointer transition-colors hover:bg-tertiary/50 ${i % 2 === 1 ? 'bg-primary/10' : 'bg-secondary'}`}
                      style={{ height: '52px' }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-subtle bg-tertiary/30">
            <p className="text-[11px] font-bold text-secondary uppercase tracking-tight">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-subtle bg-secondary text-primary disabled:opacity-40 hover:bg-tertiary transition-colors shadow-sm"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(table.getPageCount(), 5) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`text-[11px] w-8 h-8 rounded-lg font-bold transition-all ${
                    table.getState().pagination.pageIndex === i ? 'bg-gold text-dark shadow-sm' : 'hover:bg-tertiary text-secondary bg-secondary border border-subtle'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-subtle bg-secondary text-primary disabled:opacity-40 hover:bg-tertiary transition-colors shadow-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-in Detail Panel */}
      <AnimatePresence>
        {selectedFarmer && (
          <FarmerDetailPanel farmer={selectedFarmer} onClose={() => setSelectedFarmer(null)} />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
