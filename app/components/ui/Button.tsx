import type {ButtonHTMLAttributes} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const variants = {
  primary:
    'bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading uppercase tracking-wider hover:shadow-jfw-glow',
  secondary:
    'bg-jfw-gray hover:bg-jfw-gray/80 text-jfw-white font-heading uppercase tracking-wider border border-jfw-gray hover:border-jfw-blue/30',
  outline:
    'bg-transparent border-2 border-jfw-blue text-jfw-blue hover:bg-jfw-blue hover:text-jfw-black font-heading uppercase tracking-wider hover:shadow-jfw-glow',
  ghost:
    'bg-transparent text-jfw-white hover:text-jfw-blue font-body',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`jfw-btn inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
