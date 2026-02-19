interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'sale' | 'new';
  className?: string;
}

const variants = {
  default: 'bg-jfw-gray text-jfw-white border-jfw-gray',
  sale: 'bg-red-600 text-white border-red-600',
  new: 'bg-jfw-blue text-jfw-black border-jfw-blue',
};

export function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`jfw-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-heading uppercase tracking-wider border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
