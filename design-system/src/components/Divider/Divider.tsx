import React from 'react';
import { cn } from '../../utils/cn';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant     = 'default' | 'subtle' | 'strong' | 'brand';

export interface DividerProps {
  orientation?: DividerOrientation;
  variant?:     DividerVariant;
  label?:       React.ReactNode;
  labelAlign?:  'left' | 'center' | 'right';
  className?:   string;
  spacing?:     'sm' | 'md' | 'lg';
}

const variantColor: Record<DividerVariant, string> = {
  default: 'border-stroke',
  subtle:  'border-stroke-subtle',
  strong:  'border-stroke-strong',
  brand:   'border-violet-700',
};

const variantBg: Record<DividerVariant, string> = {
  default: 'bg-stroke',
  subtle:  'bg-stroke-subtle',
  strong:  'bg-stroke-strong',
  brand:   'bg-violet-700',
};

const spacingClasses: Record<NonNullable<DividerProps['spacing']>, string> = {
  sm: 'my-3',
  md: 'my-4',
  lg: 'my-6',
};

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant     = 'default',
  label,
  labelAlign  = 'center',
  className,
  spacing     = 'md',
}) => {
  if (orientation === 'vertical') {
    return (
      <span
        className={cn('inline-block w-px h-[1em] self-stretch flex-shrink-0', variantBg[variant], className)}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 w-full',
          spacingClasses[spacing],
          className,
        )}
        role="separator"
      >
        {labelAlign === 'right' ? (
          <span className={cn('flex-1 h-px', variantBg[variant])} />
        ) : (
          <span className={cn(labelAlign === 'left' ? 'w-6 flex-none h-px' : 'flex-1 h-px', variantBg[variant])} />
        )}
        <span className={cn(
          'text-xs font-medium text-content-tertiary whitespace-nowrap tracking-[0.02em]',
          variant === 'brand' && 'text-violet-300',
        )}>
          {label}
        </span>
        {labelAlign !== 'right' && (
          <span className={cn('flex-1 h-px', variantBg[variant])} />
        )}
        {labelAlign === 'right' && (
          <span className={cn('w-6 flex-none h-px', variantBg[variant])} />
        )}
      </div>
    );
  }

  return (
    <hr
      className={cn(
        'border-0 border-t w-full flex-shrink-0',
        variantColor[variant],
        spacingClasses[spacing],
        className,
      )}
      role="separator"
    />
  );
};
