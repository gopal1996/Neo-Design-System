import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../tokens';

export type DividerVariant     = 'default' | 'subtle' | 'strong' | 'brand';
export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  variant?:     DividerVariant;
  orientation?: DividerOrientation;
  label?:       string;
  labelAlign?:  'left' | 'center' | 'right';
  spacing?:     'sm' | 'md' | 'lg';
  style?:       ViewStyle;
}

const variantColor: Record<DividerVariant, string> = {
  default: colors.border,
  subtle:  colors.borderSubtle,
  strong:  colors.borderStrong,
  brand:   colors.violet700,
};

const labelTextColor: Record<DividerVariant, string> = {
  default: colors.textTertiary,
  subtle:  colors.textTertiary,
  strong:  colors.textSecondary,
  brand:   colors.violet300,
};

const spacingPx: Record<NonNullable<DividerProps['spacing']>, number> = {
  sm: spacing[3],
  md: spacing[4],
  lg: spacing[6],
};

export const Divider: React.FC<DividerProps> = ({
  variant     = 'default',
  orientation = 'horizontal',
  label,
  labelAlign  = 'center',
  spacing: s  = 'md',
  style,
}) => {
  const lineColor = variantColor[variant];
  const marginV   = spacingPx[s];

  if (orientation === 'vertical') {
    return (
      <View
        accessibilityRole="separator"
        style={[styles.vertical, { backgroundColor: lineColor }, style]}
      />
    );
  }

  if (label) {
    return (
      <View
        accessibilityRole="separator"
        style={[styles.labelRow, { marginVertical: marginV }, style]}
      >
        {labelAlign !== 'left' && (
          <View style={[styles.line, { flex: 1, backgroundColor: lineColor }]} />
        )}
        {labelAlign === 'left' && (
          <View style={[styles.line, { width: 24, backgroundColor: lineColor }]} />
        )}
        <Text style={[styles.labelText, { color: labelTextColor[variant] }]}>{label}</Text>
        {labelAlign !== 'right' && (
          <View style={[styles.line, { flex: 1, backgroundColor: lineColor }]} />
        )}
        {labelAlign === 'right' && (
          <View style={[styles.line, { width: 24, backgroundColor: lineColor }]} />
        )}
      </View>
    );
  }

  return (
    <View
      accessibilityRole="separator"
      style={[
        styles.horizontal,
        { backgroundColor: lineColor, marginVertical: marginV },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width:  '100%',
  },
  vertical: {
    width:      StyleSheet.hairlineWidth,
    alignSelf:  'stretch',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing[3],
  },
  line: {
    height: StyleSheet.hairlineWidth,
  },
  labelText: {
    fontSize:           12,
    fontWeight:         typography.fontWeight.medium,
    includeFontPadding: false,
    letterSpacing:      0.3,
  },
});
