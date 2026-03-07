import React from 'react';
import { cn } from '../../utils/cn';

export type SpinnerSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'ring' | 'dots' | 'pulse';

export interface SpinnerProps {
  size?:    SpinnerSize;
  variant?: SpinnerVariant;
  label?:   string;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size    = 'md',
  variant = 'ring',
  label   = 'Loading...',
  className,
}) => (
  <span
    className={cn(
      'inline-flex items-center justify-center text-violet-400 flex-shrink-0',
      sizeClasses[size],
      className,
    )}
    role="status"
    aria-label={label}
  >
    {variant === 'ring' && (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full animate-spin"
        aria-hidden="true"
      >
        <circle
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="50"
          strokeDashoffset="12"
          strokeLinecap="round"
        />
      </svg>
    )}

    {variant === 'dots' && (
      <span className="flex items-center gap-1" aria-hidden="true">
        <span className="w-[30%] h-[30%] min-w-[4px] min-h-[4px] rounded-full bg-current animate-bounce-dot" />
        <span className="w-[30%] h-[30%] min-w-[4px] min-h-[4px] rounded-full bg-current animate-bounce-dot [animation-delay:0.2s]" />
        <span className="w-[30%] h-[30%] min-w-[4px] min-h-[4px] rounded-full bg-current animate-bounce-dot [animation-delay:0.4s]" />
      </span>
    )}

    {variant === 'pulse' && (
      <span
        className="w-full h-full rounded-full bg-violet-500 animate-pulse-circle"
        aria-hidden="true"
      />
    )}

    <span className="absolute w-px h-px p-0 -m-px overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0">
      {label}
    </span>
  </span>
);
