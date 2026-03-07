import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Path is relative to repo root (storybook runs from there, not from mobile/)
  stories: ['../mobile/src/components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      resolve: {
        alias: {
          'react-native': 'react-native-web',
        },
      },
      define: {
        __DEV__: JSON.stringify(true),
        global: 'window',
      },
      // Provide tsconfig inline so esbuild doesn't try to resolve
      // expo/tsconfig.base from mobile/tsconfig.json
      esbuild: {
        tsconfigRaw: {
          compilerOptions: {
            target: 'ES2020',
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            moduleResolution: 'bundler',
            jsx: 'react-jsx',
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
          },
        },
      },
    });
  },
};

export default config;
