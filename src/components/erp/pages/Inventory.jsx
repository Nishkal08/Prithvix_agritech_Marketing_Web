import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronRight, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import PageTransition from '../ui/PageTransition';
import StatusBadge from '../ui/StatusBadge';
import SkeletonRow from '../ui/SkeletonRow';
import { inventory } from '../../../data/erp/inventory';

const CATEGORY_COLORS = {
  Fertilizer: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50',
  Pesticide:  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50',
  Seed:       'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50',
  Other:      'bg-tertiary text-secondary border border-subtle',
};

function StockBar({ stock, minStock, maxStock, status }) {
  const pct = Math.min(100, Math.round((stock / maxStock) * 100));
  const barColor = status === 'Healthy' ? '#2D9E5A' : status === 'Low' ? '#D4A853' : '#D44A4A';
  return (
    <div>
      <span className="text-[13px] font-bold text-primary block mb-1">{stock}</span>
      <div className="h-1.5 bg-tertiary rounded-full overflow-hidden w-24 border border-subtle/50">
        <div className="h-full rounded-full transition-all shadow-[0_0_8px_rgba(0,0,0,0.1)]" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

export default function Inventory() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(inventory);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Summary KPIs
  const totalProducts = data.length;
  const lowStock = data.filter(d => d.status === 'Low').length;
  const reorderNeeded = data.filter(d => d.status === 'Reorder').length;
  const totalValue = data.reduce((acc, d) => acc + d.stock * d.price, 0);

  const toggleRow = (id) => setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));

  const columns = useMemo(() => [
    {
      id: 'product', header: 'Product',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-sm text-primary uppercase tracking-tight">{row.original.name}</p>
          <p className="text-[11px] text-secondary font-medium">{row.original.brand}</p>
        </div>
      ),
    },
    {
      id: 'category', header: 'Category', accessorKey: 'category',
      cell: ({ getValue }) => (
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[getValue()] || CATEGORY_COLORS.Other}`}>
          {getValue()}
        </span>
      ),
    },
    { id: 'unit', header: 'Unit', accessorKey: 'unit', cell: ({ getValue }) => <span className="text-[12px] font-medium text-secondary">{getValue()}</span> },
    { id: 'price', header: 'Price', accessorKey: 'price', cell: ({ getValue }) => <span className="text-sm font-mono font-bold text-primary text-right block uppercase">₹{getValue().toLocaleString('en-IN')}</span> },
    {
      id: 'stock', header: 'Stock', accessorKey: 'stock',
      cell: ({ row }) => <StockBar stock={row.original.stock} minStock={row.original.minStock} maxStock={row.original.maxStock} status={row.original.status} />
    },
    { id: 'status', header: 'Status', accessorKey: 'status', cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    {
      id: 'lastUpdated', header: 'Updated', accessorKey: 'lastUpdated',
      cell: ({ getValue }) => <span className="text-[12px] text-muted">{formatDistanceToNow(new Date(getValue()), { addSuffix: true })}</span>
    },
    {
      id: 'actions', header: '', accessorKey: 'id',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.variants?.length > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleRow(row.original.id); }}
              className="p-1.5 hover:bg-tertiary rounded-lg transition-colors border border-transparent hover:border-subtle"
              aria-label="Expand variants"
            >
              {expandedRows[row.original.id] ? <ChevronDown size={16} className="text-gold" /> : <ChevronRight size={16} className="text-secondary" />}
            </button>
          )}
          <button className="p-1.5 hover:bg-tertiary rounded-lg transition-colors text-secondary hover:text-primary border border-transparent hover:border-subtle" aria-label="Edit">
            <Edit size={15} />
          </button>
        </div>
      )
    },
  ], [expandedRows]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <PageTransition>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-primary">Inventory</h1>
          <button className="bg-gold text-dark text-sm font-bold px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors shadow-sm">
            + New Item
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: totalProducts, color: 'text-primary' },
            { label: 'Low Stock', value: lowStock, color: 'text-gold' },
            { label: 'Reorder Needed', value: reorderNeeded, color: 'text-[#D44A4A]' },
            { label: 'Total Stock Value', value: `₹${(totalValue / 100000).toFixed(1)}L`, color: 'text-[#2D9E5A]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-secondary border border-subtle rounded-xl p-5 shadow-sm">
              <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-2">{label}</p>
              <p className={`font-display font-bold text-3xl ${color}`}>{value}</p>
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
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={8} />)
                ) : (
                  table.getRowModel().rows.map((row, i) => (
                    <>
                      <tr
                        key={row.id}
                        className={`border-b border-subtle last:border-0 transition-colors hover:bg-tertiary/50 ${i % 2 === 1 ? 'bg-primary/5' : 'bg-secondary'}`}
                        style={{ height: '52px' }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-2">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                      {/* Expandable variants */}
                      <AnimatePresence>
                        {expandedRows[row.original.id] && row.original.variants?.length > 0 && (
                          <tr key={`${row.id}-variants`}>
                            <td colSpan={9} className="p-0">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden bg-tertiary border-b border-subtle"
                              >
                                <div className="px-10 py-4 bg-secondary/50">
                                  <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-3">Product Variants</p>
                                  <table className="w-full text-[13px]">
                                    <thead>
                                      <tr className="text-secondary/60 text-[10px] uppercase font-bold tracking-wider">
                                        <th className="text-left py-2">SKU ID</th>
                                        <th className="text-left py-1">Size</th>
                                        <th className="text-right py-1">Stock</th>
                                        <th className="text-right py-1">Price</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {row.original.variants.map((v) => (
                                        <tr key={v.sku} className="border-t border-subtle/50">
                                          <td className="py-2.5 font-mono text-secondary/70 text-[11px] uppercase">{v.sku}</td>
                                          <td className="py-2.5 text-primary font-medium">{v.size}</td>
                                          <td className="py-2.5 text-right text-primary font-bold">{v.stock}</td>
                                          <td className="py-2.5 text-right font-mono text-primary font-bold">₹{v.price.toLocaleString('en-IN')}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-subtle bg-tertiary/30">
            <p className="text-[11px] font-bold text-secondary uppercase tracking-tight">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-subtle bg-secondary text-primary disabled:opacity-40 hover:bg-tertiary transition-colors shadow-sm">← Prev</button>
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-subtle bg-secondary text-primary disabled:opacity-40 hover:bg-tertiary transition-colors shadow-sm">Next →</button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
