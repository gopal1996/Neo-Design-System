import React from 'react';
import type { Preview } from '@storybook/react';
import { colors } from '../src/tokens';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: colors.bgBase,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
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
};

export default preview;
