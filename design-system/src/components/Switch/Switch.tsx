import React from 'react';
import { cn } from '../../utils/cn';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  checked?:        boolean;
  defaultChecked?: boolean;
  onChange?:       (checked: boolean) => void;
  disabled?:       boolean;
  size?:           SwitchSize;
  label?:          string;
  hint?:           string;
  id?:             string;
  className?:      string;
}

const trackSize: Record<SwitchSize, string> = {
  sm: 'w-8 h-[18px]',
  md: 'w-11 h-6',
  lg: 'w-14 h-[30px]',
};

const thumbSize: Record<SwitchSize, { width: number; height: number }> = {
  sm: { width: 12, height: 12 },
  md: { width: 18, height: 18 },
  lg: { width: 22, height: 22 },
};

const thumbLeft: Record<SwitchSize, number> = { sm: 3, md: 3, lg: 4 };
const thumbCheckedX: Record<SwitchSize, number> = { sm: 14, md: 20, lg: 26 };

export const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  size     = 'md',
  label,
  hint,
  id,
  className,
}) => {
  const switchId = id ?? `switch-${Math.random().toString(36).slice(2, 7)}`;
  const { width, height } = thumbSize[size];

  const thumbStyle: React.CSSProperties = {
    width,
    height,
    left: thumbLeft[size],
    top: '50%',
    transform: checked ? `translate(${thumbCheckedX[size]}px, -50%)` : 'translateY(-50%)',
    transition: 'transform 200ms ease, width 150ms ease',
  };

  return (
    <div className={cn('flex flex-col gap-1', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <div className="flex items-center gap-3">
        <button
          id={switchId}
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange?.(!checked)}
          type="button"
          className={cn(
            'relative rounded-full border-none cursor-pointer transition-all duration-200 flex-shrink-0 p-0',
            'focus-visible:outline-2 focus-visible:outline-stroke-focus focus-visible:outline-offset-2',
            trackSize[size],
            checked
              ? 'bg-gradient-brand shadow-[0_0_8px_0_rgba(124,58,237,0.4)]'
              : 'bg-neutral-700',
          )}
        >
          <span
            className="block absolute bg-white rounded-full shadow-sm"
            style={thumbStyle}
          />
        </button>
        {label && (
          <label htmlFor={switchId} className="text-sm font-medium text-content-primary cursor-pointer">
            {label}
          </label>
        )}
      </div>
      {hint && (
        <p className="text-[0.8125rem] text-content-tertiary leading-[1.4]">{hint}</p>
      )}
    </div>
  );
};
