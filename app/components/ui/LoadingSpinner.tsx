interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div
      className={`jfw-spinner ${sizes[size]} border-2 border-jfw-gray border-t-jfw-blue rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
