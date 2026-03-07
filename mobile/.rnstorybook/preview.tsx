import React from 'react';
import { View } from 'react-native';
import type { Preview } from '@storybook/react-native';
import { colors } from '../src/tokens';

const preview: Preview = {
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: colors.bgBase, padding: 16, justifyContent: 'center' }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'Base',
      values: [
        { name: 'Base',     value: colors.bgBase },
        { name: 'Subtle',   value: colors.bgSubtle },
        { name: 'Elevated', value: colors.bgElevated },
      ],
    },
  },
};

export default preview;
