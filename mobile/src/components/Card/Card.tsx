import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing } from '../../tokens';

export type CardVariant = 'default' | 'elevated' | 'brand' | 'flat';

export interface CardProps {
  variant?:     CardVariant;
  interactive?: boolean;
  padding?:     'none' | 'sm' | 'md' | 'lg' | 'xl';
  style?:       ViewStyle;
  children:     React.ReactNode;
  onPress?:     () => void;
}

const variantStyles: Record<CardVariant, { bg: string; border: string }> = {
  default:  { bg: colors.bgElevated, border: colors.border },
  elevated: { bg: colors.bgOverlay,  border: colors.border },
  brand:    { bg: 'rgba(124,58,237,0.06)', border: 'rgba(109,40,217,0.30)' },
  flat:     { bg: colors.bgMuted,    border: colors.borderSubtle },
};

const paddingMap: Record<NonNullable<CardProps['padding']>, number> = {
  none: 0,
  sm:   spacing[3],
  md:   spacing[4],
  lg:   spacing[6],
  xl:   spacing[8],
};

export const Card: React.FC<CardProps> = ({
  variant     = 'default',
  interactive = false,
  padding     = 'md',
  style,
  children,
  onPress,
}) => {
  const v   = variantStyles[variant];
  const pad = paddingMap[padding];
  const containerStyle: ViewStyle = {
    backgroundColor: v.bg,
    borderColor:     v.border,
    padding:         pad,
  };

  if (interactive) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.base, containerStyle, style]}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.base, containerStyle, style]}>
      {children}
    </View>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children, style,
}) => (
  <View style={[styles.header, style]}>{children}</View>
);

export const CardBody: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children, style,
}) => (
  <View style={[styles.body, style]}>{children}</View>
);

export const CardFooter: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children, style,
}) => (
  <View style={[styles.footer, style]}>{children}</View>
);

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.xl,
    borderWidth:  1,
    overflow:     'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing[3],
    paddingTop:    spacing[4],
    paddingHorizontal: spacing[4],
  },
  body: {
    padding: spacing[4],
  },
  footer: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical:   spacing[4],
    borderTopWidth:    1,
    borderTopColor:    colors.borderSubtle,
  },
});
