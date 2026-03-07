import React from 'react';
import { cn } from '../../utils/cn';

export interface ShimmerProps {
  width?:     string | number;
  height?:    string | number;
  radius?:    'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const radiusClasses: Record<NonNullable<ShimmerProps['radius']>, string> = {
  none: 'rounded-none',
  sm:   'rounded-sm',
  md:   'rounded-md',
  lg:   'rounded-lg',
  xl:   'rounded-xl',
  full: 'rounded-full',
};

export const Shimmer: React.FC<ShimmerProps> = ({
  width,
  height   = 16,
  radius   = 'md',
  className,
}) => (
  <span
    className={cn('nx-shimmer', radiusClasses[radius], className)}
    style={{ width, height }}
    aria-hidden="true"
  />
);

export const ShimmerText: React.FC<{ lines?: number; lastLineWidth?: string }> = ({
  lines = 3, lastLineWidth = '60%',
}) => (
  <div className="flex flex-col gap-2 w-full">
    {Array.from({ length: lines }).map((_, i) => (
      <Shimmer key={i} width={i === lines - 1 ? lastLineWidth : '100%'} height={14} radius="md" />
    ))}
  </div>
);

export const ShimmerAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Shimmer width={size} height={size} radius="full" />
);

export const ShimmerCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-surface-elevated border border-stroke rounded-xl p-4 flex flex-col gap-4', className)}>
    <div className="flex items-center gap-3">
      <ShimmerAvatar size={40} />
      <div className="flex-1 flex flex-col gap-2">
        <Shimmer width="50%" height={14} radius="md" />
        <Shimmer width="30%" height={12} radius="md" />
      </div>
    </div>
    <ShimmerText lines={3} lastLineWidth="45%" />
    <div className="flex gap-2">
      <Shimmer width={80} height={32} radius="lg" />
      <Shimmer width={80} height={32} radius="lg" />
    </div>
  </div>
);

export const ShimmerTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5, cols = 4,
}) => (
  <div className="flex flex-col bg-surface-elevated border border-stroke rounded-xl overflow-hidden">
    <div className="flex items-center gap-6 px-4 py-3 border-b border-stroke">
      {Array.from({ length: cols }).map((_, i) => (
        <Shimmer key={i} width={`${60 + (i * 20) % 40}%`} height={12} radius="md" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, ri) => (
      <div key={ri} className="flex items-center gap-6 px-4 py-3 border-b border-stroke-subtle last:border-b-0">
        {Array.from({ length: cols }).map((_, ci) => (
          <Shimmer key={ci} width={`${50 + ((ri * 7 + ci * 11) % 45)}%`} height={14} radius="md" />
        ))}
      </div>
    ))}
  </div>
);

export const ShimmerList: React.FC<{ items?: number; avatar?: boolean }> = ({
  items = 4, avatar = true,
}) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        {avatar && <ShimmerAvatar size={36} />}
        <div className="flex-1 flex flex-col gap-2">
          <Shimmer width={`${40 + (i * 13) % 30}%`} height={14} radius="md" />
          <Shimmer width={`${55 + (i * 9) % 30}%`} height={12} radius="md" />
        </div>
      </div>
    ))}
  </div>
);
