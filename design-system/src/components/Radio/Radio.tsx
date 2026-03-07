import React, { useId, createContext, useContext } from 'react';
import { cn } from '../../utils/cn';

export type RadioSize = 'sm' | 'md' | 'lg';

interface RadioGroupCtx {
  name:      string;
  value:     string | undefined;
  onChange:  (v: string) => void;
  disabled?: boolean;
  size?:     RadioSize;
}

const RadioCtx = createContext<RadioGroupCtx | null>(null);

export interface RadioGroupProps {
  name:       string;
  value?:     string;
  onChange?:  (v: string) => void;
  disabled?:  boolean;
  size?:      RadioSize;
  label?:     string;
  error?:     string;
  children:   React.ReactNode;
  className?: string;
  direction?: 'vertical' | 'horizontal';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name, value, onChange, disabled, size = 'md', label, error, children, className, direction = 'vertical',
}) => (
  <RadioCtx.Provider value={{ name, value, onChange: onChange ?? (() => undefined), disabled, size }}>
    <fieldset className={cn('border-0 p-0 m-0 flex flex-col gap-1', className)}>
      {label && (
        <legend className="text-sm font-semibold text-content-secondary mb-2 leading-[1.4]">
          {label}
        </legend>
      )}
      <div className={cn(
        'flex gap-2',
        direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap gap-4',
      )}>
        {children}
      </div>
      {error && <p className="text-[0.8125rem] text-error mt-1" role="alert">{error}</p>}
    </fieldset>
  </RadioCtx.Provider>
);

export interface RadioProps {
  value:        string;
  label?:       React.ReactNode;
  description?: string;
  disabled?:    boolean;
  size?:        RadioSize;
  className?:   string;
}

const circleSize: Record<RadioSize, string> = {
  sm: 'w-[14px] h-[14px]',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const labelSize: Record<RadioSize, string> = {
  sm: 'text-[0.8125rem]',
  md: 'text-sm',
  lg: 'text-base',
};

export const Radio: React.FC<RadioProps> = ({ value, label, description, disabled, size, className }) => {
  const ctx              = useContext(RadioCtx);
  const uid              = useId();
  const resolvedSize     = size ?? ctx?.size ?? 'md';
  const resolvedDisabled = disabled ?? ctx?.disabled ?? false;
  const checked          = ctx ? ctx.value === value : false;

  return (
    <div className={cn('flex flex-col gap-[2px]', resolvedDisabled && 'opacity-45 cursor-not-allowed', className)}>
      <div className="flex items-start gap-2">
        <div className={cn('relative inline-flex flex-shrink-0', circleSize[resolvedSize])}>
          <input
            id={uid}
            type="radio"
            name={ctx?.name}
            value={value}
            checked={checked}
            disabled={resolvedDisabled}
            onChange={() => ctx?.onChange(value)}
            className={cn(
              'nx-radio-input absolute inset-0 opacity-0 cursor-pointer m-0 w-full h-full z-[1]',
              resolvedDisabled && 'cursor-not-allowed',
            )}
          />
          <span
            className={cn(
              'nx-radio-circle flex items-center justify-center rounded-full pointer-events-none',
              'border-[1.5px] border-stroke-strong bg-surface-elevated',
              'transition-all duration-150',
              circleSize[resolvedSize],
            )}
            aria-hidden="true"
          >
            <span
              className="nx-radio-dot w-1/2 h-1/2 rounded-full bg-violet-500 scale-0 transition-transform duration-150"
            />
          </span>
        </div>
        {label && (
          <label htmlFor={uid} className={cn('font-medium text-content-primary cursor-pointer leading-[1.2] pt-[1px]', labelSize[resolvedSize])}>
            {label}
          </label>
        )}
      </div>
      {description && (
        <p className="text-[0.8125rem] text-content-tertiary leading-[1.4] pl-[calc(16px+0.5rem)]">
          {description}
        </p>
      )}
    </div>
  );
};
