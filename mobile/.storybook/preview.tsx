import React from 'react';
import type { Preview } from '@storybook/react-native';
import { View } from 'react-native';
import { colors } from '../src/tokens';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'Base',
      values: [
        { name: 'Base',     value: colors.bgBase },
        { name: 'Subtle',   value: colors.bgSubtle },
        { name: 'Elevated', value: colors.bgElevated },
      ],
    },
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: colors.bgBase, padding: 16, justifyContent: 'center' }}>
        <Story />
      </View>
    ),
  ],
};

export default preview;
