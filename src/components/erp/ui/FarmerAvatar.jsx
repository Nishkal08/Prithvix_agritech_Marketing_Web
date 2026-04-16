export default function FarmerAvatar({ initials, size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-[13px]',
    lg: 'w-14 h-14 text-[18px]',
  };
  
  return (
    <div className={`${sizes[size]} rounded-full bg-forest flex items-center justify-center text-gold font-bold shrink-0 shadow-md border border-gold/30 hover:scale-105 transition-transform cursor-default`}>
      {initials}
    </div>
  );
}
