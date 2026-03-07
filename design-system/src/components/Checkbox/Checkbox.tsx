import React, { useId } from 'react';
import { cn } from '../../utils/cn';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?:         React.ReactNode;
  description?:   string;
  error?:         string;
  size?:          CheckboxSize;
  indeterminate?: boolean;
}

const boxSize: Record<CheckboxSize, string> = {
  sm: 'w-[14px] h-[14px]',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const labelSize: Record<CheckboxSize, string> = {
  sm: 'text-[0.8125rem]',
  md: 'text-sm',
  lg: 'text-base',
};

const descPadding: Record<CheckboxSize, string> = {
  sm: 'pl-[calc(14px+0.5rem)]',
  md: 'pl-[calc(16px+0.5rem)]',
  lg: 'pl-[calc(20px+0.5rem)]',
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, size = 'md', indeterminate = false, className, disabled, id, ...rest }, ref) => {
    const uid = useId();
    const inputId = id ?? uid;

    const internalRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef;

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, resolvedRef]);

    return (
      <div className={cn('flex flex-col gap-[2px]', disabled && 'opacity-45 cursor-not-allowed', className)}>
        <div className="flex items-start gap-2">
          <div className={cn('relative inline-flex flex-shrink-0', boxSize[size])}>
            <input
              ref={resolvedRef}
              id={inputId}
              type="checkbox"
              disabled={disabled}
              className={cn(
                'nx-checkbox-input absolute inset-0 opacity-0 cursor-pointer m-0 w-full h-full z-[1]',
                disabled && 'cursor-not-allowed',
              )}
              {...rest}
            />
            <span
              className={cn(
                'nx-checkbox-box flex items-center justify-center rounded-sm pointer-events-none',
                'border-[1.5px] border-stroke-strong bg-surface-elevated',
                'transition-all duration-150',
                boxSize[size],
                error && 'nx-has-error',
              )}
              aria-hidden="true"
            >
              {indeterminate ? (
                <svg viewBox="0 0 12 12" fill="none" className="nx-checkbox-icon w-[65%] h-[65%] text-white opacity-0 scale-[0.6] transition-all duration-150">
                  <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" fill="none" className="nx-checkbox-icon w-[65%] h-[65%] text-white opacity-0 scale-[0.6] transition-all duration-150">
                  <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </div>
          {label && (
            <label
              htmlFor={inputId}
              className={cn('font-medium text-content-primary cursor-pointer leading-[1.2] pt-[1px]', labelSize[size])}
            >
              {label}
            </label>
          )}
        </div>
        {description && !error && (
          <p className={cn('text-[0.8125rem] text-content-tertiary leading-[1.4]', descPadding[size])}>
            {description}
          </p>
        )}
        {error && (
          <p className={cn('text-[0.8125rem] text-error leading-[1.4]', descPadding[size])} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
