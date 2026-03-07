import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant   = 'dark' | 'brand';

export interface TooltipProps {
  content:    React.ReactNode;
  children:   React.ReactElement;
  placement?: TooltipPlacement;
  variant?:   TooltipVariant;
  delay?:     number;
  disabled?:  boolean;
  maxWidth?:  number;
}

const placementClasses: Record<TooltipPlacement, string> = {
  top:    'bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2',
  bottom: 'top-[calc(100%+8px)] left-1/2 -translate-x-1/2',
  left:   'right-[calc(100%+8px)] top-1/2 -translate-y-1/2',
  right:  'left-[calc(100%+8px)] top-1/2 -translate-y-1/2',
};

const variantClasses: Record<TooltipVariant, string> = {
  dark:  'bg-neutral-800 text-content-primary border border-stroke shadow-lg',
  brand: 'bg-gradient-to-br from-violet-700 to-violet-600 text-white border border-violet-500 shadow-glow-sm',
};

const animationClasses: Record<TooltipPlacement, string> = {
  top:    'animate-tooltip-in',
  bottom: 'animate-tooltip-in',
  left:   'animate-[tooltip-in-x_120ms_ease_forwards]',
  right:  'animate-[tooltip-in-x_120ms_ease_forwards]',
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  variant   = 'dark',
  delay     = 300,
  disabled  = false,
  maxWidth  = 240,
}) => {
  const [visible, setVisible] = useState(false);
  const timer   = useRef<ReturnType<typeof setTimeout>>();
  const uid     = React.useId();
  const tooltipId = `tooltip-${uid.replace(/:/g, '')}`;

  const show = useCallback(() => {
    if (disabled) return;
    timer.current = setTimeout(() => setVisible(true), delay);
  }, [disabled, delay]);

  const hide = useCallback(() => {
    clearTimeout(timer.current);
    setVisible(false);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const child = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => { show(); children.props.onMouseEnter?.(e); },
    onMouseLeave: (e: React.MouseEvent) => { hide(); children.props.onMouseLeave?.(e); },
    onFocus:      (e: React.FocusEvent) => { show(); children.props.onFocus?.(e); },
    onBlur:       (e: React.FocusEvent) => { hide(); children.props.onBlur?.(e); },
    'aria-describedby': visible ? tooltipId : undefined,
  });

  return (
    <span className="relative inline-flex items-center">
      {child}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-[600] px-3 py-2 rounded-lg text-[0.8125rem] font-medium leading-[1.4]',
            'whitespace-pre-wrap break-words pointer-events-none w-max',
            `nx-tooltip nx-tooltip-${placement}`,
            variantClasses[variant],
            placementClasses[placement],
            animationClasses[placement],
          )}
          style={{ maxWidth }}
        >
          {content}
          <span className="nx-tooltip-arrow" aria-hidden="true" />
        </span>
      )}
    </span>
  );
};
