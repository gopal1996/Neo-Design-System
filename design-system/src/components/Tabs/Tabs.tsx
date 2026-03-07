import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../utils/cn';

interface TabsContextValue {
  active:    string;
  setActive: (id: string) => void;
  variant:   TabsVariant;
}

const TabsCtx = createContext<TabsContextValue>({
  active: '', setActive: () => undefined, variant: 'line',
});

export type TabsVariant = 'line' | 'pill' | 'enclosed';

export interface TabItem {
  id:        string;
  label:     React.ReactNode;
  icon?:     React.ReactNode;
  badge?:    React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items:       TabItem[];
  defaultTab?: string;
  active?:     string;
  onChange?:   (id: string) => void;
  variant?:    TabsVariant;
  className?:  string;
  children?:   React.ReactNode;
}

const tabListVariant: Record<TabsVariant, string> = {
  line:     'border-b border-stroke gap-0',
  pill:     'bg-surface-muted border border-stroke-subtle rounded-xl p-1 gap-1',
  enclosed: 'bg-surface-elevated border border-stroke rounded-xl p-1',
};

const tabVariant: Record<TabsVariant, string> = {
  line:     'border-b-2 border-b-transparent rounded-none -mb-px px-4 py-2',
  pill:     'rounded-lg',
  enclosed: 'rounded-lg',
};

const activeTabVariant: Record<TabsVariant, string> = {
  line:     'border-b-violet-500 text-violet-300',
  pill:     'bg-violet-500/[.15] border-violet-600/40 text-violet-200',
  enclosed: 'bg-surface-overlay border-stroke-strong text-content-primary shadow-sm',
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab,
  active: controlledActive,
  onChange,
  variant  = 'line',
  className,
  children,
}) => {
  const [internalActive, setInternalActive] = useState(
    defaultTab ?? items[0]?.id ?? '',
  );

  const active    = controlledActive ?? internalActive;
  const setActive = (id: string) => {
    setInternalActive(id);
    onChange?.(id);
  };

  return (
    <TabsCtx.Provider value={{ active, setActive, variant }}>
      <div className={cn('flex flex-col', className)}>
        <div
          className={cn('flex items-center', tabListVariant[variant])}
          role="tablist"
        >
          {items.map(item => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                aria-disabled={item.disabled}
                disabled={item.disabled}
                onClick={() => !item.disabled && setActive(item.id)}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium',
                  'bg-transparent border border-transparent cursor-pointer transition-all duration-150',
                  'whitespace-nowrap leading-[1.4]',
                  'hover:not([aria-disabled]):not([aria-selected=true]):text-content-secondary',
                  'hover:not([aria-disabled]):not([aria-selected=true]):bg-white/[.03]',
                  'focus-visible:outline-2 focus-visible:outline-stroke-focus focus-visible:outline-offset-2 focus-visible:rounded-md',
                  tabVariant[variant],
                  isActive
                    ? cn('text-content-primary', activeTabVariant[variant])
                    : 'text-content-tertiary',
                  item.disabled && 'opacity-40 cursor-not-allowed',
                )}
              >
                {item.icon && (
                  <span className="inline-flex items-center w-4 h-4">{item.icon}</span>
                )}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-violet-500/20 rounded-full text-[0.6875rem] font-semibold text-violet-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {children}
      </div>
    </TabsCtx.Provider>
  );
};

export const TabPanel: React.FC<{ id: string; children: React.ReactNode }> = ({
  id, children,
}) => {
  const { active } = useContext(TabsCtx);
  if (active !== id) return null;
  return (
    <div role="tabpanel" className="pt-4 animate-fade-in">
      {children}
    </div>
  );
};
