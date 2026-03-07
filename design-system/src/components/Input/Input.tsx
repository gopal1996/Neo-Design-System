import React from 'react';
import { cn } from '../../utils/cn';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?:      string;
  hint?:       string;
  error?:      string;
  size?:       InputSize;
  iconLeft?:   React.ReactNode;
  iconRight?:  React.ReactNode;
  addonLeft?:  string;
  addonRight?: string;
  fullWidth?:  boolean;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 text-[0.8125rem]',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
};

const inputPadding: Record<InputSize, string> = {
  sm: 'px-3',
  md: 'px-4',
  lg: 'px-4',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      size      = 'md',
      iconLeft,
      iconRight,
      addonLeft,
      addonRight,
      fullWidth = false,
      className,
      id,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`;

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full', className)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-content-secondary leading-[1.4]">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-stretch bg-surface-elevated border border-stroke rounded-lg relative',
            'transition-colors duration-150',
            'focus-within:border-stroke-focus focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]',
            error    && 'border-error focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]',
            disabled && 'opacity-50 cursor-not-allowed',
            sizeClasses[size],
          )}
        >
          {addonLeft && (
            <span className="flex items-center px-3 text-content-tertiary text-sm font-medium bg-surface-muted whitespace-nowrap border-r border-stroke rounded-l-lg">
              {addonLeft}
            </span>
          )}
          {iconLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center w-4 h-4 text-content-tertiary pointer-events-none">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'nx-input flex-1 bg-transparent border-none outline-none text-content-primary w-full min-w-0 disabled:cursor-not-allowed',
              inputPadding[size],
              iconLeft  && 'pl-[calc(0.75rem+1rem+0.5rem)]',
              iconRight && 'pr-[calc(0.75rem+1rem+0.5rem)]',
              addonLeft  && 'rounded-l-none',
              addonRight && 'rounded-r-none',
            )}
            {...rest}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center w-4 h-4 text-content-tertiary pointer-events-none">
              {iconRight}
            </span>
          )}
          {addonRight && (
            <span className="flex items-center px-3 text-content-tertiary text-sm font-medium bg-surface-muted whitespace-nowrap border-l border-stroke rounded-r-lg">
              {addonRight}
            </span>
          )}
        </div>
        {error && <p className="text-[0.8125rem] text-error leading-[1.4]" role="alert">{error}</p>}
        {hint && !error && <p className="text-[0.8125rem] text-content-tertiary leading-[1.4]">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
