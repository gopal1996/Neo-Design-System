import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  type ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '../../tokens';

export type AppBarVariant = 'default' | 'transparent' | 'elevated';

export interface AppBarProps {
  title:        string;
  subtitle?:    string;
  left?:        React.ReactNode;
  right?:       React.ReactNode;
  variant?:     AppBarVariant;
  /** Extra top padding for status bar (defaults to auto-detect) */
  safeAreaTop?: number;
  style?:       ViewStyle;
}

const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;

const variantStyles: Record<AppBarVariant, { bg: string; border: string | undefined; shadow: boolean }> = {
  default:     { bg: colors.bgSubtle,   border: colors.border,  shadow: false },
  transparent: { bg: 'transparent',    border: undefined,      shadow: false },
  elevated:    { bg: colors.bgOverlay, border: colors.border,  shadow: true  },
};

export const AppBar: React.FC<AppBarProps> = ({
  title,
  subtitle,
  left,
  right,
  variant     = 'default',
  safeAreaTop,
  style,
}) => {
  const v      = variantStyles[variant];
  const topPad = safeAreaTop ?? STATUS_BAR_HEIGHT;

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: v.bg,
          borderBottomWidth: v.border ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: v.border,
          paddingTop:        topPad + spacing[2],
        },
        v.shadow && styles.shadow,
        style,
      ]}
      accessibilityRole="header"
    >
      {/* Left slot */}
      <View style={styles.side}>
        {left}
      </View>

      {/* Center — title / subtitle */}
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        )}
      </View>

      {/* Right slot */}
      <View style={[styles.side, styles.sideRight]}>
        {right}
      </View>
    </View>
  );
};

/** Convenience back-button for use in the `left` slot */
export const AppBarBackButton: React.FC<{
  onPress: () => void;
  label?:  string;
}> = ({ onPress, label }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={styles.iconBtn}
    accessibilityRole="button"
    accessibilityLabel={label ?? 'Go back'}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  >
    <View style={styles.iconWrap}>
      {/* Chevron left */}
      <View style={[styles.chevron, styles.chevronTop]} />
      <View style={[styles.chevron, styles.chevronBottom]} />
    </View>
  </TouchableOpacity>
);

/** Icon-button wrapper for action icons in the `right` slot */
export const AppBarAction: React.FC<{
  icon:             React.ReactNode;
  onPress:          () => void;
  accessibilityLabel: string;
  badge?:           boolean | number;
}> = ({ icon, onPress, accessibilityLabel, badge }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={styles.iconBtn}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  >
    <View style={{ width: 24, height: 24 }}>{icon}</View>
    {badge !== undefined && badge !== false && (
      <View style={styles.badge}>
        {typeof badge === 'number' && badge > 0 && (
          <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
        )}
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: {
    flexDirection:    'row',
    alignItems:       'center',
    paddingHorizontal: spacing[4],
    paddingBottom:     spacing[3],
    gap:              spacing[2],
    minHeight:        56,
  },
  shadow: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius:  6,
    elevation:     4,
  },
  side: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
    minWidth:      40,
  },
  sideRight: {
    justifyContent: 'flex-end',
  },
  center: {
    flex:      1,
    alignItems: 'center',
  },
  title: {
    fontSize:           17,
    fontWeight:         typography.fontWeight.semibold,
    color:              colors.textPrimary,
    includeFontPadding: false,
    letterSpacing:      -0.3,
  },
  subtitle: {
    fontSize:           12,
    fontWeight:         typography.fontWeight.regular,
    color:              colors.textSecondary,
    includeFontPadding: false,
    marginTop:          1,
  },
  iconBtn: {
    width:          40,
    height:         40,
    alignItems:     'center',
    justifyContent: 'center',
    borderRadius:   20,
  },
  iconWrap: {
    width:          20,
    height:         20,
    alignItems:     'center',
    justifyContent: 'center',
  },
  chevron: {
    position:     'absolute',
    width:        10,
    height:       2,
    borderRadius: 1,
    backgroundColor: colors.textPrimary,
  },
  chevronTop:    { transform: [{ rotate: '-45deg' }, { translateY: -3 }] },
  chevronBottom: { transform: [{ rotate:  '45deg' }, { translateY:  3 }] },
  badge: {
    position:        'absolute',
    top:             6,
    right:           6,
    minWidth:        8,
    height:          8,
    borderRadius:    4,
    backgroundColor: colors.error,
    borderWidth:     1.5,
    borderColor:     colors.bgSubtle,
    alignItems:      'center',
    justifyContent:  'center',
  },
  badgeText: {
    fontSize:           7,
    color:              '#fff',
    fontWeight:         typography.fontWeight.bold,
    includeFontPadding: false,
  },
});
