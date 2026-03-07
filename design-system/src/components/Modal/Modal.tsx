import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  open:             boolean;
  onClose:          () => void;
  size?:            ModalSize;
  title?:           string;
  description?:     string;
  footer?:          React.ReactNode;
  children:         React.ReactNode;
  className?:       string;
  closeOnBackdrop?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm:   'max-w-[400px]',
  md:   'max-w-[560px]',
  lg:   'max-w-[720px]',
  xl:   'max-w-[960px]',
  full: 'max-w-[calc(100vw-4rem)] max-h-[calc(100vh-4rem)]',
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size             = 'md',
  title,
  description,
  footer,
  children,
  className,
  closeOnBackdrop  = true,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) el.showModal?.(); else el.close?.();
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-[4px] flex items-center justify-center z-[400] p-4 animate-fade-in"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={cn(
          'relative bg-surface-overlay border border-stroke-strong rounded-2xl',
          'shadow-xl flex flex-col max-h-[calc(100vh-4rem)] w-full animate-scale-in overflow-hidden',
          'shadow-[0_20px_25px_-5px_rgba(0,0,0,0.8),0_8px_10px_-6px_rgba(0,0,0,0.4),0_0_0_1px_rgba(109,40,217,0.15)]',
          sizeClasses[size],
          className,
        )}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-desc' : undefined}
      >
        <button
          className={cn(
            'absolute top-4 right-4 w-8 h-8 rounded-lg bg-transparent border border-transparent',
            'text-content-tertiary cursor-pointer flex items-center justify-center p-[6px] z-[1]',
            'transition-all duration-150',
            'hover:text-content-primary hover:bg-neutral-800 hover:border-stroke',
            'focus-visible:outline-2 focus-visible:outline-stroke-focus focus-visible:outline-offset-2',
          )}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {(title || description) && (
          <div className="pt-6 px-6 pr-12">
            {title && (
              <h2 id="modal-title" className="text-lg font-bold text-content-primary tracking-[-0.01em] leading-[1.3]">
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-desc" className="text-sm text-content-secondary mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-stroke-subtle flex items-center justify-end gap-3 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
