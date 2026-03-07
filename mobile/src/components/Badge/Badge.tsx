import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors, radii, typography } from '../../tokens';

export type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info' | 'outline';
export type BadgeSize    = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?:  BadgeVariant;
  size?:     BadgeSize;
  dot?:      boolean;
  children:  React.ReactNode;
  style?:    ViewStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; border: string; text: string }> = {
  default: { bg: colors.neutral800, border: colors.border,              text: colors.textSecondary },
  brand:   { bg: 'rgba(124,58,237,0.15)', border: 'rgba(109,40,217,0.4)', text: colors.violet200 },
  success: { bg: colors.successBg,  border: 'rgba(16,185,129,0.3)',    text: colors.successLt },
  warning: { bg: colors.warningBg,  border: 'rgba(245,158,11,0.3)',    text: colors.warningLt },
  error:   { bg: colors.errorBg,    border: 'rgba(239,68,68,0.3)',     text: colors.errorLt },
  info:    { bg: colors.infoBg,     border: 'rgba(6,182,212,0.3)',     text: colors.infoLt },
  outline: { bg: 'transparent',     border: colors.borderStrong,       text: colors.textSecondary },
};

const sizeStyles: Record<BadgeSize, { height: number; paddingH: number; fontSize: number; dotSize: number }> = {
  sm: { height: 18, paddingH: 6,  fontSize: 10, dotSize: 4 },
  md: { height: 22, paddingH: 8,  fontSize: 11, dotSize: 5 },
  lg: { height: 26, paddingH: 10, fontSize: 13, dotSize: 6 },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size    = 'md',
  dot     = false,
  children,
  style,
}) => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <View
      style={[
        styles.base,
        {
          height:           s.height,
          paddingHorizontal: s.paddingH,
          backgroundColor:  v.bg,
          borderColor:      v.border,
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            { width: s.dotSize, height: s.dotSize, backgroundColor: v.text },
          ]}
        />
      )}
      <Text style={[styles.label, { fontSize: s.fontSize, color: v.text }]} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            4,
    borderRadius:   radii.full,
    borderWidth:    1,
    alignSelf:      'flex-start',
  },
  dot: {
    borderRadius: radii.full,
  },
  label: {
    fontWeight:         typography.fontWeight.medium,
    includeFontPadding: false,
  },
});
