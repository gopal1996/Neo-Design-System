import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../tokens';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps {
  checked?:        boolean;
  defaultChecked?: boolean;
  onChange?:       (checked: boolean) => void;
  label?:          string;
  description?:    string;
  error?:          string;
  size?:           CheckboxSize;
  disabled?:       boolean;
  indeterminate?:  boolean;
  style?:          ViewStyle;
}

const sizeConfig: Record<CheckboxSize, { box: number; fontSize: number; radius: number }> = {
  sm: { box: 14, fontSize: 13, radius: radii.xs },
  md: { box: 16, fontSize: 14, radius: radii.sm },
  lg: { box: 20, fontSize: 16, radius: radii.md },
};

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  label,
  description,
  error,
  size        = 'md',
  disabled    = false,
  indeterminate = false,
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
      Animated.spring(scale, { toValue: isChecked || indeterminate ? 1 : 0, useNativeDriver: true, damping: 12, stiffness: 160 }),
      Animated.timing(bgColor, { toValue: isChecked || indeterminate ? 1 : 0, duration: 150, useNativeDriver: false }),
    ]).start();
  }, [isChecked, indeterminate]);

  const handlePress = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const bg = bgColor.interpolate({
    inputRange:  [0, 1],
    outputRange: [colors.bgElevated, colors.violet500],
  });

  const borderC = error ? colors.error
                : isChecked || indeterminate ? colors.violet500
                : colors.borderStrong;

  return (
    <View style={[styles.wrapper, disabled && styles.disabled, style]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
        style={styles.row}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked, disabled }}
      >
        <Animated.View
          style={[
            styles.box,
            {
              width:           cfg.box,
              height:          cfg.box,
              borderRadius:    cfg.radius,
              borderColor:     borderC,
              backgroundColor: bg,
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale }], opacity: scale }}>
            {indeterminate ? (
              <View style={[styles.dash, { width: cfg.box * 0.55 }]} />
            ) : (
              <View style={styles.checkmark}>
                <View style={[styles.checkLeft,  { height: cfg.box * 0.28, width: cfg.box * 0.22 }]} />
                <View style={[styles.checkRight, { height: cfg.box * 0.52, width: cfg.box * 0.22 }]} />
              </View>
            )}
          </Animated.View>
        </Animated.View>

        {label && (
          <Text style={[styles.label, { fontSize: cfg.fontSize }]}>{label}</Text>
        )}
      </TouchableOpacity>

      {description && !error && (
        <Text style={[styles.description, { paddingLeft: cfg.box + spacing[2] }]}>{description}</Text>
      )}
      {error && (
        <Text style={[styles.errorText, { paddingLeft: cfg.box + spacing[2] }]} accessibilityRole="alert">{error}</Text>
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
  box: {
    borderWidth:    1.5,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  checkmark: {
    flexDirection: 'row',
    alignItems:    'flex-end',
    gap:           1,
    transform:     [{ rotate: '45deg' }],
  },
  checkLeft: {
    backgroundColor: '#FFFFFF',
    borderRadius:    1,
    marginBottom:    0,
  },
  checkRight: {
    backgroundColor: '#FFFFFF',
    borderRadius:    1,
  },
  dash: {
    height:          2,
    backgroundColor: '#FFFFFF',
    borderRadius:    1,
  },
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
