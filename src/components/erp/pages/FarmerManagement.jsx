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
        className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-panel z-50 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-start gap-4">
          <FarmerAvatar initials={farmer.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-bold text-xl text-dark">{farmer.name}</h2>
              <LoyaltyBadge tier={farmer.loyaltyTier} />
            </div>
            <p className="text-muted text-sm mt-0.5">{farmer.village}</p>
            <p className="text-muted text-xs font-mono mt-0.5">{farmer.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface/60 rounded-lg transition-colors text-muted hover:text-dark">
            <X size={20} />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 divide-x divide-[#E8E3DA] border-b border-border bg-surface/30">
          {[
            { label: 'Total Visits', value: farmer.totalVisits },
            { label: 'Outstanding', value: farmer.outstandingAmount > 0 ? `₹${farmer.outstandingAmount.toLocaleString('en-IN')}` : '₹0' },
            { label: 'Member Since', value: format(new Date(farmer.registeredAt), 'MMM yy') },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 text-center">
              <p className="font-display font-bold text-lg text-dark">{value}</p>
              <p className="text-[11px] text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border shrink-0 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t ? 'border-gold text-dark' : 'border-transparent text-muted hover:text-muted'
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
                <div><p className="text-[11px] text-muted mb-1 uppercase tracking-wider">Mobile</p><p className="text-sm font-medium text-dark">{farmer.mobile}</p></div>
                <div><p className="text-[11px] text-muted mb-1 uppercase tracking-wider">Crop Cycle</p><p className="text-sm font-medium text-dark">{farmer.cropCycle}</p></div>
                <div><p className="text-[11px] text-muted mb-1 uppercase tracking-wider">Credit Status</p><StatusBadge status={farmer.creditStatus} /></div>
                <div><p className="text-[11px] text-muted mb-1 uppercase tracking-wider">Last Visit</p><p className="text-sm font-medium text-dark">{farmer.lastVisit ? formatDistanceToNow(new Date(farmer.lastVisit), { addSuffix: true }) : 'N/A'}</p></div>
              </div>
              <div>
                <p className="text-[11px] text-muted mb-1 uppercase tracking-wider">Address</p>
                <p className="text-sm text-dark">{farmer.address}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted mb-1 uppercase tracking-wider">Crops</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {farmer.crops.map(c => (
                    <span key={c} className="text-xs bg-surface text-muted px-3 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
              {farmer.notes && (
                <div>
                  <p className="text-[11px] text-muted mb-1 uppercase tracking-wider">Notes</p>
                  <p className="text-sm text-muted italic">"{farmer.notes}"</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Visit History' && (
            <div className="space-y-3">
              {farmer.visitHistory?.length > 0 ? farmer.visitHistory.map((v, i) => (
                <div key={i} className="border-l-[3px] border-gold pl-4 py-2">
                  <p className="text-xs font-bold text-gold mb-1">{format(new Date(v.date), 'dd MMM yyyy')}</p>
                  <p className="text-sm text-dark">{v.notes}</p>
                  {v.products?.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {v.products.map(p => <span key={p} className="text-[11px] bg-surface px-2 py-0.5 rounded">{p}</span>)}
                    </div>
                  )}
                </div>
              )) : (
                <p className="text-center text-muted text-sm py-8">No visit records yet.</p>
              )}
            </div>
          )}

          {activeTab === 'Credit Ledger' && (
            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface text-muted text-[11px] uppercase tracking-wider">
                    <th className="text-left px-3 py-2">Date</th>
                    <th className="text-left px-3 py-2">Type</th>
                    <th className="text-right px-3 py-2">Amount</th>
                    <th className="text-right px-3 py-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {farmer.creditLedger?.length > 0 ? farmer.creditLedger.map((tx, i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td className="px-3 py-3 text-muted text-xs">{format(new Date(tx.date), 'dd MMM yy')}</td>
                      <td className="px-3 py-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tx.type === 'Credit' ? 'bg-red-900/30 text-red-400' : 'bg-forest/15 text-forest'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-xs">₹{tx.amount.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-3 text-right font-mono text-xs font-bold">₹{tx.balance.toLocaleString('en-IN')}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="text-center text-muted py-8">No transactions yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'QR Card' && (
            <div className="flex flex-col items-center gap-5">
              <div className="bg-dark text-offwhite rounded-2xl p-6 w-full max-w-[280px] flex flex-col items-center gap-4">
                <div className="text-xs text-gold uppercase tracking-widest font-semibold">Prithvix Farmer ID</div>
                <FarmerAvatar initials={farmer.avatar} size="lg" />
                <div className="text-center">
                  <p className="font-display font-bold text-xl">{farmer.name}</p>
                  <p className="text-muted text-xs mt-1">{farmer.village}</p>
                  <p className="text-muted text-[10px] font-mono mt-0.5">{farmer.id}</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {farmer.crops.map(c => <span key={c} className="text-[10px] bg-forest/50 text-gold px-2 py-0.5 rounded">{c}</span>)}
                </div>
                <div className="bg-panel p-3 rounded-xl">
                  <QRCodeSVG id="farmer-qr-svg" value={farmer.qrData} size={140} />
                </div>
              </div>

              <div className="flex gap-3 w-full max-w-[280px]">
                <button
                  onClick={handleDownloadQR}
                  className="flex-1 flex justify-center items-center gap-2 bg-gold text-dark text-sm font-semibold py-2.5 rounded-lg hover:bg-gold/90 transition-colors"
                >
                  <Download size={16} /> Download QR
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex justify-center items-center gap-2 bg-panel border border-border text-dark text-sm font-medium py-2.5 rounded-lg hover:bg-surface/60 transition-colors"
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
            <p className="font-medium text-sm text-dark">{row.original.name}</p>
            <p className="text-[12px] text-muted">{row.original.village}</p>
          </div>
        </div>
      ),
    },
    { id: 'mobile', header: 'Mobile', accessorKey: 'mobile', cell: ({ getValue }) => <span className="text-sm font-mono text-muted">{getValue()}</span> },
    { id: 'cropCycle', header: 'Crop Cycle', accessorKey: 'cropCycle', cell: ({ getValue }) => <span className="text-sm text-dark">{getValue()}</span> },
    { id: 'loyalty', header: 'Loyalty', accessorKey: 'loyaltyTier', cell: ({ getValue }) => <LoyaltyBadge tier={getValue()} /> },
    { id: 'creditStatus', header: 'Credit', accessorKey: 'creditStatus', cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    { id: 'visits', header: 'Visits', accessorKey: 'totalVisits', cell: ({ getValue }) => <span className="text-sm text-right block text-dark font-medium">{getValue()}</span> },
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
          className="p-2 hover:bg-surface/60 rounded-lg transition-colors text-muted hover:text-dark"
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
            <h1 className="font-display font-bold text-2xl text-dark">Farmers</h1>
            <span className="text-xs bg-surface text-muted font-semibold px-2.5 py-1 rounded-full">{filteredData.length} total</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search farmers..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="border border-border rounded-lg px-3.5 py-2 text-sm bg-panel focus:outline-none focus:ring-2 focus:ring-gold/50 w-48"
            />
            <button className="bg-gold text-dark text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors whitespace-nowrap">
              + Register Farmer
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
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">{label}:</span>
              {options.map((o) => (
                <button
                  key={o}
                  onClick={() => setter(o)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    state === o ? 'bg-dark text-offwhite' : 'bg-panel border border-border text-muted hover:bg-surface/60'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-panel border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  {table.getFlatHeaders().map((header) => (
                    <th key={header.id} scope="col" className="px-4 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
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
                      className={`border-b border-border/40 last:border-0 cursor-pointer transition-colors hover:bg-surface/60 ${i % 2 === 1 ? 'bg-surface/30' : 'bg-panel'}`}
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface/30">
            <p className="text-[12px] text-muted">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="text-xs px-3 py-1.5 rounded border border-border disabled:opacity-40 hover:bg-surface/60 transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(table.getPageCount(), 5) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`text-xs w-8 h-8 rounded font-medium transition-colors ${
                    table.getState().pagination.pageIndex === i ? 'bg-dark text-offwhite' : 'hover:bg-surface/60 text-muted'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="text-xs px-3 py-1.5 rounded border border-border disabled:opacity-40 hover:bg-surface/60 transition-colors"
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
