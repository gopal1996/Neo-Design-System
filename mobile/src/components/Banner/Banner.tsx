import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../tokens';

export type BannerVariant = 'info' | 'success' | 'warning' | 'error';

export interface BannerAction {
  label:   string;
  onPress: () => void;
}

export interface BannerProps {
  variant?:         BannerVariant;
  title?:           string;
  description:      string;
  icon?:            React.ReactNode;
  action?:          BannerAction;
  secondaryAction?: BannerAction;
  onDismiss?:       () => void;
  style?:           ViewStyle;
}

const variantConfig: Record<BannerVariant, {
  bg: string; border: string; iconBg: string;
  titleColor: string; textColor: string; actionColor: string;
  defaultIcon: React.ReactNode;
}> = {
  info: {
    bg:          colors.infoBg,
    border:      'rgba(6,182,212,0.25)',
    iconBg:      'rgba(6,182,212,0.15)',
    titleColor:  colors.infoLt,
    textColor:   colors.textSecondary,
    actionColor: colors.infoLt,
    defaultIcon: <InfoIcon />,
  },
  success: {
    bg:          colors.successBg,
    border:      'rgba(16,185,129,0.25)',
    iconBg:      'rgba(16,185,129,0.15)',
    titleColor:  colors.successLt,
    textColor:   colors.textSecondary,
    actionColor: colors.successLt,
    defaultIcon: <SuccessIcon />,
  },
  warning: {
    bg:          colors.warningBg,
    border:      'rgba(245,158,11,0.25)',
    iconBg:      'rgba(245,158,11,0.15)',
    titleColor:  colors.warningLt,
    textColor:   colors.textSecondary,
    actionColor: colors.warningLt,
    defaultIcon: <WarningIcon />,
  },
  error: {
    bg:          colors.errorBg,
    border:      'rgba(239,68,68,0.25)',
    iconBg:      'rgba(239,68,68,0.15)',
    titleColor:  colors.errorLt,
    textColor:   colors.textSecondary,
    actionColor: colors.errorLt,
    defaultIcon: <ErrorIcon />,
  },
};

function InfoIcon() {
  return (
    <View style={{ width: 16, height: 16 }}>
      <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.infoLt, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.infoLt, fontSize: 10, fontWeight: '700', lineHeight: 12 }}>i</Text>
      </View>
    </View>
  );
}

function SuccessIcon() {
  return (
    <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.successLt, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 9, height: 5, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: colors.successLt, transform: [{ rotate: '-45deg' }, { translateY: -1 }] }} />
    </View>
  );
}

function WarningIcon() {
  return (
    <View style={{ width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.warningLt, fontSize: 14, fontWeight: '800', lineHeight: 16, includeFontPadding: false } as any}>!</Text>
    </View>
  );
}

function ErrorIcon() {
  return (
    <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.errorLt, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.errorLt, fontSize: 10, fontWeight: '800', lineHeight: 12 }}>✕</Text>
    </View>
  );
}

function CloseIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 14, height: 14, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color, fontSize: 14, lineHeight: 14, fontWeight: '700', includeFontPadding: false } as any}>✕</Text>
    </View>
  );
}

export const Banner: React.FC<BannerProps> = ({
  variant         = 'info',
  title,
  description,
  icon,
  action,
  secondaryAction,
  onDismiss,
  style,
}) => {
  const cfg = variantConfig[variant];

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: cfg.bg, borderColor: cfg.border },
        style,
      ]}
      accessibilityRole="alert"
    >
      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: cfg.iconBg }]}>
        {icon ?? cfg.defaultIcon}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {title && (
          <Text style={[styles.title, { color: cfg.titleColor }]}>{title}</Text>
        )}
        <Text style={[styles.description, { color: cfg.textColor }]}>{description}</Text>

        {(action || secondaryAction) && (
          <View style={styles.actions}>
            {action && (
              <TouchableOpacity onPress={action.onPress} activeOpacity={0.7}>
                <Text style={[styles.actionLabel, { color: cfg.actionColor }]}>{action.label}</Text>
              </TouchableOpacity>
            )}
            {secondaryAction && (
              <TouchableOpacity onPress={secondaryAction.onPress} activeOpacity={0.7}>
                <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{secondaryAction.label}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Dismiss */}
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          activeOpacity={0.7}
          style={styles.dismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <CloseIcon color={cfg.titleColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           spacing[3],
    borderWidth:   1,
    borderRadius:  radii.lg,
    padding:       spacing[4],
  },
  iconWrap: {
    width:          32,
    height:         32,
    borderRadius:   radii.md,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  content: {
    flex: 1,
    gap:  4,
  },
  title: {
    fontSize:           14,
    fontWeight:         typography.fontWeight.semibold,
    includeFontPadding: false,
    lineHeight:         20,
  },
  description: {
    fontSize:           14,
    fontWeight:         typography.fontWeight.regular,
    includeFontPadding: false,
    lineHeight:         20,
  },
  actions: {
    flexDirection: 'row',
    gap:           spacing[4],
    marginTop:     spacing[2],
  },
  actionLabel: {
    fontSize:           13,
    fontWeight:         typography.fontWeight.semibold,
    includeFontPadding: false,
  },
  dismiss: {
    width:          24,
    height:         24,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
});
