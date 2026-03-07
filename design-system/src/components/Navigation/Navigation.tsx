import React from 'react';
import { cn } from '../../utils/cn';

export interface NavItem {
  id:        string;
  label:     string;
  href?:     string;
  icon?:     React.ReactNode;
  badge?:    string | number;
  active?:   boolean;
  disabled?: boolean;
  children?: NavItem[];
}

export interface SidebarProps {
  items:        NavItem[];
  logo?:        React.ReactNode;
  footer?:      React.ReactNode;
  collapsed?:   boolean;
  onItemClick?: (item: NavItem) => void;
  className?:   string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  logo,
  footer,
  collapsed = false,
  onItemClick,
  className,
}) => (
  <nav
    className={cn(
      'flex flex-col bg-surface-subtle border-r border-stroke p-4 gap-2',
      'transition-all duration-300 overflow-hidden flex-shrink-0 h-full',
      collapsed ? 'w-16' : 'w-60',
      className,
    )}
    aria-label="Main navigation"
  >
    {logo && (
      <div className="px-2 pb-4 mb-2 border-b border-stroke-subtle">
        {logo}
      </div>
    )}
    <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
      {items.map(item => (
        <NavItemComponent
          key={item.id}
          item={item}
          collapsed={collapsed}
          onItemClick={onItemClick}
        />
      ))}
    </div>
    {footer && (
      <div className="border-t border-stroke-subtle pt-4">{footer}</div>
    )}
  </nav>
);

const NavItemComponent: React.FC<{
  item:         NavItem;
  collapsed:    boolean;
  depth?:       number;
  onItemClick?: (item: NavItem) => void;
}> = ({ item, collapsed, depth = 0, onItemClick }) => {
  const Tag = item.href ? 'a' : 'button';

  return (
    <div className="flex flex-col">
      <Tag
        href={item.href}
        disabled={(Tag === 'button' && item.disabled) as any}
        onClick={() => onItemClick?.(item)}
        title={collapsed ? item.label : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
          'bg-transparent border border-transparent cursor-pointer no-underline',
          'transition-all duration-150 w-full text-left whitespace-nowrap overflow-hidden',
          item.active
            ? 'bg-violet-500/[.12] border-violet-600/30 text-violet-300'
            : 'text-content-tertiary hover:bg-neutral-800 hover:text-content-secondary',
          item.disabled && 'opacity-40 cursor-not-allowed',
          depth > 0 && 'pl-[calc(0.75rem+1.5rem)] text-[0.8125rem] font-normal',
        )}
      >
        {item.icon && (
          <span className="inline-flex items-center w-[1.125rem] h-[1.125rem] flex-shrink-0">
            {item.icon}
          </span>
        )}
        {!collapsed && (
          <span className="flex-1 overflow-hidden text-ellipsis">{item.label}</span>
        )}
        {!collapsed && item.badge && (
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-violet-500/20 rounded-full text-[0.6875rem] font-semibold text-violet-300 flex-shrink-0">
            {item.badge}
          </span>
        )}
      </Tag>
      {!collapsed && item.children?.map(child => (
        <NavItemComponent
          key={child.id}
          item={child}
          collapsed={collapsed}
          depth={depth + 1}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
};

export interface TopbarProps {
  left?:      React.ReactNode;
  center?:    React.ReactNode;
  right?:     React.ReactNode;
  className?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ left, center, right, className }) => (
  <header
    className={cn(
      'flex items-center h-[60px] bg-surface-subtle border-b border-stroke',
      'px-6 gap-4 sticky top-0 z-[200] backdrop-blur-md',
      className,
    )}
  >
    <div className="flex items-center gap-3 flex-1">{left}</div>
    <div className="flex items-center justify-center flex-1">{center}</div>
    <div className="flex items-center gap-2 flex-1 justify-end">{right}</div>
  </header>
);
