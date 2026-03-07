import React from 'react';
import { cn } from '../../utils/cn';

export type EmptyStateSize    = 'sm' | 'md' | 'lg';
export type EmptyStateVariant = 'default' | 'brand' | 'muted';

export interface EmptyStateProps {
  icon?:            React.ReactNode;
  title:            string;
  description?:     string;
  action?:          React.ReactNode;
  secondaryAction?: React.ReactNode;
  size?:            EmptyStateSize;
  variant?:         EmptyStateVariant;
  className?:       string;
}

export const EmptyStateIcons = {
  inbox: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 28h10l3 4h10l3-4h10" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="21" cy="21" r="13" stroke="currentColor" strokeWidth="2"/>
      <path d="M30.5 30.5L41 41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 21h10M21 16v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  data: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M14 18h20M14 24h14M14 30h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  users: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="18" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 42c0-7 6.3-12 14-12s14 5 14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M31 10a7 7 0 010 14M38 42c0-5-3-9.5-7-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  error: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2"/>
      <path d="M24 14v12M24 33v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 16a4 4 0 014-4h10l4 4h18a4 4 0 014 4v14a4 4 0 01-4 4H10a4 4 0 01-4-4V16z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
};

const sizeConfig: Record<EmptyStateSize, { root: string; icon: string; title: string; desc: string; actions: string }> = {
  sm: {
    root:    'gap-3 py-8 px-4 max-w-[320px]',
    icon:    'w-10 h-10',
    title:   'text-[0.9375rem]',
    desc:    'text-[0.8125rem]',
    actions: 'mt-1',
  },
  md: {
    root:    'gap-4 py-12 px-6 max-w-[420px]',
    icon:    'w-14 h-14',
    title:   'text-[1.0625rem]',
    desc:    'text-sm',
    actions: 'mt-2',
  },
  lg: {
    root:    'gap-6 py-20 px-8 max-w-[520px]',
    icon:    'w-[72px] h-[72px]',
    title:   'text-xl',
    desc:    'text-base',
    actions: 'mt-4',
  },
};

const variantIconColor: Record<EmptyStateVariant, string> = {
  default: 'text-content-disabled',
  brand:   'text-violet-600',
  muted:   'text-neutral-700',
};

const variantTitleColor: Record<EmptyStateVariant, string> = {
  default: 'text-content-primary',
  brand:   'text-violet-100',
  muted:   'text-content-primary',
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size    = 'md',
  variant = 'default',
  className,
}) => {
  const cfg = sizeConfig[size];

  return (
    <div className={cn('flex flex-col items-center text-center w-full mx-auto', cfg.root, className)}>
      {icon && (
        <div className={cn('flex items-center justify-center flex-shrink-0', cfg.icon, variantIconColor[variant])}>
          <svg className="w-full h-full">{icon}</svg>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className={cn('font-semibold tracking-[-0.01em]', cfg.title, variantTitleColor[variant])}>
          {title}
        </p>
        {description && (
          <p className={cn('text-content-secondary leading-[1.6]', cfg.desc)}>
            {description}
          </p>
        )}
      </div>
      {(action || secondaryAction) && (
        <div className={cn('flex items-center gap-3 flex-wrap justify-center', cfg.actions)}>
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};
