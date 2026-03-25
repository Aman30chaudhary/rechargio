import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90 shadow-md shadow-secondary/20 transition-all active:scale-[0.98]',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5 transition-all active:scale-[0.98]',
    ghost: 'bg-transparent text-muted hover:text-primary hover:bg-primary/5 transition-all',
    glow: 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(59,82,223,0.3)] hover:shadow-[0_0_30px_rgba(59,82,223,0.5)] transition-all active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <button
      className={cn(
        'font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group/btn transition-all duration-300',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};

export const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      'bg-card text-card-foreground rounded-3xl border border-border shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:border-primary/20',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Input = ({ className, label, error, ...props }) => (
  <div className="space-y-2 w-full text-left">
    {label && (
      <label className="text-sm font-black uppercase tracking-widest text-muted ml-1">
        {label}
      </label>
    )}
    <div className="relative group">
      <input
        className={cn(
          'w-full px-6 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground placeholder:text-muted/50 font-bold text-sm',
          error && 'border-red-500 focus:ring-red-100 focus:border-red-500',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
  </div>
);
