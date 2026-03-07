/**
 * Neo Mobile Design System — Tokens
 * React Native compatible (plain number values for spacing/radii/sizes)
 */

export const colors = {
  // Backgrounds
  bgBase:     '#000000',
  bgSubtle:   '#08080F',
  bgElevated: '#0F0F1A',
  bgOverlay:  '#13131F',
  bgMuted:    '#1A1A2E',

  // Violet scale
  violet950: '#1A0640',
  violet900: '#2E0D6E',
  violet800: '#4C1D95',
  violet700: '#5B21B6',
  violet600: '#6D28D9',
  violet500: '#7C3AED',
  violet400: '#8B5CF6',
  violet300: '#A78BFA',
  violet200: '#C4B5FD',
  violet100: '#DDD6FE',
  violet50:  '#EDE9FE',

  // Neutral scale
  neutral900: '#16162A',
  neutral800: '#1E1E35',
  neutral700: '#2C2C4A',
  neutral600: '#3D3D5C',
  neutral500: '#55556E',
  neutral400: '#6B6B8A',
  neutral300: '#9898B3',
  neutral200: '#C5C5D8',
  neutral100: '#E2E2EE',
  neutral50:  '#F0F0F8',

  // Semantic
  success:   '#10B981',
  successLt: '#34D399',
  successBg: '#0A2A1F',
  warning:   '#F59E0B',
  warningLt: '#FCD34D',
  warningBg: '#2A1F06',
  error:     '#EF4444',
  errorLt:   '#F87171',
  errorBg:   '#2A0A0A',
  info:      '#06B6D4',
  infoLt:    '#22D3EE',
  infoBg:    '#041F26',

  // Text
  textPrimary:   '#F0F0F8',
  textSecondary: '#9898B3',
  textTertiary:  '#6B6B8A',
  textDisabled:  '#3D3D5C',
  textBrand:     '#A78BFA',

  // Borders
  border:       '#2C2C4A',
  borderSubtle: '#1E1E35',
  borderStrong: '#3D3D5C',
  borderBrand:  '#6D28D9',
  borderFocus:  '#8B5CF6',
} as const;

/** 4px grid spacing tokens (dp values) */
export const spacing = {
  0:  0,
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  7:  28,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const radii = {
  none: 0,
  xs:   2,
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  '2xl': 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter',
    mono: 'JetBrainsMono',
  },
  fontSize: {
    caption:  12,
    bodyXs:   13,
    bodySm:   14,
    body:     16,
    bodyLg:   18,
    h4:       20,
    h3:       24,
    h2:       30,
    h1:       36,
  },
  fontWeight: {
    regular:   '400' as const,
    medium:    '500' as const,
    semibold:  '600' as const,
    bold:      '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight:   1.25,
    snug:    1.375,
    normal:  1.5,
    relaxed: 1.625,
  },
} as const;

/** Minimum touch target (44×44 dp per HIG / Material) */
export const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 } as const;
