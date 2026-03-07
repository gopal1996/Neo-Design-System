import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  // All RN ecosystem deps are peer deps — don't bundle them
  external: [
    'react',
    'react-native',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-gesture-handler',
    'react-native-svg',
    'expo-status-bar',
    'expo-constants',
  ],
});
