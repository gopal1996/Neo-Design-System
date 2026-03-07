import React from 'react';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-btn-primary border-violet-500 text-white hover:bg-btn-primary-hover hover:border-violet-400 focus-visible:shadow-focus-ring',
  secondary: 'bg-violet-500/[.08] border-stroke-brand text-violet-300 hover:bg-violet-500/[.14] hover:border-violet-500 hover:text-violet-200 focus-visible:shadow-focus-ring',
  ghost: 'bg-transparent border-transparent text-content-secondary hover:bg-neutral-800 hover:text-content-primary focus-visible:shadow-focus-ring',
  danger: 'bg-error/10 border-error/40 text-error-light hover:bg-error/[.18] hover:border-error hover:text-white focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.3)]',
  success: 'bg-success/10 border-success/40 text-success-light hover:bg-success/[.18] hover:border-success hover:text-white focus-visible:shadow-[0_0_0_3px_rgba(16,185,129,0.3)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7 px-3 text-xs',
  sm: 'h-8 px-3 text-[0.8125rem]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-14 px-8 text-[1.0625rem]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      className,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-lg border cursor-pointer',
          'transition-all duration-150 whitespace-nowrap select-none relative no-underline leading-none',
          'active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          loading && 'cursor-not-allowed',
          className,
        )}
        {...rest}
      >
        {loading && (
          <span className="inline-flex items-center w-[1em] h-[1em] animate-spin" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
            </svg>
          </span>
        )}
        {!loading && iconLeft && (
          <span className="inline-flex items-center flex-shrink-0 w-[1em] h-[1em]">{iconLeft}</span>
        )}
        {children && <span className="inline-flex items-center">{children}</span>}
        {!loading && iconRight && (
          <span className="inline-flex items-center flex-shrink-0 w-[1em] h-[1em]">{iconRight}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
