import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.?(ts|tsx|js|jsx)'],
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
          // Redirect react-native imports to react-native-web for web builds
          'react-native': 'react-native-web',
        },
      },
      define: {
        // Required by some RN internals
        __DEV__: JSON.stringify(true),
        global: 'window',
      },
    });
  },
};

export default config;
