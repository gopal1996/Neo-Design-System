import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../tokens';

export interface BottomNavItem {
  id:     string;
  label:  string;
  icon:   (active: boolean) => React.ReactNode;
  badge?: string | number | boolean;
}

export interface BottomNavigationProps {
  items:           BottomNavItem[];
  active:          string;
  onChange:        (id: string) => void;
  /** Extra bottom padding for home indicator (pass safeAreaInsets.bottom) */
  safeAreaBottom?: number;
  style?:          ViewStyle;
}

const INDICATOR_W = 24;

const TabItem: React.FC<{
  item:     BottomNavItem;
  isActive: boolean;
  onPress:  () => void;
}> = ({ item, isActive, onPress }) => {
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale,   { toValue: isActive ? 1 : 0.85, useNativeDriver: true, damping: 15, stiffness: 200 }),
      Animated.timing(opacity, { toValue: isActive ? 1 : 0,    duration: 150, useNativeDriver: false }),
    ]).start();
  }, [isActive]);

  const labelColor = opacity.interpolate({
    inputRange:  [0, 1],
    outputRange: [colors.textTertiary, colors.violet300],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={item.label}
    >
      {/* Active pill indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            opacity,
            transform: [{ scaleX: opacity.interpolate({ inputRange: [0,1], outputRange: [0.3,1] }) }],
          },
        ]}
      />

      {/* Icon */}
      <View style={styles.iconWrap}>
        <Animated.View style={{ transform: [{ scale }] }}>
          {item.icon(isActive)}
        </Animated.View>

        {/* Badge */}
        {item.badge !== undefined && item.badge !== false && (
          <View style={[
            styles.badge,
            typeof item.badge === 'number' && item.badge > 0 ? styles.badgeNum : styles.badgeDot,
          ]}>
            {typeof item.badge === 'number' && item.badge > 0 && (
              <Text style={styles.badgeText}>{item.badge > 99 ? '99+' : item.badge}</Text>
            )}
          </View>
        )}
      </View>

      {/* Label */}
      <Animated.Text
        style={[styles.label, { color: labelColor }]}
        numberOfLines={1}
      >
        {item.label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  active,
  onChange,
  safeAreaBottom = 0,
  style,
}) => (
  <View
    style={[
      styles.root,
      { paddingBottom: safeAreaBottom + spacing[2] },
      style,
    ]}
    accessibilityRole="tablist"
  >
    {items.map((item) => (
      <TabItem
        key={item.id}
        item={item}
        isActive={active === item.id}
        onPress={() => onChange(item.id)}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flexDirection:     'row',
    backgroundColor:   colors.bgSubtle,
    borderTopWidth:    StyleSheet.hairlineWidth,
    borderTopColor:    colors.border,
    paddingTop:        spacing[2],
    paddingHorizontal: spacing[2],
    ...Platform.select({
      ios: {
        shadowColor:   '#000',
        shadowOffset:  { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius:  8,
      },
      android: { elevation: 8 },
    }),
  },
  tab: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            4,
    paddingVertical: spacing[1],
  },
  indicator: {
    width:           INDICATOR_W,
    height:          3,
    borderRadius:    radii.full,
    backgroundColor: colors.violet500,
    marginBottom:    2,
  },
  iconWrap: {
    width:    28,
    height:   28,
    alignItems:     'center',
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    fontSize:           10,
    fontWeight:         typography.fontWeight.medium,
    includeFontPadding: false,
    textAlign:          'center',
  },
  badge: {
    position:        'absolute',
    top:             -2,
    right:           -4,
    backgroundColor: colors.error,
    borderRadius:    radii.full,
    borderWidth:     1.5,
    borderColor:     colors.bgSubtle,
    alignItems:      'center',
    justifyContent:  'center',
  },
  badgeDot: { width: 8, height: 8 },
  badgeNum: { minWidth: 16, height: 16, paddingHorizontal: 3 },
  badgeText: {
    fontSize:           9,
    color:              '#fff',
    fontWeight:         typography.fontWeight.bold,
    includeFontPadding: false,
  },
});
