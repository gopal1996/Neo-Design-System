import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';
import { colors, spacing, radii, typography } from '../../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  loading?:   boolean;
  iconLeft?:  React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  style?:     ViewStyle;
  children?:  React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { bg: string; border: string; text: string }> = {
  primary:   { bg: colors.violet500,        border: colors.violet500,   text: '#FFFFFF' },
  secondary: { bg: 'rgba(124,58,237,0.10)', border: colors.violet600,   text: colors.violet300 },
  ghost:     { bg: 'transparent',           border: 'transparent',      text: colors.textSecondary },
  danger:    { bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.4)', text: colors.errorLt },
  success:   { bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.4)', text: colors.successLt },
};

const sizeStyles: Record<ButtonSize, { height: number; paddingH: number; fontSize: number; gap: number; iconSize: number }> = {
  xs: { height: 28, paddingH: 10, fontSize: 11, gap: 4,  iconSize: 12 },
  sm: { height: 32, paddingH: 12, fontSize: 13, gap: 5,  iconSize: 14 },
  md: { height: 40, paddingH: 16, fontSize: 14, gap: 6,  iconSize: 16 },
  lg: { height: 48, paddingH: 20, fontSize: 16, gap: 8,  iconSize: 18 },
  xl: { height: 56, paddingH: 24, fontSize: 17, gap: 10, iconSize: 20 },
};

export const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      variant   = 'primary',
      size      = 'md',
      loading   = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      style,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => {
    const vStyle = variantStyles[variant];
    const sStyle = sizeStyles[size];
    const isDisabled = disabled || loading;

    return (
      <TouchableOpacity
        ref={ref}
        disabled={isDisabled}
        activeOpacity={0.75}
        style={[
          styles.base,
          {
            height:            sStyle.height,
            paddingHorizontal: sStyle.paddingH,
            backgroundColor:   vStyle.bg,
            borderColor:       vStyle.border,
            gap:               sStyle.gap,
            opacity:           isDisabled ? 0.4 : 1,
          },
          fullWidth && styles.fullWidth,
          style,
        ]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator size="small" color={vStyle.text} />
        ) : (
          <>
            {iconLeft && (
              <View style={{ width: sStyle.iconSize, height: sStyle.iconSize }}>{iconLeft}</View>
            )}
            {children != null && (
              <Text
                style={[
                  styles.label,
                  { fontSize: sStyle.fontSize, color: vStyle.text },
                ]}
                numberOfLines={1}
              >
                {children}
              </Text>
            )}
            {iconRight && (
              <View style={{ width: sStyle.iconSize, height: sStyle.iconSize }}>{iconRight}</View>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  },
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    borderRadius:   radii.lg,
    borderWidth:    1,
    overflow:       'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontWeight:     typography.fontWeight.semibold,
    letterSpacing:  -0.1,
    includeFontPadding: false,
  },
});
