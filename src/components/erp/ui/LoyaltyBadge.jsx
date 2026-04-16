const TIER_STYLES = {
  Gold:   { bg: 'bg-[#F5E6C8]', text: 'text-[#7C5C1A]', dot: 'bg-[#D4A853]' },
  Silver: { bg: 'bg-[#EAEAEA]',  text: 'text-[#555]',     dot: 'bg-[#A8A9AD]' },
  Bronze: { bg: 'bg-[#F5E0D0]', text: 'text-[#7C3B1A]',  dot: 'bg-[#CD7F32]' },
};

export default function LoyaltyBadge({ tier }) {
  const s = TIER_STYLES[tier] || TIER_STYLES.Bronze;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${s.bg} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {tier}
    </span>
  );
}
