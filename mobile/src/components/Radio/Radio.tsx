import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../tokens';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps {
  checked?:        boolean;
  defaultChecked?: boolean;
  onChange?:       (checked: boolean) => void;
  label?:          string;
  description?:    string;
  error?:          string;
  size?:           RadioSize;
  disabled?:       boolean;
  value?:          string;
  style?:          ViewStyle;
}

const sizeConfig: Record<RadioSize, { outer: number; inner: number; fontSize: number }> = {
  sm: { outer: 14, inner: 6,  fontSize: 13 },
  md: { outer: 16, inner: 8,  fontSize: 14 },
  lg: { outer: 20, inner: 10, fontSize: 16 },
};

export const Radio: React.FC<RadioProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  label,
  description,
  error,
  size     = 'md',
  disabled = false,
  style,
}) => {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const isChecked = isControlled ? checked! : internal;

  const scale   = useRef(new Animated.Value(isChecked ? 1 : 0)).current;
  const bgColor = useRef(new Animated.Value(isChecked ? 1 : 0)).current;
  const cfg     = sizeConfig[size];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale,   { toValue: isChecked ? 1 : 0, useNativeDriver: true, damping: 12, stiffness: 160 }),
      Animated.timing(bgColor, { toValue: isChecked ? 1 : 0, duration: 150, useNativeDriver: false }),
    ]).start();
  }, [isChecked]);

  const handlePress = () => {
    if (disabled || isChecked) return;
    if (!isControlled) setInternal(true);
    onChange?.(true);
  };

  const borderC = error ? colors.error : isChecked ? colors.violet500 : colors.borderStrong;

  return (
    <View style={[styles.wrapper, disabled && styles.disabled, style]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
        style={styles.row}
        accessibilityRole="radio"
        accessibilityState={{ checked: isChecked, disabled }}
      >
        <View
          style={[
            styles.outer,
            {
              width:       cfg.outer,
              height:      cfg.outer,
              borderRadius: cfg.outer / 2,
              borderColor: borderC,
              backgroundColor: isChecked ? 'rgba(124,58,237,0.1)' : colors.bgElevated,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.inner,
              {
                width:           cfg.inner,
                height:          cfg.inner,
                borderRadius:    cfg.inner / 2,
                backgroundColor: colors.violet500,
                transform:       [{ scale }],
                opacity:         scale,
              },
            ]}
          />
        </View>

        {label && (
          <Text style={[styles.label, { fontSize: cfg.fontSize }]}>{label}</Text>
        )}
      </TouchableOpacity>

      {description && !error && (
        <Text style={[styles.description, { paddingLeft: cfg.outer + spacing[2] }]}>{description}</Text>
      )}
      {error && (
        <Text style={[styles.errorText, { paddingLeft: cfg.outer + spacing[2] }]} accessibilityRole="alert">{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper:   { gap: 2 },
  disabled:  { opacity: 0.45 },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing[2],
  },
  outer: {
    borderWidth:    1.5,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  inner: {},
  label: {
    fontWeight:         typography.fontWeight.medium,
    color:              colors.textPrimary,
    includeFontPadding: false,
    lineHeight:         20,
    flex:               1,
  },
  description: {
    fontSize:  13,
    color:     colors.textTertiary,
    lineHeight: 18,
  },
  errorText: {
    fontSize:  13,
    color:     colors.error,
    lineHeight: 18,
  },
});
