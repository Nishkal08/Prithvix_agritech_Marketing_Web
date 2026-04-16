export default function Logo({ className = '', size = 'md', variant = 'dark' }) {
  const sizes = {
    sm: { icon: 28, text: 'text-base' },
    md: { icon: 34, text: 'text-lg' },
    lg: { icon: 44, text: 'text-2xl' },
  };

  const s = sizes[size] || sizes.md;
  const fill = variant === 'light' ? '#F5F0E8' : '#1A3C2B';
  const textColor = variant === 'light' ? 'text-offwhite' : 'text-forest';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Logo Mark — stylized leaf */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Leaf shape */}
        <path
          d="M20 4C20 4 8 12 8 24C8 30.627 13.373 36 20 36C26.627 36 32 30.627 32 24C32 12 20 4 20 4Z"
          fill={fill}
        />
        {/* Leaf vein — center line */}
        <path
          d="M20 10V32"
          stroke="#D4A853"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Left veins */}
        <path
          d="M20 16L14 20M20 22L13 25M20 28L15 30"
          stroke="#D4A853"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Right veins */}
        <path
          d="M20 16L26 20M20 22L27 25M20 28L25 30"
          stroke="#D4A853"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      {/* Wordmark */}
      <span className={`font-display font-semibold tracking-wide-brand ${textColor} ${s.text}`}>
        PRITHVIX
      </span>
    </div>
  );
}
