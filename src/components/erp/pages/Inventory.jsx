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
  Fertilizer: 'bg-[#D1E8DA] text-[#1A3C2B]',
  Pesticide:  'bg-[#D4E8F5] text-[#1A3C7C]',
  Seed:       'bg-[#F5ECD4] text-[#7C5C1A]',
  Other:      'bg-[#EDE8DF] text-[#6B7C6E]',
};

function StockBar({ stock, minStock, maxStock, status }) {
  const pct = Math.min(100, Math.round((stock / maxStock) * 100));
  const barColor = status === 'Healthy' ? '#2D9E5A' : status === 'Low' ? '#D4A853' : '#D44A4A';
  return (
    <div>
      <span className="text-sm font-medium text-dark block mb-1">{stock}</span>
      <div className="h-1.5 bg-[#EDE8DF] rounded-full overflow-hidden w-24">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
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
          <p className="font-medium text-sm text-dark">{row.original.name}</p>
          <p className="text-[12px] text-muted">{row.original.brand}</p>
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
    { id: 'unit', header: 'Unit', accessorKey: 'unit', cell: ({ getValue }) => <span className="text-sm text-secondary">{getValue()}</span> },
    { id: 'price', header: 'Price', accessorKey: 'price', cell: ({ getValue }) => <span className="text-sm font-mono font-medium text-dark text-right block">₹{getValue().toLocaleString('en-IN')}</span> },
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
              className="p-1.5 hover:bg-[#F0EDE6] rounded transition-colors"
              aria-label="Expand variants"
            >
              {expandedRows[row.original.id] ? <ChevronDown size={16} className="text-gold" /> : <ChevronRight size={16} className="text-muted" />}
            </button>
          )}
          <button className="p-1.5 hover:bg-[#F0EDE6] rounded transition-colors text-muted hover:text-dark" aria-label="Edit">
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
          <h1 className="font-display font-bold text-2xl text-dark">Inventory</h1>
          <button className="bg-gold text-dark text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors">
            + Add Product
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: totalProducts, color: 'text-dark' },
            { label: 'Low Stock', value: lowStock, color: 'text-[#D4A853]' },
            { label: 'Reorder Needed', value: reorderNeeded, color: 'text-[#D44A4A]' },
            { label: 'Total Stock Value', value: `₹${(totalValue / 100000).toFixed(1)}L`, color: 'text-[#1A3C2B]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-[#E8E3DA] rounded-xl p-5">
              <p className="text-[12px] text-muted mb-2">{label}</p>
              <p className={`font-display font-bold text-3xl ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E8E3DA] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F0E8] border-b border-[#E8E3DA]">
                  {table.getFlatHeaders().map((header) => (
                    <th key={header.id} scope="col" className="px-4 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
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
                        className={`border-b border-[#F5F0E8] last:border-0 transition-colors hover:bg-[#F0EDE6] ${i % 2 === 1 ? 'bg-[#FAFAF8]' : 'bg-white'}`}
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
                                className="overflow-hidden bg-[#FAFAF8] border-b border-[#E8E3DA]"
                              >
                                <div className="px-8 py-3">
                                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Variants</p>
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="text-muted">
                                        <th className="text-left py-1">SKU</th>
                                        <th className="text-left py-1">Size</th>
                                        <th className="text-right py-1">Stock</th>
                                        <th className="text-right py-1">Price</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {row.original.variants.map((v) => (
                                        <tr key={v.sku} className="border-t border-[#EDE8DF]">
                                          <td className="py-2 font-mono text-muted">{v.sku}</td>
                                          <td className="py-2 text-dark">{v.size}</td>
                                          <td className="py-2 text-right text-dark font-medium">{v.stock}</td>
                                          <td className="py-2 text-right font-mono">₹{v.price.toLocaleString('en-IN')}</td>
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E3DA] bg-[#FAFAF8]">
            <p className="text-[12px] text-muted">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="text-xs px-3 py-1.5 rounded border border-[#E8E3DA] disabled:opacity-40 hover:bg-[#F0EDE6]">← Prev</button>
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="text-xs px-3 py-1.5 rounded border border-[#E8E3DA] disabled:opacity-40 hover:bg-[#F0EDE6]">Next →</button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
