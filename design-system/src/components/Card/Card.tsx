import React from 'react';
import { cn } from '../../utils/cn';

export type CardVariant = 'default' | 'elevated' | 'brand' | 'flat';

export interface CardProps {
  variant?:    CardVariant;
  interactive?: boolean;
  padding?:    'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?:  string;
  children:    React.ReactNode;
  onClick?:    React.MouseEventHandler<HTMLDivElement>;
}

const variantClasses: Record<CardVariant, string> = {
  default:  'bg-surface-elevated border-stroke shadow-card',
  elevated: 'bg-surface-overlay border-stroke shadow-lg',
  brand:    'bg-violet-500/[.06] border-violet-600/30 shadow-card',
  flat:     'bg-surface-muted border-stroke-subtle shadow-none',
};

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
  xl:   'p-8',
};

export const Card: React.FC<CardProps> = ({
  variant     = 'default',
  interactive = false,
  padding     = 'md',
  className,
  children,
  onClick,
}) => (
  <div
    className={cn(
      'border rounded-xl overflow-hidden',
      variantClasses[variant],
      paddingClasses[padding],
      interactive && [
        'cursor-pointer transition-all duration-200',
        'hover:border-violet-600/40 hover:shadow-card-hover hover:-translate-y-0.5',
        'active:translate-y-0 focus-visible:outline-2 focus-visible:outline-stroke-focus focus-visible:outline-offset-2',
      ],
      className,
    )}
    onClick={onClick}
    role={interactive ? 'button' : undefined}
    tabIndex={interactive ? 0 : undefined}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className,
}) => (
  <div className={cn('px-4 pt-4 flex items-center gap-3', className)}>{children}</div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className,
}) => (
  <div className={cn('p-4', className)}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className,
}) => (
  <div className={cn('px-4 pb-4 pt-4 mt-4 border-t border-stroke-subtle flex items-center gap-2', className)}>
    {children}
  </div>
);
