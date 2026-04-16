export default function Badge({ children, className = '' }) {
  return (
    <span
      className={`
        inline-block bg-surface text-forest
        font-body font-medium text-xs
        tracking-wider-brand uppercase
        px-3 py-1 rounded-full
        ${className}
      `}
    >
      {children}
    </span>
  );
}
