/** StatusBadge — fully semantic, dark-mode safe */
const STATUS_STYLES = {
  Healthy:  'bg-green-500/15 text-green-600 dark:text-green-400',
  Low:      'bg-gold/15 text-gold',
  Reorder:  'bg-red-500/15 text-red-500',
  Clear:    'bg-green-500/15 text-green-600 dark:text-green-400',
  Due:      'bg-gold/15 text-gold',
  Overdue:  'bg-red-500/15 text-red-500',
  Active:   'bg-forest/15 text-forest',
  Inactive: 'bg-surface text-muted',
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-surface text-muted';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}
