import React from 'react';
import { View, Text, Image, StyleSheet, type ViewStyle } from 'react-native';
import { colors, radii, typography } from '../../tokens';

export type AvatarSize   = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps {
  src?:    string;
  alt?:    string;
  name?:   string;
  size?:   AvatarSize;
  status?: AvatarStatus;
  style?:  ViewStyle;
}

const VIOLET_SHADES = [colors.violet500, colors.violet600, colors.violet700, colors.violet400, colors.violet300];
const getColorFromName = (name: string) => VIOLET_SHADES[name.charCodeAt(0) % VIOLET_SHADES.length];
const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const sizePx: Record<AvatarSize, number> = {
  xs:  24,
  sm:  32,
  md:  40,
  lg:  48,
  xl:  64,
  '2xl': 80,
};

const statusColors: Record<AvatarStatus, string> = {
  online:  colors.success,
  offline: colors.neutral500,
  busy:    colors.error,
  away:    colors.warning,
};

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', status, style }) => {
  const px       = sizePx[size];
  const fontSize = Math.round(px * 0.34);

  return (
    <View
      style={[
        styles.base,
        {
          width:       px,
          height:      px,
          borderRadius: px / 2,
        },
        style,
      ]}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={{ width: px, height: px, borderRadius: px / 2 }}
          accessibilityLabel={name ?? 'avatar'}
        />
      ) : name ? (
        <View style={[styles.initials, { backgroundColor: getColorFromName(name) }]}>
          <Text style={[styles.initialsText, { fontSize }]}>{getInitials(name)}</Text>
        </View>
      ) : (
        <View style={styles.placeholder} />
      )}

      {status && (
        <View
          style={[
            styles.status,
            {
              width:           Math.round(px * 0.28),
              height:          Math.round(px * 0.28),
              borderRadius:    px,
              backgroundColor: statusColors[status],
            },
          ]}
        />
      )}
    </View>
  );
};

export const AvatarGroup: React.FC<{
  avatars: AvatarProps[];
  max?:    number;
  size?:   AvatarSize;
}> = ({ avatars, max = 4, size = 'md' }) => {
  const visible = avatars.slice(0, max);
  const rest    = avatars.length - visible.length;
  const px      = sizePx[size];
  const offset  = Math.round(px * 0.5);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {visible.map((avatar, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -offset, zIndex: visible.length - i }}>
          <Avatar {...avatar} size={size} style={{ borderWidth: 2, borderColor: colors.bgBase }} />
        </View>
      ))}
      {rest > 0 && (
        <View
          style={[
            styles.overflowBadge,
            {
              width:        px,
              height:       px,
              borderRadius: px / 2,
              marginLeft:   -offset,
            },
          ]}
        >
          <Text style={[styles.overflowText, { fontSize: Math.round(px * 0.28) }]}>+{rest}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow:    'hidden',
    borderWidth:  1.5,
    borderColor:  colors.border,
    backgroundColor: colors.bgMuted,
  },
  initials: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  initialsText: {
    color:              '#FFFFFF',
    fontWeight:         typography.fontWeight.semibold,
    includeFontPadding: false,
    letterSpacing:      0.5,
  },
  placeholder: {
    flex:            1,
    backgroundColor: colors.bgMuted,
  },
  status: {
    position:    'absolute',
    bottom:      0,
    right:       0,
    borderWidth:  2,
    borderColor:  colors.bgBase,
  },
  overflowBadge: {
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: colors.neutral800,
    borderWidth:      1.5,
    borderColor:      colors.border,
  },
  overflowText: {
    color:              colors.textSecondary,
    fontWeight:         typography.fontWeight.semibold,
    includeFontPadding: false,
  },
});
