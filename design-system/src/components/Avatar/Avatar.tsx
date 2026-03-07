import React from 'react';
import { cn } from '../../utils/cn';

export type AvatarSize   = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps {
  src?:      string;
  alt?:      string;
  name?:     string;
  size?:     AvatarSize;
  status?:   AvatarStatus;
  className?: string;
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const VIOLET_SHADES = ['#7C3AED', '#6D28D9', '#5B21B6', '#8B5CF6', '#A78BFA'];
function getColorFromName(name: string): string {
  return VIOLET_SHADES[name.charCodeAt(0) % VIOLET_SHADES.length];
}

const sizeClasses: Record<AvatarSize, string> = {
  xs:   'w-6 h-6 text-[0.5625rem]',
  sm:   'w-8 h-8 text-[0.6875rem]',
  md:   'w-10 h-10 text-sm',
  lg:   'w-12 h-12 text-base',
  xl:   'w-16 h-16 text-xl',
  '2xl':'w-20 h-20 text-2xl',
};

const statusColors: Record<AvatarStatus, string> = {
  online:  'bg-success',
  offline: 'bg-neutral-500',
  busy:    'bg-error',
  away:    'bg-warning',
};

export const Avatar: React.FC<AvatarProps> = ({
  src, alt, name, size = 'md', status, className,
}) => (
  <span
    className={cn(
      'inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0',
      'border-[1.5px] border-stroke bg-surface-muted relative',
      sizeClasses[size],
      className,
    )}
  >
    {src ? (
      <img src={src} alt={alt ?? name ?? 'avatar'} className="w-full h-full object-cover" />
    ) : name ? (
      <span
        className="flex items-center justify-center w-full h-full font-semibold text-white tracking-[0.02em]"
        style={{ background: getColorFromName(name) }}
        aria-label={name}
      >
        {getInitials(name)}
      </span>
    ) : (
      <span className="flex items-center justify-center text-content-tertiary w-[60%] h-[60%]" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </span>
    )}
    {status && (
      <span
        className={cn(
          'absolute bottom-0 right-0 w-[25%] h-[25%] min-w-[6px] min-h-[6px] rounded-full border-2 border-surface-base',
          statusColors[status],
        )}
        aria-label={status}
      />
    )}
  </span>
);

export const AvatarGroup: React.FC<{
  avatars: AvatarProps[];
  max?:    number;
  size?:   AvatarSize;
}> = ({ avatars, max = 4, size = 'md' }) => {
  const visible = avatars.slice(0, max);
  const rest    = avatars.length - visible.length;

  return (
    <div className="flex items-center">
      {visible.map((avatar, i) => (
        <Avatar key={i} {...avatar} size={size} className="-ml-2 first:ml-0 ring-2 ring-surface-base" />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full flex-shrink-0',
            'border-[1.5px] border-stroke bg-neutral-800 text-content-secondary',
            'text-xs font-semibold -ml-2 ring-2 ring-surface-base',
            sizeClasses[size],
          )}
        >
          +{rest}
        </span>
      )}
    </div>
  );
};
