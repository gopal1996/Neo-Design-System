import React from 'react';
import { cn } from '../../utils/cn';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TextVariant  = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body-lg' | 'body' | 'body-sm' | 'caption' | 'overline' | 'mono';
type TextColor    = 'primary' | 'secondary' | 'tertiary' | 'brand' | 'success' | 'warning' | 'error' | 'info';

interface TextProps {
  variant?:   TextVariant;
  color?:     TextColor;
  as?:        HeadingLevel | 'p' | 'span' | 'div' | 'label';
  gradient?:  boolean;
  className?: string;
  children:   React.ReactNode;
  id?:        string;
  htmlFor?:   string;
}

const variantClasses: Record<TextVariant, string> = {
  display:   'text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-none tracking-[-0.045em]',
  h1:        'text-4xl font-bold leading-[1.1] tracking-[-0.03em]',
  h2:        'text-3xl font-bold leading-[1.2] tracking-[-0.025em]',
  h3:        'text-2xl font-semibold leading-[1.25] tracking-[-0.02em]',
  h4:        'text-xl font-semibold leading-[1.3] tracking-[-0.015em]',
  h5:        'text-lg font-semibold leading-[1.4] tracking-[-0.01em]',
  'body-lg': 'text-lg font-normal leading-7',
  body:      'text-base font-normal leading-6',
  'body-sm': 'text-sm font-normal leading-5',
  caption:   'text-xs font-normal leading-[1.4] tracking-[0.01em]',
  overline:  'text-xs font-semibold leading-none tracking-[0.1em] uppercase',
  mono:      'font-mono text-sm',
};

const colorClasses: Record<TextColor, string> = {
  primary:   'text-content-primary',
  secondary: 'text-content-secondary',
  tertiary:  'text-content-tertiary',
  brand:     'text-content-brand',
  success:   'text-success',
  warning:   'text-warning',
  error:     'text-error',
  info:      'text-info',
};

const defaultTags: Record<TextVariant, string> = {
  display:   'h1',
  h1:        'h1',
  h2:        'h2',
  h3:        'h3',
  h4:        'h4',
  h5:        'h5',
  'body-lg': 'p',
  body:      'p',
  'body-sm': 'p',
  caption:   'span',
  overline:  'span',
  mono:      'span',
};

export const Text: React.FC<TextProps> = ({
  variant   = 'body',
  color     = 'primary',
  as,
  gradient  = false,
  className,
  children,
  ...rest
}) => {
  const Tag = (as ?? defaultTags[variant]) as React.ElementType;

  return (
    <Tag
      className={cn(
        variantClasses[variant],
        gradient
          ? 'bg-gradient-violet-text bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'
          : colorClasses[color],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
};
