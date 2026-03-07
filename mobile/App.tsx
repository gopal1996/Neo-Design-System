import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from './src/tokens';
import StorybookUI from './.rnstorybook';

const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

/**
 * Placeholder app entry point.
 * Run with STORYBOOK_ENABLED=true to load the Storybook UI instead.
 *   npm run storybook
 */
export default function App() {
  if (isStorybook) {
    return <StorybookUI />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.badge}>
        <Text style={styles.overline}>Design System</Text>
      </View>
      <Text style={styles.title}>Neo</Text>
      <Text style={styles.subtitle}>
        Run{' '}
        <Text style={styles.code}>npm run storybook</Text>
        {'\n'}to browse components
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: colors.bgBase,
    alignItems:      'center',
    justifyContent:  'center',
    gap:             16,
    padding:         32,
  },
  badge: {
    backgroundColor:  'rgba(124,58,237,0.15)',
    borderColor:      'rgba(109,40,217,0.4)',
    borderWidth:      1,
    borderRadius:     9999,
    paddingHorizontal: 12,
    paddingVertical:   4,
  },
  overline: {
    fontSize:      11,
    fontWeight:    '600',
    color:         colors.violet300,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize:      48,
    fontWeight:    '800',
    color:         colors.textPrimary,
    letterSpacing: -2,
  },
  subtitle: {
    fontSize:   15,
    color:      colors.textSecondary,
    textAlign:  'center',
    lineHeight: 24,
  },
  code: {
    fontFamily: 'monospace',
    color:      colors.violet300,
    fontSize:   14,
  },
});
