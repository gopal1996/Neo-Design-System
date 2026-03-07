import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info' | 'outline';
export type BadgeSize    = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?:  BadgeVariant;
  size?:     BadgeSize;
  dot?:      boolean;
  children:  React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-neutral-800 border-stroke text-content-secondary',
  brand:   'bg-violet-500/[.15] border-violet-600/40 text-violet-200',
  success: 'bg-success-bg border-success/30 text-success-light',
  warning: 'bg-warning-bg border-warning/30 text-warning-light',
  error:   'bg-error-bg border-error/30 text-error-light',
  info:    'bg-info-bg border-info/30 text-info-light',
  outline: 'bg-transparent border-stroke-strong text-content-secondary',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'h-[18px] px-2 text-[0.6875rem]',
  md: 'h-[22px] px-2 text-xs',
  lg: 'h-[26px] px-[10px] text-[0.8125rem]',
};

export const Badge: React.FC<BadgeProps> = ({
  variant   = 'default',
  size      = 'md',
  dot       = false,
  children,
  className,
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 font-medium rounded-full border whitespace-nowrap leading-none',
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
  >
    {dot && (
      <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" aria-hidden="true" />
    )}
    {children}
  </span>
);
