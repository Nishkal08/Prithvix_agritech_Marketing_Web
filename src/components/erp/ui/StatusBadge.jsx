const STATUS_STYLES = {
  Healthy: 'bg-[#1A3C2B]/10 text-[#2D9E5A] dark:bg-[#2D9E5A]/20 dark:text-[#4ADE80]',
  Low:     'bg-[#D4A853]/10 text-[#D4A853] dark:bg-[#D4A853]/20 dark:text-[#FDE68A]',
  Reorder: 'bg-[#D44A4A]/10 text-[#D44A4A] dark:bg-[#D44A4A]/20 dark:text-[#FCA5A5]',
  Clear:   'bg-[#1A3C2B]/10 text-[#2D9E5A] dark:bg-[#2D9E5A]/20 dark:text-[#4ADE80]',
  Due:     'bg-[#D4A853]/10 text-[#D4A853] dark:bg-[#D4A853]/20 dark:text-[#FDE68A]',
  Overdue: 'bg-[#D44A4A]/10 text-[#D44A4A] dark:bg-[#D44A4A]/20 dark:text-[#FCA5A5]',
  Active:  'bg-[#1A3C2B]/10 text-[#2D9E5A] dark:bg-[#2D9E5A]/20 dark:text-[#4ADE80]',
  Inactive:'bg-tertiary text-secondary border border-subtle',
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-tertiary text-secondary';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${style} transition-all duration-300 shadow-sm border border-current/5`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shadow-[0_0_4px_currentColor]" />
      {status}
    </span>
  );
}
