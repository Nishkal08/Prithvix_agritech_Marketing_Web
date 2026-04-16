const STATUS_STYLES = {
  Healthy: 'bg-[#D1E8DA] text-[#1A3C2B]',
  Low:     'bg-[#F5E6C8] text-[#7C5C1A]',
  Reorder: 'bg-[#F5D1D1] text-[#7C1A1A]',
  Clear:   'bg-[#D1E8DA] text-[#1A3C2B]',
  Due:     'bg-[#F5E6C8] text-[#7C5C1A]',
  Overdue: 'bg-[#F5D1D1] text-[#7C1A1A]',
  Active:  'bg-[#D1E8DA] text-[#1A3C2B]',
  Inactive:'bg-[#E8E3DA] text-[#6B7C6E]',
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-[#E8E3DA] text-[#6B7C6E]';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}
