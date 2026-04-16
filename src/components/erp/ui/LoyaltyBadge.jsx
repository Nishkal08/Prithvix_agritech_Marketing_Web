const TIER_STYLES = {
  Gold:   { bg: 'bg-gold/15',          text: 'text-gold',        dot: 'bg-gold' },
  Silver: { bg: 'bg-surface',          text: 'text-muted',       dot: 'bg-muted' },
  Bronze: { bg: 'bg-orange-900/20',    text: 'text-orange-500',  dot: 'bg-orange-500' },
};

export default function LoyaltyBadge({ tier }) {
  const s = TIER_STYLES[tier] || TIER_STYLES.Bronze;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${s.bg} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {tier}
    </span>
  );
}
