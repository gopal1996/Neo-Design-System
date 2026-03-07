import React from 'react';
import { Text as RNText, StyleSheet, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { colors, typography } from '../../tokens';

export type TextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body-lg' | 'body' | 'body-sm' | 'caption' | 'overline' | 'mono';
export type TextColor   = 'primary' | 'secondary' | 'tertiary' | 'brand' | 'success' | 'warning' | 'error' | 'info';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?:  TextVariant;
  color?:    TextColor;
  style?:    TextStyle;
  children:  React.ReactNode;
}

const variantStyles: Record<TextVariant, TextStyle> = {
  display:   { fontSize: 48, fontWeight: typography.fontWeight.extrabold, lineHeight: 52,  letterSpacing: -2 },
  h1:        { fontSize: 36, fontWeight: typography.fontWeight.bold,      lineHeight: 40,  letterSpacing: -1.2 },
  h2:        { fontSize: 30, fontWeight: typography.fontWeight.bold,      lineHeight: 36,  letterSpacing: -0.8 },
  h3:        { fontSize: 24, fontWeight: typography.fontWeight.semibold,  lineHeight: 30,  letterSpacing: -0.4 },
  h4:        { fontSize: 20, fontWeight: typography.fontWeight.semibold,  lineHeight: 26,  letterSpacing: -0.3 },
  h5:        { fontSize: 18, fontWeight: typography.fontWeight.semibold,  lineHeight: 24,  letterSpacing: -0.2 },
  'body-lg': { fontSize: 18, fontWeight: typography.fontWeight.regular,  lineHeight: 28 },
  body:      { fontSize: 16, fontWeight: typography.fontWeight.regular,  lineHeight: 24 },
  'body-sm': { fontSize: 14, fontWeight: typography.fontWeight.regular,  lineHeight: 20 },
  caption:   { fontSize: 12, fontWeight: typography.fontWeight.regular,  lineHeight: 16,  letterSpacing: 0.2 },
  overline:  { fontSize: 11, fontWeight: typography.fontWeight.semibold, lineHeight: 16,  letterSpacing: 1.2, textTransform: 'uppercase' },
  mono:      { fontSize: 14, fontWeight: typography.fontWeight.regular,  fontFamily: 'monospace' },
};

const colorMap: Record<TextColor, string> = {
  primary:   colors.textPrimary,
  secondary: colors.textSecondary,
  tertiary:  colors.textTertiary,
  brand:     colors.textBrand,
  success:   colors.success,
  warning:   colors.warning,
  error:     colors.error,
  info:      colors.info,
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color   = 'primary',
  style,
  children,
  ...rest
}) => (
  <RNText
    style={[
      variantStyles[variant],
      { color: colorMap[color] },
      style,
    ]}
    {...rest}
  >
    {children}
  </RNText>
);
