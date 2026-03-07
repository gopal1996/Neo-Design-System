import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type TextInputProps,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../tokens';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?:    string;
  hint?:     string;
  error?:    string;
  size?:     InputSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  style?:    ViewStyle;
}

const sizeConfig: Record<InputSize, { height: number; fontSize: number; paddingH: number }> = {
  sm: { height: 32, fontSize: 13, paddingH: spacing[3] },
  md: { height: 40, fontSize: 14, paddingH: spacing[4] },
  lg: { height: 48, fontSize: 16, paddingH: spacing[4] },
};

export const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    {
      label,
      hint,
      error,
      size      = 'md',
      iconLeft,
      iconRight,
      fullWidth = false,
      style,
      editable  = true,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const cfg = sizeConfig[size];
    const isDisabled = editable === false;

    const rowStyle: ViewStyle = {
      height:          cfg.height,
      borderColor:     error   ? colors.error
                     : focused ? colors.borderFocus
                     :           colors.border,
      borderWidth:     focused && !error ? 1.5 : 1,
      opacity:         isDisabled ? 0.5 : 1,
    };

    return (
      <View style={[styles.wrapper, fullWidth && styles.fullWidth, style]}>
        {label && (
          <Text style={styles.label}>{label}</Text>
        )}
        <View style={[styles.row, rowStyle]}>
          {iconLeft && (
            <View style={[styles.icon, styles.iconLeft]}>{iconLeft}</View>
          )}
          <TextInput
            ref={ref}
            editable={editable}
            placeholderTextColor={colors.textTertiary}
            onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
            onBlur={(e)  => { setFocused(false); rest.onBlur?.(e); }}
            style={[
              styles.input,
              {
                fontSize:         cfg.fontSize,
                paddingHorizontal: cfg.paddingH,
                paddingLeft:  iconLeft  ? cfg.paddingH + 24 : cfg.paddingH,
                paddingRight: iconRight ? cfg.paddingH + 24 : cfg.paddingH,
              },
            ]}
            {...rest}
          />
          {iconRight && (
            <View style={[styles.icon, styles.iconRight]}>{iconRight}</View>
          )}
        </View>
        {error && (
          <Text style={styles.error} accessibilityRole="alert">{error}</Text>
        )}
        {hint && !error && (
          <Text style={styles.hint}>{hint}</Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[1],
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize:   14,
    fontWeight: typography.fontWeight.medium,
    color:      colors.textSecondary,
    marginBottom: 2,
  },
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.bgElevated,
    borderRadius:    radii.lg,
    position:        'relative',
    overflow:        'hidden',
  },
  input: {
    flex:               1,
    color:              colors.textPrimary,
    fontWeight:         typography.fontWeight.regular,
    includeFontPadding: false,
  },
  icon: {
    position:       'absolute',
    top:            0,
    bottom:         0,
    width:          40,
    alignItems:     'center',
    justifyContent: 'center',
  },
  iconLeft:  { left: 0 },
  iconRight: { right: 0 },
  error: {
    fontSize: 13,
    color:    colors.error,
    lineHeight: 18,
  },
  hint: {
    fontSize: 13,
    color:    colors.textTertiary,
    lineHeight: 18,
  },
});
