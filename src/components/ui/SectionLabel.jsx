export default function SectionLabel({ children, className = '' }) {
  return (
    <div
      className={`
        inline-block bg-surface text-forest
        font-body font-medium text-[12px]
        tracking-widest-brand uppercase
        px-3 py-1 rounded-sm
        border-l-2 border-gold
        mb-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}
