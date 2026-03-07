import React, { useEffect, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors, radii, typography } from '../../tokens';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  checked?:        boolean;
  defaultChecked?: boolean;
  onChange?:       (checked: boolean) => void;
  disabled?:       boolean;
  size?:           SwitchSize;
  label?:          string;
  hint?:           string;
  style?:          ViewStyle;
}

const sizeConfig: Record<SwitchSize, {
  trackW: number; trackH: number;
  thumbSize: number; thumbOffset: number; thumbTravel: number;
}> = {
  sm: { trackW: 32, trackH: 18, thumbSize: 12, thumbOffset: 3, thumbTravel: 14 },
  md: { trackW: 44, trackH: 24, thumbSize: 18, thumbOffset: 3, thumbTravel: 20 },
  lg: { trackW: 56, trackH: 30, thumbSize: 22, thumbOffset: 4, thumbTravel: 26 },
};

export const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size     = 'md',
  label,
  hint,
  style,
}) => {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const isOn = isControlled ? checked! : internal;

  const anim = useRef(new Animated.Value(isOn ? 1 : 0)).current;
  const cfg  = sizeConfig[size];

  useEffect(() => {
    Animated.timing(anim, {
      toValue:         isOn ? 1 : 0,
      duration:        200,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  const handlePress = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const translateX = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [cfg.thumbOffset, cfg.thumbOffset + cfg.thumbTravel],
  });

  const trackBg = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [colors.neutral700, colors.violet500],
  });

  return (
    <View style={[styles.wrapper, disabled && styles.disabled, style]}>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          disabled={disabled}
          accessibilityRole="switch"
          accessibilityState={{ checked: isOn, disabled }}
        >
          <Animated.View
            style={[
              styles.track,
              {
                width:           cfg.trackW,
                height:          cfg.trackH,
                borderRadius:    cfg.trackH / 2,
                backgroundColor: trackBg,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.thumb,
                {
                  width:        cfg.thumbSize,
                  height:       cfg.thumbSize,
                  borderRadius: cfg.thumbSize / 2,
                  top:          (cfg.trackH - cfg.thumbSize) / 2,
                  transform:    [{ translateX }],
                },
              ]}
            />
          </Animated.View>
        </TouchableOpacity>

        {label && (
          <Text style={styles.label}>{label}</Text>
        )}
      </View>

      {hint && (
        <Text style={styles.hint}>{hint}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper:  { gap: 4 },
  disabled: { opacity: 0.5 },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           12,
  },
  track: {
    position: 'relative',
    overflow: 'hidden',
  },
  thumb: {
    position:        'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.15,
    shadowRadius:    2,
    elevation:       2,
  },
  label: {
    fontSize:           14,
    fontWeight:         typography.fontWeight.medium,
    color:              colors.textPrimary,
    includeFontPadding: false,
  },
  hint: {
    fontSize: 13,
    color:    colors.textTertiary,
    lineHeight: 18,
  },
});
