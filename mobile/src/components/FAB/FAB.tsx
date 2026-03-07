import React, { useRef, useEffect } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../tokens';

export type FABSize    = 'sm' | 'md' | 'lg';
export type FABVariant = 'primary' | 'secondary' | 'surface';

export interface FABProps {
  icon:        React.ReactNode;
  label?:      string;
  size?:       FABSize;
  variant?:    FABVariant;
  onPress:     () => void;
  visible?:    boolean;
  disabled?:   boolean;
  style?:      ViewStyle;
  accessibilityLabel: string;
}

const sizeConfig: Record<FABSize, { size: number; iconSize: number; fontSize: number; extended: { paddingH: number; height: number } }> = {
  sm: { size: 40, iconSize: 18, fontSize: 13, extended: { paddingH: 14, height: 36 } },
  md: { size: 56, iconSize: 24, fontSize: 14, extended: { paddingH: 20, height: 48 } },
  lg: { size: 64, iconSize: 28, fontSize: 15, extended: { paddingH: 24, height: 56 } },
};

const variantConfig: Record<FABVariant, { bg: string; text: string; shadow: string }> = {
  primary:   { bg: colors.violet500, text: '#ffffff',             shadow: 'rgba(124,58,237,0.5)' },
  secondary: { bg: colors.bgOverlay, text: colors.violet300,      shadow: 'rgba(0,0,0,0.3)' },
  surface:   { bg: colors.bgMuted,   text: colors.textSecondary,  shadow: 'rgba(0,0,0,0.25)' },
};

export const FAB: React.FC<FABProps> = ({
  icon,
  label,
  size        = 'md',
  variant     = 'primary',
  onPress,
  visible     = true,
  disabled    = false,
  style,
  accessibilityLabel,
}) => {
  const scaleAnim   = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const opacityAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim,   { toValue: visible ? 1 : 0, useNativeDriver: true, damping: 14, stiffness: 180 }),
      Animated.timing(opacityAnim, { toValue: visible ? 1 : 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  const cfg = sizeConfig[size];
  const vcfg = variantConfig[variant];
  const isExtended = !!label;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.82}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.fab,
          {
            backgroundColor: vcfg.bg,
            width:            isExtended ? undefined : cfg.size,
            height:           isExtended ? cfg.extended.height : cfg.size,
            borderRadius:     isExtended ? radii.full : cfg.size / 2,
            paddingHorizontal: isExtended ? cfg.extended.paddingH : 0,
            gap:              isExtended ? spacing[2] : 0,
            opacity:          disabled ? 0.45 : 1,
            shadowColor:      vcfg.shadow,
          },
        ]}
      >
        {/* Icon */}
        <Animated.View style={{ width: cfg.iconSize, height: cfg.iconSize }}>
          {icon}
        </Animated.View>

        {/* Label for extended FAB */}
        {isExtended && (
          <Text style={[styles.label, { fontSize: cfg.fontSize, color: vcfg.text }]} numberOfLines={1}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {},
  fab: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.4,
    shadowRadius:   8,
    elevation:      6,
  },
  label: {
    fontWeight:         typography.fontWeight.semibold,
    includeFontPadding: false,
    color:              '#ffffff',
  },
});
