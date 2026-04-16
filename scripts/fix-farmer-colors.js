const fs = require('fs');
let c = fs.readFileSync('src/components/erp/pages/FarmerManagement.jsx', 'utf8');

const swaps = [
  // Slide panel background
  ['bg-white z-50 shadow-2xl flex flex-col overflow-hidden"', 'bg-panel z-50 shadow-2xl flex flex-col overflow-hidden border-l border-border"'],
  // Panel header border  
  ['"p-5 border-b border-[#E8E3DA] flex items-start gap-4"', '"p-5 border-b border-border flex items-start gap-4"'],
  // Quick stats bg
  ['"grid grid-cols-3 divide-x divide-[#E8E3DA] border-b border-[#E8E3DA] bg-[#FAFAF8]"', '"grid grid-cols-3 divide-x divide-border border-b border-border bg-surface/40"'],
  // Tabs border
  ['"flex border-b border-[#E8E3DA] shrink-0 overflow-x-auto"', '"flex border-b border-border shrink-0 overflow-x-auto"'],
  // Credit ledger header
  ['"bg-[#F5F0E8] text-muted text-[11px] uppercase tracking-wider"', '"bg-surface text-muted text-[11px] uppercase tracking-wider"'],
  // Print button
  ['"flex-1 flex justify-center items-center gap-2 bg-white border border-[#E8E3DA] text-dark text-sm font-medium py-2.5 rounded-lg hover:bg-[#F0EDE6] transition-colors"', '"flex-1 flex justify-center items-center gap-2 bg-panel border border-border text-dark text-sm font-medium py-2.5 rounded-lg hover:bg-surface transition-colors"'],
  // Close button
  ['"p-2 hover:bg-[#F0EDE6] rounded-lg transition-colors text-muted hover:text-dark"', '"p-2 hover:bg-surface rounded-lg transition-colors text-muted hover:text-dark"'],
  // Search input
  ['"border border-[#E8E3DA] rounded-lg px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 w-48"', '"border border-border rounded-lg px-3.5 py-2 text-sm bg-surface text-dark focus:outline-none focus:ring-2 focus:ring-gold/50 w-48 focus:bg-panel"'],
  // Count badge
  ['"text-xs bg-[#EDE8DF] text-secondary font-semibold px-2.5 py-1 rounded-full"', '"text-xs bg-surface text-muted font-semibold px-2.5 py-1 rounded-full"'],
  // Crop tags
  ['"text-xs bg-[#EDE8DF] text-secondary px-3 py-1 rounded-full"', '"text-xs bg-surface text-muted px-3 py-1 rounded-full"'],
  // Pagination bar
  ['"flex items-center justify-between px-4 py-3 border-t border-[#E8E3DA] bg-[#FAFAF8]"', '"flex items-center justify-between px-4 py-3 border-t border-border bg-surface/30"'],
  // Active page btn
  ['"bg-dark text-offwhite" : "hover:bg-[#F0EDE6] text-secondary"', '"bg-dark text-offwhite" : "hover:bg-surface text-muted"'],
  // Prev/next buttons
  ['"text-xs px-3 py-1.5 rounded border border-[#E8E3DA] disabled:opacity-40 hover:bg-[#F0EDE6] transition-colors"', '"text-xs px-3 py-1.5 rounded border border-border disabled:opacity-40 hover:bg-surface transition-colors"'],
  // Visit product tags
  ['"text-[11px] bg-[#EDE8DF] px-2 py-0.5 rounded"', '"text-[11px] bg-surface text-muted px-2 py-0.5 rounded"'],
];

swaps.forEach(([from, to]) => { c = c.split(from).join(to); });
fs.writeFileSync('src/components/erp/pages/FarmerManagement.jsx', c);
console.log('OK');
