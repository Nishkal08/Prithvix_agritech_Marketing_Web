import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gold text-dark hover:bg-[#C49843]',
  secondary: 'border border-forest text-forest hover:bg-forest hover:text-offwhite',
  ghost: 'text-muted hover:text-forest',
  'primary-dark': 'bg-gold text-dark hover:bg-[#C49843]',
  'secondary-light': 'border border-offwhite text-offwhite hover:bg-offwhite hover:text-dark',
};

const sizes = {
  sm: 'px-5 py-2.5 text-[13px]',
  md: 'px-8 py-4 text-[15px]',
  lg: 'px-10 py-5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`
        font-display font-semibold tracking-wide-brand
        inline-flex items-center justify-center rounded-full
        transition-colors duration-200
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}
