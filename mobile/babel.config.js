module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      '@storybook/react-native/babel',
      {
        configPath: './.storybook',
      },
    ],
  ],
};
